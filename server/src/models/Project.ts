import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  department: string;
  leadName: string;
  leadAvatar?: string;
  status: 'planning' | 'active' | 'in_progress' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  budget: string;
  startDate?: string;
  deadline?: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: 'Cross-functional enterprise project.',
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    leadName: {
      type: String,
      required: [true, 'Project lead name is required'],
      trim: true,
    },
    leadAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    status: {
      type: String,
      enum: ['planning', 'active', 'in_progress', 'completed', 'on_hold'],
      default: 'active',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    budget: {
      type: String,
      default: '$100,000',
    },
    startDate: {
      type: String,
      default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    },
    deadline: {
      type: String,
      default: 'Q4 2026',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Project: Model<IProject> = mongoose.model<IProject>('Project', ProjectSchema);
