import { z } from 'zod';

export const RoomSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  location: z.string().min(3, "Location is required"),
  rent: z.number().positive(),
  gender: z.enum(['Boys', 'Girls']),
  description: z.string().min(5, "Description must be at least 5 characters"),
  totalBeds: z.number().int().positive("Total beds must be a positive integer"),
  occupiedBeds: z.number().int().nonnegative().optional().default(0),
  collegeDistance: z.number().nonnegative("Distance cannot be negative"),
  images: z.array(z.string()).optional(),
  ownerId: z.string().min(1, "Owner ID is required"),
  facilities: z.object({
    basic: z.array(z.string()).optional(),
    appliances: z.array(z.string()).optional(),
    security: z.array(z.string()).optional(),
  }).optional(),
  vacancyStatus: z.enum(['Available', 'Few Beds Left', 'No Vacancy', 'Vacancy Coming Soon']).optional().default('Available'),
  expectedVacancyDate: z.string().nullable().optional(),
});

export type RoomInput = z.infer<typeof RoomSchema>;
