import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  userId: string;
  studentName?: string;
  targetId: string;
  targetType: 'room' | 'mess';
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  userId: { type: String, required: true },
  studentName: { type: String },
  targetId: { type: Schema.Types.ObjectId, required: true, refPath: 'targetType' },
  targetType: { type: String, enum: ['Room', 'Mess'], required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
