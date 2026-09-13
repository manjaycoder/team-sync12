import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IActivity extends Document {
  user: string;
  avatar: string;
  action: string;
  target: string;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    user: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    action: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
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

export const Activity: Model<IActivity> = mongoose.model<IActivity>('Activity', ActivitySchema);
