import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Mess } from '@/lib/models/Mess';
import { Review } from '@/lib/models/Review';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const id = (await params).id;
    
    // Delete the mess
    await Mess.findByIdAndDelete(id);
    
    // Delete associated reviews
    await Review.deleteMany({ targetId: id, targetType: 'mess' });
    
    return NextResponse.json({ message: 'Mess deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete mess' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const id = (await params).id;
    const body = await request.json();
    const mess = await Mess.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(mess);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update mess' }, { status: 500 });
  }
}
