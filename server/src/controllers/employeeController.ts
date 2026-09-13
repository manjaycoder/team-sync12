import { Request, Response } from 'express';
import { User } from '../models/User';
import { Activity } from '../models/Activity';

// @desc    Get all employees with search & filtering
// @route   GET /api/employees
// @access  Private / Public
export const getEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, department, status } = req.query;

    const query: any = {};

    if (search && typeof search === 'string') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    if (department && department !== 'All') {
      query.department = department;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const employees = await User.find(query).sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch employees' });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
export const getEmployeeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }
    res.status(200).json(employee);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch employee' });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private
export const createEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, role, department, status, location, avatar } = req.body;

    if (!name || !email || !role) {
      res.status(400).json({ message: 'Name, email, and role are required' });
      return;
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      res.status(400).json({ message: 'An employee with this email already exists' });
      return;
    }

    const employee = await User.create({
      name,
      email: email.toLowerCase(),
      password: 'TemporaryPassword123!',
      role,
      department: department || 'Engineering',
      status: status || 'active',
      location: location || 'Remote',
      avatar:
        avatar ||
        `https://images.unsplash.com/photo-${
          1500000000000 + Math.floor(Math.random() * 1000000)
        }?w=150&auto=format&fit=crop&q=80`,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    });

    // Log to live activities
    await Activity.create({
      user: name,
      avatar: employee.avatar,
      action: 'joined as',
      target: `${role} (${employee.department})`,
    });

    res.status(201).json(employee);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to create employee' });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }

    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update employee' });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }

    await User.findByIdAndDelete(req.params.id);

    // Log activity
    await Activity.create({
      user: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      action: 'archived employee profile for',
      target: employee.name,
    });

    res.status(200).json({ message: 'Employee removed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete employee' });
  }
};
