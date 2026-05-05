'use client';
import { useEffect, useState } from 'react';
import { MapPin, Star, CheckCircle, Info, Calendar, User, Users, ShieldCheck, Laptop, Home, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RoomDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, mongoUser } = useAuth();
  const [room, setRoom] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (!params.id) return;
    
    fetch('/api/rooms', { cache: 'no-store' }).then(res => res.json()).then(data => {
      if (Array.isArray(data)) {
        const found = data.find(r => r._id === params.id);
        setRoom(found);
      }
    });

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
        userId: user.uid,
        studentName: mongoUser?.name || user.displayName || 'Student'
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

  const bedsAvailable = Math.max(0, room.totalBeds - (room.occupiedBeds || 0));
  const vacancyColor = room.vacancyStatus === 'Available' ? 'var(--success)' : room.vacancyStatus === 'Few Beds Left' ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="animate-fade-in">
      <button 
        onClick={() => router.back()} 
        className="btn-secondary" 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: '0.5rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: '600', color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={18} /> Back to Stays
      </button>
      
      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      <div>
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
            {(room.images?.length > 0 ? room.images : ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop']).map((img: string, i: number) => (
               <img key={i} src={img} alt={`${room.name} ${i}`} style={{ height: '300px', borderRadius: '12px', minWidth: '100%', objectFit: 'cover' }} />
            ))}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{room.name}</h1>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                <MapPin size={18} /> {room.location} • {room.collegeDistance} km from college
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ padding: '0.5rem 1rem', borderRadius: '20px', background: `${vacancyColor}20`, color: vacancyColor, fontWeight: '700', fontSize: '0.9rem', border: `1px solid ${vacancyColor}` }}>
                {room.vacancyStatus || 'Available'}
              </span>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ borderBottom: '2px solid var(--primary-color)', display: 'inline-block', paddingBottom: '0.25rem', marginBottom: '1.5rem' }}>Description</h3>
            <p style={{ whiteSpace: 'pre-line', fontSize: '1.05rem' }}>{room.description}</p>
          </div>
        </div>

        {/* Structured Facilities Section */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Premium Facilities</h3>
          
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>
                <Home size={18} /> Basic Facilities
              </h4>
              <ul style={{ listStyle: 'none' }}>
                {(room.facilities?.basic || []).map((item: string) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                    <CheckCircle size={14} color="var(--success)" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>
                <Laptop size={18} /> Appliances Allowed
              </h4>
              <ul style={{ listStyle: 'none' }}>
                {(room.facilities?.appliances || []).map((item: string) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                    <CheckCircle size={14} color="var(--success)" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>
                <ShieldCheck size={18} /> Security & Rules
              </h4>
              <ul style={{ listStyle: 'none' }}>
                {(room.facilities?.security || []).map((item: string) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                    <CheckCircle size={14} color="var(--success)" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section moved here */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Reviews ({room.reviewCount})</h3>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', color: 'var(--warning)', marginBottom: '1.5rem' }}>
            <Star fill="currentColor" /> {room.rating ? room.rating.toFixed(1) : 'No ratings yet'} / 5.0
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {reviews.length > 0 ? reviews.map(rev => (
              <div key={rev._id} style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '0.9rem' }}>{rev.studentName || 'Verified Student'}</strong>
                  <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}><Star size={14} fill="currentColor" /> {rev.rating}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{rev.comment}"</p>
              </div>
            )) : <p>No reviews yet. Be the first to review!</p>}
          </div>

          <form onSubmit={submitReview} style={{ marginTop: '2rem', background: 'rgba(0,0,0,0.03)', padding: '1.5rem', borderRadius: '12px' }}>
            <h4 style={{ marginBottom: '1rem' }}>Share Your Experience</h4>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <select className="input-field" style={{ width: '150px', marginBottom: 0 }} value={newReview.rating} onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
              </select>
              <button className="btn btn-secondary" style={{ flex: 1 }}>Submit Review</button>
            </div>
            <textarea className="input-field" required rows={3} placeholder="How was the stay? Mention facilities and environment..." value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} style={{ marginBottom: 0 }}></textarea>
          </form>
        </div>
      </div>

      <div>
        <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Stay Details</h3>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-color)' }}>₹{room.rent || 'N/A'}</span>
              <span style={{ 
                padding: '0.4rem 1rem', 
                borderRadius: '20px', 
                fontSize: '0.9rem', 
                fontWeight: '700',
                background: room.gender === 'Boys' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(236, 72, 153, 0.1)',
                color: room.gender === 'Boys' ? 'var(--primary-color)' : 'var(--accent-color)',
                border: `1px solid ${room.gender === 'Boys' ? 'var(--primary-color)' : 'var(--accent-color)'}20`
              }}>
                {room.gender ? room.gender.toUpperCase() : 'STUDENT'} ONLY
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>Monthly Rental Amount</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={18} /> Total Capacity</span>
              <span style={{ fontWeight: '600' }}>{room.totalBeds} Beds</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={18} /> Occupied</span>
              <span style={{ fontWeight: '600' }}>{room.occupiedBeds || 0} Beds</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: `${bedsAvailable > 0 ? 'var(--success)' : 'var(--danger)'}10`, borderRadius: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}><Info size={18} /> Available Now</span>
              <span style={{ fontWeight: '800', color: bedsAvailable > 0 ? 'var(--success)' : 'var(--danger)' }}>{bedsAvailable} Beds</span>
            </div>
            {room.expectedVacancyDate && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={18} /> Expected Vacancy</span>
                <span style={{ fontWeight: '600' }}>{new Date(room.expectedVacancyDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <button onClick={handleBooking} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>Request Booking</button>
        </div>
      </div>
    </div>
  </div>
);
}
