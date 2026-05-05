import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMess extends Document {
  name: string;
  location: string;
  feesBoys: number;
  feesGirls: number;
  menu: {
    monday: { breakfast: string; lunch: string; dinner: string };
    tuesday: { breakfast: string; lunch: string; dinner: string };
    wednesday: { breakfast: string; lunch: string; dinner: string };
    thursday: { breakfast: string; lunch: string; dinner: string };
    friday: { breakfast: string; lunch: string; dinner: string };
    saturday: { breakfast: string; lunch: string; dinner: string };
    sunday: { breakfast: string; lunch: string; dinner: string };
  };
  vegNonVeg: 'Veg' | 'Non-Veg' | 'Both';
  serviceFor: 'Boys' | 'Girls' | 'Both';
  specialSundayMenu: string;
  detailedRatings: {
    hygiene: number;
    taste: number;
    quantity: number;
  };
  collegeDistance: number;
  images: string[];
  kitchenImages: string[];
  ownerId: string;
  rating: number;
  reviewCount: number;
}

const MessSchema = new Schema<IMess>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  feesBoys: { type: Number, required: true },
  feesGirls: { type: Number, required: true },
  menu: {
    monday: { breakfast: String, lunch: String, dinner: String },
    tuesday: { breakfast: String, lunch: String, dinner: String },
    wednesday: { breakfast: String, lunch: String, dinner: String },
    thursday: { breakfast: String, lunch: String, dinner: String },
    friday: { breakfast: String, lunch: String, dinner: String },
    saturday: { breakfast: String, lunch: String, dinner: String },
    sunday: { breakfast: String, lunch: String, dinner: String },
  },
  vegNonVeg: { type: String, enum: ['Veg', 'Non-Veg', 'Both'], default: 'Veg' },
  serviceFor: { type: String, enum: ['Boys', 'Girls', 'Both'], default: 'Both' },
  specialSundayMenu: { type: String },
  detailedRatings: {
    hygiene: { type: Number, default: 0 },
    taste: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
  },
  collegeDistance: { type: Number, required: true },
  images: [String],
  kitchenImages: [String],
  ownerId: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

export const Mess: Model<IMess> = mongoose.models.Mess || mongoose.model<IMess>('Mess', MessSchema);
