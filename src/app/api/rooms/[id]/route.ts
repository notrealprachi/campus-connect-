import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Room } from '@/lib/models/Room';
import { Review } from '@/lib/models/Review';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const id = (await params).id;
    
    // Delete the room
    await Room.findByIdAndDelete(id);
    
    // Delete associated reviews
    await Review.deleteMany({ targetId: id, targetType: 'room' });
    
    return NextResponse.json({ message: 'Room deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete room' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const id = (await params).id;
    const body = await request.json();
    const room = await Room.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(room);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 });
  }
}
