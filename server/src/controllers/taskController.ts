import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { Task } from '../models/Task';
import { Project } from '../models/Project';
import { Activity } from '../models/Activity';
import { completeTaskWithAI } from '../services/geminiService';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get all tasks with optional filters
// @route   GET /api/tasks
// @access  Public / Private
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { assigneeEmail, projectId, status, department } = req.query;
    const filter: Record<string, any> = {};

    if (assigneeEmail) {
      filter.assigneeEmail = String(assigneeEmail).toLowerCase();
    }
    if (projectId) {
      filter.projectId = projectId;
    }
    if (status) {
      filter.status = status;
    }
    if (department) {
      filter.department = department;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    const formatted = tasks.map((t) => {
      const obj = t.toJSON();
      obj.id = t._id.toString();
      return obj;
    });
    res.status(200).json(formatted);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch tasks' });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Public / Private
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    const obj = task.toJSON();
    obj.id = task._id.toString();
    res.status(200).json(obj);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch task' });
  }
};

// @desc    Create / Allocate new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      projectId,
      projectName,
      department,
      assigneeId,
      assigneeName,
      assigneeAvatar,
      assigneeEmail,
      status,
      priority,
      dueDate,
      estimatedHours,
      createdBy,
      checklist,
      acceptanceCriteria,
    } = req.body;

    if (!title || !projectName || !assigneeName || !assigneeEmail) {
      res.status(400).json({
        message: 'Task title, project name, assignee name, and email are required',
      });
      return;
    }

    // Resolve project if projectId not provided
    let resolvedProjectId = projectId;
    let resolvedDepartment = department;
    if (!resolvedProjectId) {
      const foundProj = await Project.findOne({ name: projectName });
      if (foundProj) {
        resolvedProjectId = foundProj._id;
        resolvedDepartment = resolvedDepartment || foundProj.department;
      }
    }

    // Format initial checklist if provided
    const formattedChecklist = Array.isArray(checklist)
      ? checklist.map((item: any) => ({
          title: typeof item === 'string' ? item : item.title || '',
          completed: Boolean(item.completed),
          createdAt: new Date(),
          updatedAt: new Date(),
        })).filter((c) => c.title.trim())
      : [];

    // Format initial acceptance criteria if provided
    const formattedCriteria = Array.isArray(acceptanceCriteria)
      ? acceptanceCriteria.map((item: any) => ({
          description: typeof item === 'string' ? item : item.description || '',
          completed: Boolean(item.completed),
          createdAt: new Date(),
          updatedAt: new Date(),
        })).filter((c) => c.description.trim())
      : [];

    const task = await Task.create({
      title,
      description: description || '',
      projectId: resolvedProjectId,
      projectName,
      department: resolvedDepartment || 'Engineering',
      assigneeId,
      assigneeName,
      assigneeAvatar:
        assigneeAvatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      assigneeEmail: assigneeEmail.toLowerCase(),
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate:
        dueDate ||
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      estimatedHours: Number(estimatedHours) || 8,
      createdBy: createdBy || 'Lead Coordinator',
      checklist: formattedChecklist,
      acceptanceCriteria: formattedCriteria,
      attachments: [],
    });

    // Update Project progress based on tasks
    await syncProjectProgress(task.projectName, task.projectId?.toString());

    // Log live activity for allocation
    await Activity.create({
      user: createdBy || 'Lead Coordinator',
      avatar: task.assigneeAvatar,
      action: `allocated task "${title}" to`,
      target: assigneeName,
    });

    const obj = task.toJSON();
    obj.id = task._id.toString();
    res.status(201).json(obj);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to allocate task' });
  }
};

