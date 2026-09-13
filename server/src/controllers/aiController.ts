import { Request, Response } from 'express';
import { Department } from '../models/Department';
import { User } from '../models/User';
import { Activity } from '../models/Activity';
import {
  generateWorkspaceSyncBriefing,
  generateDepartmentStandup,
  askWorkspaceAssistant,
} from '../services/geminiService';

// @desc    Run Gemini AI Workspace Synchronization & Briefing
// @route   POST /api/ai/sync-briefing
// @access  Public / Private
export const getSyncBriefing = async (_req: Request, res: Response): Promise<void> => {
  try {
    const departments = await Department.find();
    const employees = await User.find();

    const briefing = await generateWorkspaceSyncBriefing(departments, employees);

    // Record sync event in activity log
    await Activity.create({
      user: 'Synthetix AI',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      action: 'completed enterprise workspace sync',
      target: `${departments.length} departments (${briefing.velocityScore}% velocity)`,
    });

    res.status(200).json(briefing);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'AI sync briefing generation failed' });
  }
};

// @desc    Generate Department Standup Agenda via Gemini AI
// @route   POST /api/ai/standup
// @access  Public / Private
export const getStandup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { departmentName } = req.body;

    let department = null;
    if (departmentName) {
      department = await Department.findOne({ name: departmentName });
    }

    if (!department) {
      department = await Department.findOne();
    }

    const agenda = await generateDepartmentStandup(
      department ? department.name : 'Engineering',
      department ? department.leadName : 'Alex Morgan',
      department ? department.memberCount : 24,
      department ? department.activeProjects : 8
    );

    res.status(200).json(agenda);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to generate standup agenda' });
  }
};

// @desc    Ask Synthetix Workspace Assistant via Gemini AI
// @route   POST /api/ai/assistant
// @access  Public / Private
export const askAssistant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { question } = req.body;
    if (!question) {
      res.status(400).json({ message: 'Question parameter is required' });
      return;
    }

    const departments = await Department.find();
    const employees = await User.find();

    const context = {
      totalEmployees: employees.length,
      departmentsCount: departments.length,
      departments: departments.map((d) => ({
        name: d.name,
        lead: d.leadName,
        members: d.memberCount,
        projects: d.activeProjects,
      })),
    };

    const answer = await askWorkspaceAssistant(question, context);
    res.status(200).json({ question, answer });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'AI Assistant processing error' });
  }
};

// @desc    Get live activities
// @route   GET /api/ai/activities
// @access  Public / Private
export const getActivities = async (_req: Request, res: Response): Promise<void> => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json(activities);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch activities' });
  }
};
