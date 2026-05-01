import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Booking } from '@/lib/models/Booking';
import { User } from '@/lib/models/User';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const ownerId = searchParams.get('ownerId');

    await dbConnect();
    
    let query = {};
    if (userId) query = { userId };
    
    const bookings = await Booking.find(query).lean().sort({ createdAt: -1 });
    
    // Enrich with user names for the owner view
    const enrichedBookings = await Promise.all(bookings.map(async (b: any) => {
      const student = await User.findOne({ uid: b.userId }).lean();
      return { ...b, studentName: student?.name || 'Unknown Student' };
    }));

    return NextResponse.json(enrichedBookings);
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
