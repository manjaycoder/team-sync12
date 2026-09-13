import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  projectId?: mongoose.Types.ObjectId;
  projectName: string;
  department: string;
  assigneeId?: mongoose.Types.ObjectId;
  assigneeName: string;
  assigneeAvatar: string;
  assigneeEmail: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  estimatedHours?: number;
  createdBy?: string;
  completedByAI?: boolean;
  aiCompletionSummary?: string;
  completedAt?: string;
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    projectName: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    assigneeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    assigneeName: {
      type: String,
      required: [true, 'Assignee name is required'],
      trim: true,
    },
    assigneeAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    assigneeEmail: {
      type: String,
      required: [true, 'Assignee email is required'],
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'review', 'completed'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    dueDate: {
      type: String,
      default: () =>
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
    },
    estimatedHours: {
      type: Number,
      default: 8,
      min: 1,
    },
    createdBy: {
      type: String,
      default: 'Admin',
    },
    completedByAI: {
      type: Boolean,
      default: false,
    },
    aiCompletionSummary: {
      type: String,
      default: '',
    },
    completedAt: {
      type: String,
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

export const Task: Model<ITask> = mongoose.model<ITask>('Task', TaskSchema);
