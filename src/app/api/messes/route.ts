import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Mess } from '@/lib/models/Mess';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const messes = await Mess.find({}).sort({ createdAt: -1 });
    return NextResponse.json(messes);
  } catch (error: any) {
    console.error('Error fetching messes:', error);
    return NextResponse.json({ error: 'Failed to fetch messes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const mess = await Mess.create(body);
    return NextResponse.json(mess, { status: 201 });
  } catch (error: any) {
    console.error('Error creating mess:', error);
    return NextResponse.json({ error: 'Failed to create mess' }, { status: 500 });
  }
}
