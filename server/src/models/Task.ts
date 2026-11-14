import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IChecklistItem {
  _id?: mongoose.Types.ObjectId;
  id?: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAcceptanceCriterion {
  _id?: mongoose.Types.ObjectId;
  id?: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAttachment {
  _id?: mongoose.Types.ObjectId;
  id?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  filePath: string;
  uploadedBy: string;
  uploadedById?: mongoose.Types.ObjectId;
  uploadedAt: Date;
}

export interface ITask extends Document {
  title: string;
  description: string;
  companyId?: string;
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
  checklist: IChecklistItem[];
  acceptanceCriteria: IAcceptanceCriterion[];
  attachments: IAttachment[];
}

const ChecklistItemSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Checklist item title is required'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const AcceptanceCriterionSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, 'Acceptance criterion description is required'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const AttachmentSchema = new Schema(
  {
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    fileType: {
      type: String,
      required: [true, 'File type is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
    },
    uploadedBy: {
      type: String,
      default: 'TeamSync Member',
    },
    uploadedById: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

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
    companyId: {
      type: String,
      default: 'teamsync-default',
      index: true,
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
    checklist: {
      type: [ChecklistItemSchema],
      default: [],
    },
    acceptanceCriteria: {
      type: [AcceptanceCriterionSchema],
      default: [],
    },
    attachments: {
      type: [AttachmentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        if (ret.checklist && Array.isArray(ret.checklist)) {
          ret.checklist = ret.checklist.map((item: any) => ({
            ...item,
            id: item._id ? item._id.toString() : item.id,
          }));
        }
        if (ret.acceptanceCriteria && Array.isArray(ret.acceptanceCriteria)) {
          ret.acceptanceCriteria = ret.acceptanceCriteria.map((item: any) => ({
            ...item,
            id: item._id ? item._id.toString() : item.id,
          }));
        }
        if (ret.attachments && Array.isArray(ret.attachments)) {
          ret.attachments = ret.attachments.map((item: any) => ({
            ...item,
            id: item._id ? item._id.toString() : item.id,
          }));
        }
        return ret;
      },
    },
  }
);

export const Task: Model<ITask> = mongoose.model<ITask>('Task', TaskSchema);
