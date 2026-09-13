import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { Activity } from '../models/Activity';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public / Private
export const getProjects = async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch projects' });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Public / Private
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.status(200).json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch project' });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, department, leadName, leadAvatar, status, priority, progress, budget, deadline } = req.body;

    if (!name || !department || !leadName) {
      res.status(400).json({ message: 'Project name, department, and lead name are required' });
      return;
    }

    const project = await Project.create({
      name,
      description: description || 'Cross-functional enterprise project.',
      department,
      leadName,
      leadAvatar: leadAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: status || 'active',
      priority: priority || 'medium',
      progress: Number(progress) || 0,
      budget: budget || '$100,000',
      deadline: deadline || 'Q4 2026',
    });

    // Log enterprise activity
    await Activity.create({
      user: leadName,
      avatar: project.leadAvatar,
      action: 'initiated strategic project',
      target: name,
    });

    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to create project' });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update project' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete project' });
  }
};
