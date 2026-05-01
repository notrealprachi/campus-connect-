'use client';
import { useEffect, useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function MessDetailsPage() {
  const params = useParams();
  const { user } = useAuth();
  const [mess, setMess] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (!params.id) return;
    
    // Fetch mess details
    fetch('/api/messes').then(res => res.json()).then(data => {
      if (Array.isArray(data)) {
        setMess(data.find(m => m._id === params.id));
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
        targetType: 'Mess',
        userId: user.uid
      })
    });

    if (res.ok) {
      window.location.reload();
    }
  };

  const handleBooking = async () => {
    if (!user) {
      alert('Please login to book a mess service.');
      window.location.href = '/login';
      return;
    }

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.uid,
        targetId: params.id,
        targetType: 'Mess',
        status: 'pending'
      })
    });

    if (res.ok) {
      alert('Booking request sent successfully!');
    } else {
      alert('Failed to send booking request.');
    }
  };

  if (!mess) return <p>Loading mess details...</p>;

  return (
    <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <img src={mess.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'} alt={mess.name} style={{ width: '100%', borderRadius: '8px', marginBottom: '1.5rem', maxHeight: '400px', objectFit: 'cover' }} />
        <h1>{mess.name}</h1>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <MapPin /> {mess.location} • {mess.collegeDistance} km from college
        </p>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Weekly Menu</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {mess.menu && Object.entries(mess.menu).map(([day, meals]: any) => (
            <div key={day} style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <strong style={{ textTransform: 'capitalize', display: 'block', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{day}</strong>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                <div><span style={{ color: 'var(--text-secondary)' }}>Lunch:</span> {meals.lunch}</div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Dinner:</span> {meals.dinner}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3>Subscription Fees</h3>
          <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Boys:</span>
              <strong style={{ color: 'var(--accent-color)' }}>₹{mess.fees.boys}/mo</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Girls:</span>
              <strong style={{ color: 'var(--accent-color)' }}>₹{mess.fees.girls}/mo</strong>
            </div>
          </div>
          <button onClick={handleBooking} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Book Now</button>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3>Reviews & Ratings ({mess.reviewCount})</h3>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', color: 'var(--warning)', margin: '1rem 0' }}>
            <Star fill="currentColor" /> {mess.rating ? mess.rating.toFixed(1) : 'No ratings yet'} / 5.0
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