// @desc    Update task (status change, reassignment, completion, etc.)
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = req.params.id;
    if (!taskId || taskId === 'undefined' || taskId === 'null') {
      res.status(400).json({ message: 'Valid task ID is required' });
      return;
    }

    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const oldStatus = task.status;
    const isNowCompleting = req.body.status === 'completed' && oldStatus !== 'completed';

    // If task is transitioning to completed and lacks an AI summary, run Gemini AI completion
    if (isNowCompleting && !task.aiCompletionSummary && req.body.useAI !== false) {
      try {
        const aiSummary = await completeTaskWithAI(task);
        req.body.completedByAI = true;
        req.body.aiCompletionSummary = aiSummary;
        req.body.completedAt = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      } catch (err: any) {
        console.warn('[AI Task Complete] Non-blocking AI error:', err.message);
      }
    }

    const updated = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      res.status(404).json({ message: 'Task not found after update' });
      return;
    }

    // Automatically synchronize project completion progress!
    await syncProjectProgress(updated.projectName, updated.projectId?.toString());

    // If status transitioned, log an activity
    if (req.body.status && req.body.status !== oldStatus) {
      let actionLabel = 'updated status of';
      if (req.body.status === 'completed') actionLabel = 'completed deliverable on';
      else if (req.body.status === 'in_progress') actionLabel = 'started working on';
      else if (req.body.status === 'review') actionLabel = 'submitted for review';

      await Activity.create({
        user: updated.assigneeName || 'Team Member',
        avatar: updated.assigneeAvatar,
        action: actionLabel,
        target: updated.title || 'task',
      });
    }

    const obj = updated.toJSON();
    obj.id = updated._id.toString();
    res.status(200).json(obj);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update task' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const projectName = task.projectName;
    const projectId = task.projectId?.toString();

    // Clean up any files attached to this task on disk
    if (task.attachments && task.attachments.length > 0) {
      for (const att of task.attachments) {
        if (att.filePath && fs.existsSync(att.filePath)) {
          try {
            fs.unlinkSync(att.filePath);
          } catch (e: any) {
            console.warn('[Cleanup] Attachment disk cleanup notice:', e.message);
          }
        }
      }
    }

    await Task.findByIdAndDelete(taskId);

    // Sync project progress after deletion
    await syncProjectProgress(projectName, projectId);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete task' });
  }
};

// Helper: Synchronize project progress when tasks change
const syncProjectProgress = async (projectName: string, projectId?: string) => {
  try {
    const filter = projectId ? { projectId } : { projectName };
    const totalTasks = await Task.countDocuments(filter);
    if (totalTasks === 0) return;

    const completedTasks = await Task.countDocuments({ ...filter, status: 'completed' });
    const progress = Math.round((completedTasks / totalTasks) * 100);
    const status = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'active';

    if (projectId) {
      await Project.findByIdAndUpdate(projectId, { progress, status });
    } else {
      await Project.findOneAndUpdate({ name: projectName }, { progress, status });
    }
  } catch (err: any) {
    console.warn('[ProjectSync] Non-fatal progress sync notice:', err.message);
  }
};

// @desc    Complete task using Google Gemini AI
// @route   POST /api/tasks/:id/ai-complete
// @access  Private / Public
export const aiCompleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = req.params.id;
    if (!taskId || taskId === 'undefined' || taskId === 'null') {
      res.status(400).json({ message: 'Valid task ID is required' });
      return;
    }

    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Call Gemini AI to execute task
    const aiSummary = await completeTaskWithAI(task);

    task.status = 'completed';
    task.completedByAI = true;
    task.aiCompletionSummary = aiSummary;
    task.completedAt = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    await task.save();

    // Synchronize project progress
    await syncProjectProgress(task.projectName, task.projectId?.toString());

    // Log live activity
    await Activity.create({
      user: 'Google Gemini AI',
      avatar:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      action: `AI-completed deliverable "${task.title}" for`,
      target: task.assigneeName,
    });

    const obj = task.toJSON();
    obj.id = task._id.toString();
    res.status(200).json(obj);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to complete task with AI' });
  }
};

// =============================================================================
// CHECKLIST CONTROLLERS (Persistent in MongoDB)
// =============================================================================

