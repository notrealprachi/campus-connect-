import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { Booking } from '@/lib/models/Booking';
import { User } from '@/lib/models/User';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const ownerId = searchParams.get('ownerId');

    await dbConnect();
    
    if (ownerId) {
      // Find all rooms and messes owned by this user
      const [rooms, messes] = await Promise.all([
        mongoose.model('Room').find({ ownerId }).select('name').lean(),
        mongoose.model('Mess').find({ ownerId }).select('name').lean()
      ]);
      
      const propertyMap = new Map();
      rooms.forEach((r: any) => propertyMap.set(r._id.toString(), r.name));
      messes.forEach((m: any) => propertyMap.set(m._id.toString(), m.name));
      
      const propertyIds = Array.from(propertyMap.keys());
      
      const bookings = await Booking.find({ targetId: { $in: propertyIds } }).lean().sort({ createdAt: -1 });
      
      const enriched = await Promise.all(bookings.map(async (b: any) => {
        const student = await User.findOne({ uid: b.userId }).select('name').lean();
        return {
          ...b,
          studentName: student?.name || 'Unknown Student',
          propertyName: propertyMap.get(b.targetId.toString()) || 'Unknown Property'
        };
      }));
      
      return NextResponse.json(enriched);
    }

    let query = {};
    if (userId) query = { userId };
    
    const bookings = await Booking.find(query).lean().sort({ createdAt: -1 });
    
    // For student view, we still need property names
    const enriched = await Promise.all(bookings.map(async (b: any) => {
      const model = b.targetType === 'Room' ? mongoose.model('Room') : mongoose.model('Mess');
      const property = await model.findById(b.targetId).select('name').lean();
      return { ...b, propertyName: property?.name || 'Unknown Property' };
    }));

    return NextResponse.json(enriched);
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const booking = await Booking.create(body);
    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
