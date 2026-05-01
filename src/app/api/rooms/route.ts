import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Room } from '@/lib/models/Room';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const rooms = await Room.find({}).sort({ createdAt: -1 });
    return NextResponse.json(rooms);
  } catch (error: any) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

import { RoomSchema } from '@/lib/validations/room';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Validate input
    const validatedData = RoomSchema.parse(body);
    
    const room = await Room.create(validatedData);
    return NextResponse.json(room, { status: 201 });
  } catch (error: any) {
    console.error('Error creating room:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
