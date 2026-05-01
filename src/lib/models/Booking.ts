import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  userId: string;
  targetId: string;
  targetType: 'room' | 'mess';
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  userId: { type: String, required: true }, // Using string for dummy auth compatibility
  targetId: { type: Schema.Types.ObjectId, required: true, refPath: 'targetType' },
  targetType: { type: String, enum: ['Room', 'Mess'], required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
