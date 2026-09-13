import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Department } from '../models/Department';
import { Activity } from '../models/Activity';
import { Project } from '../models/Project';
import { Task } from '../models/Task';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const seedInitialData = async (forceClean: boolean = true): Promise<void> => {
  try {
    if (forceClean) {
      console.log('[Seed] Clearing existing collections...');
      await User.deleteMany({});
      await Department.deleteMany({});
      await Activity.deleteMany({});
      await Project.deleteMany({});
      await Task.deleteMany({});
    }

    console.log('[Seed] Inserting departments...');
    const departments = await Department.create([
      {
        name: 'Engineering',
        description: 'Core cloud platform architecture, distributed systems & API infrastructure.',
        leadName: 'Alex Morgan',
        leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        memberCount: 24,
        activeProjects: 4,
        budget: '$450,000',
        color: 'from-blue-600 to-indigo-600',
      },
      {
        name: 'AI Research',
        description: 'Fine-tuning LLM pipelines, autonomous agents and predictive synthesis models.',
        leadName: 'Elena Rostova',
        leadAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        memberCount: 14,
        activeProjects: 3,
        budget: '$620,000',
        color: 'from-violet-600 to-fuchsia-600',
      },
      {
        name: 'Product & Design',
        description: 'User experience research, design systems, design sprint prototyping.',
        leadName: 'Marcus Chen',
        leadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        memberCount: 12,
        activeProjects: 3,
        budget: '$280,000',
        color: 'from-amber-500 to-rose-500',
      },
      {
        name: 'Operations',
        description: 'DevOps pipelines, SOC2 compliance, telemetry, cloud infrastructure reliability.',
        leadName: 'David Kim',
        leadAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        memberCount: 9,
        activeProjects: 2,
        budget: '$310,000',
        color: 'from-emerald-600 to-teal-600',
      },
      {
        name: 'Marketing & Growth',
        description: 'Enterprise brand campaigns, customer acquisition, partner ecosystems.',
        leadName: 'Sophia Alvarez',
        leadAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        memberCount: 8,
        activeProjects: 2,
        budget: '$190,000',
        color: 'from-pink-600 to-purple-600',
      },
    ]);

    console.log('[Seed] Inserting users & employees...');
    const users = await User.create([
      {
        name: 'Alex Morgan',
        email: 'alex.morgan@team-sync.space',
        password: 'password123',
        role: 'Lead Systems Architect',
        department: 'Engineering',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        joinedDate: 'Jan 2023',
        location: 'San Francisco, CA',
      },
      {
        name: 'Elena Rostova',
        email: 'elena.r@team-sync.space',
        password: 'password123',
        role: 'Staff ML Engineer',
        department: 'AI Research',
        status: 'remote',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        joinedDate: 'Mar 2023',
        location: 'Berlin, DE',
      },
      {
        name: 'Marcus Chen',
        email: 'marcus.c@team-sync.space',
        password: 'password123',
        role: 'Principal UX Designer',
        department: 'Product & Design',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        joinedDate: 'Jun 2023',
        location: 'Seattle, WA',
      },
      {
        name: 'Priya Sharma',
        email: 'priya.s@team-sync.space',
        password: 'password123',
        role: 'Engineering Manager',
        department: 'Engineering',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        joinedDate: 'Sep 2023',
        location: 'Bangalore, IN',
      },
      {
        name: 'David Kim',
        email: 'david.k@team-sync.space',
        password: 'password123',
        role: 'Senior DevOps Specialist',
        department: 'Operations',
        status: 'remote',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        joinedDate: 'Nov 2023',
        location: 'Toronto, CA',
      },
      {
        name: 'Sophia Alvarez',
        email: 'sophia.a@team-sync.space',
        password: 'password123',
        role: 'Growth Marketing Director',
        department: 'Marketing & Growth',
        status: 'on_leave',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        joinedDate: 'Feb 2024',
        location: 'Austin, TX',
      },
    ]);

    console.log('[Seed] Inserting initial activity logs...');
    await Activity.create([
      {
        user: 'Alex Morgan',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        action: 'synced department roadmap for',
        target: 'Engineering',
      },
      {
        user: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
        action: 'deployed model weight checkpoints in',
        target: 'AI Research',
      },
      {
        user: 'Marcus Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        action: 'published 2.0 design token guidelines for',
        target: 'Product & Design',
      },
      {
        user: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        action: 'completed SOC2 compliance audit sync in',
        target: 'Operations',
      },
    ]);

    console.log('[Seed] Inserting strategic enterprise projects...');
    const projects = await Project.create([
      {
        name: 'Distributed Cloud Architecture 2.0',
        description: 'Multi-region failover cluster, Kubernetes service mesh and high-throughput zero-loss message bus.',
        department: 'Engineering',
        leadName: 'Alex Morgan',
        leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        priority: 'urgent',
        progress: 68,
        budget: '$180,000',
        deadline: 'Nov 2026',
      },
      {
        name: 'Gemini Autonomous Agent Copilot',
        description: 'Fine-tuning contextual reasoning embeddings and autonomous workflows for enterprise knowledge retrieval.',
        department: 'AI Research',
        leadName: 'Elena Rostova',
        leadAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        status: 'in_progress',
        priority: 'high',
        progress: 54,
        budget: '$250,000',
        deadline: 'Dec 2026',
      },
      {
        name: 'Design System & Micro-Interactions',
        description: 'WCAG AAA accessibility compliance, glassmorphism tokens, and high-performance component catalog.',
        department: 'Product & Design',
        leadName: 'Marcus Chen',
        leadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        status: 'in_progress',
        priority: 'medium',
        progress: 82,
        budget: '$95,000',
        deadline: 'Oct 2026',
      },
      {
        name: 'SOC2 Type II Automated Compliance',
        description: 'Automated policy enforcement, infrastructure telemetry, and encrypted audit trail verification.',
        department: 'Operations',
        leadName: 'David Kim',
        leadAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        priority: 'high',
        progress: 90,
        budget: '$120,000',
        deadline: 'Sep 2026',
      },
      {
        name: 'Enterprise Growth & Global Expansion',
        description: 'International brand campaigns, localized self-serve onboarding, and partner integrations.',
        department: 'Marketing & Growth',
        leadName: 'Sophia Alvarez',
        leadAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        status: 'planning',
        priority: 'medium',
        progress: 25,
        budget: '$85,000',
        deadline: 'Jan 2027',
      },
    ]);

    console.log('[Seed] Allocating operational tasks to employees...');
    const tasks = await Task.create([
      {
        title: 'Migrate Ingress Controllers to Gateway API',
        description: 'Transition legacy Nginx ingress to Kubernetes Gateway API with blue-green canary routing.',
        projectId: projects[0]._id,
        projectName: projects[0].name,
        department: 'Engineering',
        assigneeId: users[0]._id,
        assigneeName: 'Alex Morgan',
        assigneeEmail: 'alex.morgan@team-sync.space',
        assigneeAvatar: users[0].avatar,
        status: 'in_progress',
        priority: 'urgent',
        dueDate: 'Oct 15, 2026',
        estimatedHours: 16,
        createdBy: 'Alex Morgan',
      },
      {
        title: 'Configure Multi-Region Database Read Replicas',
        description: 'Set up low-latency read replicas in Frankfurt and Singapore clusters for cross-geo parity.',
        projectId: projects[0]._id,
        projectName: projects[0].name,
        department: 'Engineering',
        assigneeId: users[0]._id,
        assigneeName: 'Alex Morgan',
        assigneeEmail: 'alex.morgan@team-sync.space',
        assigneeAvatar: users[0].avatar,
        status: 'todo',
        priority: 'high',
        dueDate: 'Nov 01, 2026',
        estimatedHours: 24,
        createdBy: 'Priya Sharma',
      },
      {
        title: 'Fine-tune Gemini Context Window Embeddings',
        description: 'Benchmark embedding models for 32k token document retrieval and semantic reranking.',
        projectId: projects[1]._id,
        projectName: projects[1].name,
        department: 'AI Research',
        assigneeId: users[1]._id,
        assigneeName: 'Elena Rostova',
        assigneeEmail: 'elena.r@team-sync.space',
        assigneeAvatar: users[1].avatar,
        status: 'in_progress',
        priority: 'urgent',
        dueDate: 'Oct 20, 2026',
        estimatedHours: 20,
        createdBy: 'Elena Rostova',
      },
      {
        title: 'Benchmark TensorRT GPU Inference Latency',
        description: 'Profile p99 latency across varying batch sizes under synthetic concurrency spikes.',
        projectId: projects[1]._id,
        projectName: projects[1].name,
        department: 'AI Research',
        assigneeId: users[1]._id,
        assigneeName: 'Elena Rostova',
        assigneeEmail: 'elena.r@team-sync.space',
        assigneeAvatar: users[1].avatar,
        status: 'review',
        priority: 'medium',
        dueDate: 'Oct 10, 2026',
        estimatedHours: 12,
        createdBy: 'Elena Rostova',
      },
      {
        title: 'Publish Design System Tokens for Dark Mode 2.0',
        description: 'Standardize CSS custom properties and Tailwind v4 themes across all layout surfaces.',
        projectId: projects[2]._id,
        projectName: projects[2].name,
        department: 'Product & Design',
        assigneeId: users[2]._id,
        assigneeName: 'Marcus Chen',
        assigneeEmail: 'marcus.c@team-sync.space',
        assigneeAvatar: users[2].avatar,
        status: 'completed',
        priority: 'high',
        dueDate: 'Sep 28, 2026',
        estimatedHours: 18,
        createdBy: 'Marcus Chen',
      },
      {
        title: 'Prototype Interactive Task Allocation Modal',
        description: 'Build high-fidelity Figma components with animated micro-interactions and quick filters.',
        projectId: projects[2]._id,
        projectName: projects[2].name,
        department: 'Product & Design',
        assigneeId: users[2]._id,
        assigneeName: 'Marcus Chen',
        assigneeEmail: 'marcus.c@team-sync.space',
        assigneeAvatar: users[2].avatar,
        status: 'review',
        priority: 'medium',
        dueDate: 'Oct 05, 2026',
        estimatedHours: 10,
        createdBy: 'Alex Morgan',
      },
      {
        title: 'Review Engineering Sprint Velocity & Backlog',
        description: 'Coordinate capacity planning and milestone commitments for Q4 enterprise deliverables.',
        projectId: projects[0]._id,
        projectName: projects[0].name,
        department: 'Engineering',
        assigneeId: users[3]._id,
        assigneeName: 'Priya Sharma',
        assigneeEmail: 'priya.s@team-sync.space',
        assigneeAvatar: users[3].avatar,
        status: 'in_progress',
        priority: 'high',
        dueDate: 'Oct 12, 2026',
        estimatedHours: 14,
        createdBy: 'Alex Morgan',
      },
      {
        title: 'Automate SOC2 Evidence Collection Scripts',
        description: 'Create scheduled cron runners that gather encrypted AWS CloudTrail logs and IAM audit trails.',
        projectId: projects[3]._id,
        projectName: projects[3].name,
        department: 'Operations',
        assigneeId: users[4]._id,
        assigneeName: 'David Kim',
        assigneeEmail: 'david.k@team-sync.space',
        assigneeAvatar: users[4].avatar,
        status: 'completed',
        priority: 'high',
        dueDate: 'Sep 30, 2026',
        estimatedHours: 22,
        createdBy: 'David Kim',
      },
      {
        title: 'Configure Real-time Prometheus Alerting Rules',
        description: 'Establish alerting thresholds for memory saturation and API error rate spikes (>1%).',
        projectId: projects[3]._id,
        projectName: projects[3].name,
        department: 'Operations',
        assigneeId: users[4]._id,
        assigneeName: 'David Kim',
        assigneeEmail: 'david.k@team-sync.space',
        assigneeAvatar: users[4].avatar,
        status: 'todo',
        priority: 'medium',
        dueDate: 'Oct 25, 2026',
        estimatedHours: 8,
        createdBy: 'David Kim',
      },
      {
        title: 'Draft Q4 Product Launch Communication Strategy',
        description: 'Align enterprise customer outreach channels and press kit documentation.',
        projectId: projects[4]._id,
        projectName: projects[4].name,
        department: 'Marketing & Growth',
        assigneeId: users[5]._id,
        assigneeName: 'Sophia Alvarez',
        assigneeEmail: 'sophia.a@team-sync.space',
        assigneeAvatar: users[5].avatar,
        status: 'todo',
        priority: 'medium',
        dueDate: 'Nov 10, 2026',
        estimatedHours: 15,
        createdBy: 'Sophia Alvarez',
      },
    ]);

    console.log(`[Seed] Successfully seeded:
- ${departments.length} departments
- ${users.length} users/employees (Demo: alex.morgan@team-sync.space / password123)
- ${projects.length} strategic projects
- ${tasks.length} allocated employee tasks
- 4 initial activities`);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    throw error;
  }
};

// Standalone execution wrapper
const runStandalone = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/team-sync';
    console.log('[Seed] Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);

    await seedInitialData(true);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Standalone run failed:', error);
    process.exit(1);
  }
};

// If run directly from CLI
if (require.main === module) {
  runStandalone();
}