// @desc    Get task checklist items
// @route   GET /api/tasks/:taskId/checklist
export const getChecklist = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    const formatted = (task.checklist || []).map((item) => ({
      id: item._id ? item._id.toString() : item.id,
      title: item.title,
      completed: item.completed,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
    res.status(200).json(formatted);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch checklist' });
  }
};

// @desc    Add item to task checklist
// @route   POST /api/tasks/:taskId/checklist
export const addChecklistItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      res.status(400).json({ message: 'Checklist item title is required' });
      return;
    }

    const task = await Task.findById(req.params.taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const newItem: any = {
      title: title.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    task.checklist.push(newItem);
    await task.save();

    // Log Activity
    await Activity.create({
      user: req.user?.name || task.assigneeName || 'Team Member',
      avatar: req.user?.avatar || task.assigneeAvatar,
      action: `added checklist item "${title.trim()}" to`,
      target: task.title,
    });

    const savedItem = task.checklist[task.checklist.length - 1];
    res.status(201).json({
      id: savedItem._id ? savedItem._id.toString() : savedItem.id,
      title: savedItem.title,
      completed: savedItem.completed,
      createdAt: savedItem.createdAt,
      updatedAt: savedItem.updatedAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to add checklist item' });
  }
};

// @desc    Update checklist item (mark complete / rename)
// @route   PUT /api/tasks/:taskId/checklist/:itemId
export const updateChecklistItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taskId, itemId } = req.params;
    const { title, completed } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const item = (task.checklist as any).id(itemId);
    if (!item) {
      res.status(404).json({ message: 'Checklist item not found' });
      return;
    }

    const wasCompleted = item.completed;
    if (title !== undefined) item.title = title.trim();
    if (completed !== undefined) item.completed = Boolean(completed);
    item.updatedAt = new Date();

    await task.save();

    // Log Activity if completion state toggled
    if (completed !== undefined && wasCompleted !== item.completed) {
      await Activity.create({
        user: req.user?.name || task.assigneeName || 'Team Member',
        avatar: req.user?.avatar || task.assigneeAvatar,
        action: item.completed ? `checked off checklist item "${item.title}" in` : `re-opened checklist item "${item.title}" in`,
        target: task.title,
      });
    }

    res.status(200).json({
      id: item._id ? item._id.toString() : item.id,
      title: item.title,
      completed: item.completed,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update checklist item' });
  }
};

// @desc    Delete checklist item
// @route   DELETE /api/tasks/:taskId/checklist/:itemId
export const deleteChecklistItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taskId, itemId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const item = (task.checklist as any).id(itemId);
    if (!item) {
      res.status(404).json({ message: 'Checklist item not found' });
      return;
    }

    const itemTitle = item.title;
    (task.checklist as any).pull(itemId);
    await task.save();

    await Activity.create({
      user: req.user?.name || task.assigneeName || 'Team Member',
      avatar: req.user?.avatar || task.assigneeAvatar,
      action: `removed checklist item "${itemTitle}" from`,
      target: task.title,
    });

    res.status(200).json({ message: 'Checklist item deleted successfully', id: itemId });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete checklist item' });
  }
};

// =============================================================================
// ACCEPTANCE CRITERIA CONTROLLERS (Persistent in MongoDB)
// =============================================================================

// @desc    Get task acceptance criteria
// @route   GET /api/tasks/:taskId/acceptance-criteria
export const getAcceptanceCriteria = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    const formatted = (task.acceptanceCriteria || []).map((c) => ({
      id: c._id ? c._id.toString() : c.id,
      description: c.description,
      completed: c.completed,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
    res.status(200).json(formatted);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch acceptance criteria' });
  }
};

// @desc    Add acceptance criterion to task
// @route   POST /api/tasks/:taskId/acceptance-criteria
export const addAcceptanceCriterion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { description } = req.body;
    if (!description || !description.trim()) {
      res.status(400).json({ message: 'Acceptance criterion description is required' });
      return;
    }

    const task = await Task.findById(req.params.taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const newCriterion: any = {
      description: description.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    task.acceptanceCriteria.push(newCriterion);
    await task.save();

    await Activity.create({
      user: req.user?.name || task.assigneeName || 'Team Member',
      avatar: req.user?.avatar || task.assigneeAvatar,
      action: `added acceptance criterion "${description.trim()}" to`,
      target: task.title,
    });

    const savedCriterion = task.acceptanceCriteria[task.acceptanceCriteria.length - 1];
    res.status(201).json({
      id: savedCriterion._id ? savedCriterion._id.toString() : savedCriterion.id,
      description: savedCriterion.description,
      completed: savedCriterion.completed,
      createdAt: savedCriterion.createdAt,
      updatedAt: savedCriterion.updatedAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to add acceptance criterion' });
  }
};

// @desc    Update acceptance criterion (mark complete / edit description)
// @route   PUT /api/tasks/:taskId/acceptance-criteria/:criteriaId
export const updateAcceptanceCriterion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taskId, criteriaId } = req.params;
    const { description, completed } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const criterion = (task.acceptanceCriteria as any).id(criteriaId);
    if (!criterion) {
      res.status(404).json({ message: 'Acceptance criterion not found' });
      return;
    }

    const wasCompleted = criterion.completed;
    if (description !== undefined) criterion.description = description.trim();
    if (completed !== undefined) criterion.completed = Boolean(completed);
    criterion.updatedAt = new Date();

    await task.save();

    // Log Activity if completion status toggled
    if (completed !== undefined && wasCompleted !== criterion.completed) {
      await Activity.create({
        user: req.user?.name || task.assigneeName || 'Team Member',
        avatar: req.user?.avatar || task.assigneeAvatar,
        action: criterion.completed ? `verified acceptance criterion "${criterion.description}" for` : `re-evaluated acceptance criterion "${criterion.description}" for`,
        target: task.title,
      });
    }

    res.status(200).json({
      id: criterion._id ? criterion._id.toString() : criterion.id,
      description: criterion.description,
      completed: criterion.completed,
      createdAt: criterion.createdAt,
      updatedAt: criterion.updatedAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update acceptance criterion' });
  }
};

// @desc    Delete acceptance criterion
// @route   DELETE /api/tasks/:taskId/acceptance-criteria/:criteriaId
export const deleteAcceptanceCriterion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taskId, criteriaId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const criterion = (task.acceptanceCriteria as any).id(criteriaId);
    if (!criterion) {
      res.status(404).json({ message: 'Acceptance criterion not found' });
      return;
    }

    const desc = criterion.description;
    (task.acceptanceCriteria as any).pull(criteriaId);
    await task.save();

    await Activity.create({
      user: req.user?.name || task.assigneeName || 'Team Member',
      avatar: req.user?.avatar || task.assigneeAvatar,
      action: `removed acceptance criterion "${desc}" from`,
      target: task.title,
    });

    res.status(200).json({ message: 'Acceptance criterion deleted successfully', id: criteriaId });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete acceptance criterion' });
  }
};

