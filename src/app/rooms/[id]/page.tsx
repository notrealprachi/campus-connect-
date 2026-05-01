'use client';
import { useEffect, useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RoomDetailsPage() {
  const params = useParams();
  const { user } = useAuth();
  const [room, setRoom] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (!params.id) return;
    
    // Fetch room details
    fetch('/api/rooms').then(res => res.json()).then(data => {
      if (Array.isArray(data)) {
        setRoom(data.find(r => r._id === params.id));
      }
    });

    // Fetch reviews
    fetch(`/api/reviews?targetId=${params.id}`).then(res => res.json()).then(data => {
      if (Array.isArray(data)) setReviews(data);
    });
  }, [params.id]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review.');
      return;
    }

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newReview,
        targetId: params.id,
        targetType: 'Room',
        userId: user.uid
      })
    });

    if (res.ok) {
      window.location.reload();
    }
  };

  const handleBooking = async () => {
    if (!user) {
      alert('Please login to book a room.');
      window.location.href = '/login';
      return;
    }

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.uid,
        targetId: params.id,
        targetType: 'Room',
        status: 'pending'
      })
    });

    if (res.ok) {
      alert('Booking request sent successfully!');
    } else {
      alert('Failed to send booking request.');
    }
  };

  if (!room) return <p>Loading room details...</p>;

  return (
    <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <img src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop'} alt={room.name} style={{ width: '100%', borderRadius: '8px', marginBottom: '1.5rem', maxHeight: '400px', objectFit: 'cover' }} />
        <h1>{room.name}</h1>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <MapPin /> {room.location} • {room.collegeDistance} km from college
        </p>
        <p style={{ marginTop: '1rem', whiteSpace: 'pre-line' }}>{room.description}</p>
      </div>

      <div>
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3>Booking Details</h3>
          <h2 style={{ color: 'var(--primary-color)' }}>₹{room.rent}/mo</h2>
          <p>Total Beds: {room.totalBeds}</p>
          <p>Available: {room.totalBeds - room.occupiedBeds}</p>
          <button onClick={handleBooking} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Book Now</button>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3>Reviews & Ratings ({room.reviewCount})</h3>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', color: 'var(--warning)', margin: '1rem 0' }}>
            <Star fill="currentColor" /> {room.rating ? room.rating.toFixed(1) : 'No ratings yet'} / 5.0
          </p>

          <form onSubmit={submitReview} style={{ marginTop: '1.5rem', borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem' }}>
            <h4>Write a Review</h4>
            <select className="input-field" style={{ margin: '0.5rem 0' }} value={newReview.rating} onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
            </select>
            <textarea className="input-field" required rows={3} placeholder="Share your experience..." value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} style={{ marginBottom: '1rem' }}></textarea>
            <button className="btn btn-secondary" style={{ width: '100%' }}>Submit Review</button>
          </form>

          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.map(rev => (
              <div key={rev._id} style={{ background: 'rgba(0,0,0,0.05)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Student</strong>
                  <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center' }}><Star size={14} fill="currentColor" /> {rev.rating}</span>
                </div>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
