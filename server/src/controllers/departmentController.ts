import { Request, Response } from 'express';
import { Department } from '../models/Department';
import { Activity } from '../models/Activity';

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public / Private
export const getDepartments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.status(200).json(departments);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch departments' });
  }
};

// @desc    Get department by ID
// @route   GET /api/departments/:id
// @access  Public / Private
export const getDepartmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      res.status(404).json({ message: 'Department not found' });
      return;
    }
    res.status(200).json(department);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch department' });
  }
};

// @desc    Create department
// @route   POST /api/departments
// @access  Private
export const createDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, leadName, leadAvatar, memberCount, activeProjects, budget, color } =
      req.body;

    if (!name || !leadName) {
      res.status(400).json({ message: 'Department name and lead name are required' });
      return;
    }

    const existing = await Department.findOne({ name });
    if (existing) {
      res.status(400).json({ message: 'A department with this name already exists' });
      return;
    }

    const department = await Department.create({
      name,
      description,
      leadName,
      leadAvatar:
        leadAvatar ||
        `https://images.unsplash.com/photo-${
          1530000000000 + Math.floor(Math.random() * 1000000)
        }?w=150&auto=format&fit=crop&q=80`,
      memberCount: Number(memberCount) || 1,
      activeProjects: Number(activeProjects) || 1,
      budget: budget || '$250,000',
      color: color || 'from-violet-600 to-indigo-600',
    });

    // Log live activity
    await Activity.create({
      user: leadName,
      avatar: department.leadAvatar,
      action: 'inaugurated department',
      target: name,
    });

    res.status(201).json(department);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to create department' });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private
export const updateDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      res.status(404).json({ message: 'Department not found' });
      return;
    }

    const updated = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update department' });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private
export const deleteDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      res.status(404).json({ message: 'Department not found' });
      return;
    }

    await Department.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete department' });
  }
};