// =============================================================================
// ATTACHMENTS CONTROLLERS (Persistent in MongoDB & Disk Storage)
// =============================================================================

// @desc    Get task attachments
// @route   GET /api/tasks/:taskId/attachments
export const getAttachments = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    const formatted = (task.attachments || []).map((att) => ({
      id: att._id ? att._id.toString() : att.id,
      fileName: att.fileName,
      fileType: att.fileType,
      fileSize: att.fileSize,
      fileUrl: att.fileUrl,
      uploadedBy: att.uploadedBy,
      uploadedAt: att.uploadedAt,
    }));
    res.status(200).json(formatted);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch attachments' });
  }
};

// @desc    Upload multiple or single attachment to task
// @route   POST /api/tasks/:taskId/attachments
export const uploadAttachment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);
    if (!task) {
      // If file was stored by multer, clean up
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: 'No file provided for upload' });
      return;
    }

    const safeBaseName = path.basename(req.file.path);
    const fileUrl = `/uploads/tasks/${safeBaseName}`;

    const newAttachment: any = {
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileUrl,
      filePath: req.file.path,
      uploadedBy: req.user?.name || task.assigneeName || 'Team Member',
      uploadedById: req.user?._id,
      uploadedAt: new Date(),
    };

    task.attachments.push(newAttachment);
    await task.save();

    await Activity.create({
      user: req.user?.name || task.assigneeName || 'Team Member',
      avatar: req.user?.avatar || task.assigneeAvatar,
      action: `uploaded document "${newAttachment.fileName}" to`,
      target: task.title,
    });

    const saved = task.attachments[task.attachments.length - 1];
    res.status(201).json({
      id: saved._id ? saved._id.toString() : saved.id,
      fileName: saved.fileName,
      fileType: saved.fileType,
      fileSize: saved.fileSize,
      fileUrl: saved.fileUrl,
      uploadedBy: saved.uploadedBy,
      uploadedAt: saved.uploadedAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to upload attachment' });
  }
};

// @desc    Download task attachment
// @route   GET /api/tasks/:taskId/attachments/:attachmentId/download
export const downloadAttachment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId, attachmentId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const attachment = (task.attachments as any).id(attachmentId);
    if (!attachment) {
      res.status(404).json({ message: 'Attachment record not found' });
      return;
    }

    if (!fs.existsSync(attachment.filePath)) {
      res.status(404).json({ message: 'Attachment file does not exist on storage' });
      return;
    }

    res.download(attachment.filePath, attachment.fileName);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to download attachment' });
  }
};

// @desc    Delete task attachment
// @route   DELETE /api/tasks/:taskId/attachments/:attachmentId
export const deleteAttachment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taskId, attachmentId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const attachment = (task.attachments as any).id(attachmentId);
    if (!attachment) {
      res.status(404).json({ message: 'Attachment not found' });
      return;
    }

    const fileName = attachment.fileName;
    if (attachment.filePath && fs.existsSync(attachment.filePath)) {
      try {
        fs.unlinkSync(attachment.filePath);
      } catch (err: any) {
        console.warn('[Attachment Delete] Notice while unlinking file:', err.message);
      }
    }

    (task.attachments as any).pull(attachmentId);
    await task.save();

    await Activity.create({
      user: req.user?.name || task.assigneeName || 'Team Member',
      avatar: req.user?.avatar || task.assigneeAvatar,
      action: `removed document "${fileName}" from`,
      target: task.title,
    });

    res.status(200).json({ message: 'Attachment deleted successfully', id: attachmentId });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete attachment' });
  }
};
