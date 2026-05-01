import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Review } from '@/lib/models/Review';
import { Room } from '@/lib/models/Room';
import { Mess } from '@/lib/models/Mess';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get('targetId');

    if (!targetId) {
      return NextResponse.json({ error: 'targetId is required' }, { status: 400 });
    }

    await dbConnect();
    const reviews = await Review.find({ targetId }).sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Create the review
    const review = await Review.create(body);

    // Calculate new average rating
    const allReviews = await Review.find({ targetId: body.targetId });
    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
    
    // Update the parent model
    const Model = body.targetType.toLowerCase() === 'room' ? Room : Mess;
    await Model.findByIdAndUpdate(body.targetId, { 
      rating: Number(avgRating.toFixed(1)),
      reviewCount: allReviews.length 
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to post review' }, { status: 500 });
  }
}
