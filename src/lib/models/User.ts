import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'roomOwner' | 'messOwner' | 'both';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'owner', 'roomOwner', 'messOwner', 'both'], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
