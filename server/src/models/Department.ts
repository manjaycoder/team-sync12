import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  description: string;
  leadName: string;
  leadAvatar: string;
  memberCount: number;
  activeProjects: number;
  budget: string;
  color: string;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: 'Cross-functional department focused on key organizational objectives.',
    },
    leadName: {
      type: String,
      required: [true, 'Lead name is required'],
    },
    leadAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    memberCount: {
      type: Number,
      default: 1,
      min: 0,
    },
    activeProjects: {
      type: Number,
      default: 1,
      min: 0,
    },
    budget: {
      type: String,
      default: '$250,000',
    },
    color: {
      type: String,
      default: 'from-violet-600 to-indigo-600',
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

export const Department: Model<IDepartment> = mongoose.model<IDepartment>('Department', DepartmentSchema);
