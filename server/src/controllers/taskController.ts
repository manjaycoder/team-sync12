import { Request, Response } from 'express';
import { Task } from '../models/Task';
import { Project } from '../models/Project';
import { Activity } from '../models/Activity';
import { completeTaskWithAI } from '../services/geminiService';

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
