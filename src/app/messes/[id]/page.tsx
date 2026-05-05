'use client';
import { useEffect, useState } from 'react';
import { MapPin, Star, Utensils, Coffee, Sun, Moon, Award, CheckCircle2, Info, Camera, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function MessDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, mongoUser } = useAuth();
  const [mess, setMess] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (!params.id) return;
    
    fetch('/api/messes').then(res => res.json()).then(data => {
      if (Array.isArray(data)) {
        setMess(data.find(m => m._id === params.id));
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
        targetType: 'Mess',
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

  const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="animate-fade-in">
      <button 
        onClick={() => router.back()} 
        className="btn-secondary" 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: '0.5rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: '600', color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={18} /> Back to Messes
      </button>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      <div>
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <img src={mess.images?.[0] || 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=800&auto=format&fit=crop'} alt={mess.name} style={{ width: '100%', borderRadius: '12px', maxHeight: '400px', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.9)', borderRadius: '20px', fontWeight: '700', color: 'var(--primary-color)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={16} /> {mess.vegNonVeg || 'Veg'} Service
            </div>
          </div>
          
          <h1>{mess.name}</h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            <MapPin size={18} /> {mess.location} • {mess.collegeDistance} km from college
          </p>

          {/* Detailed Ratings Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Taste</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2px' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < (mess.detailedRatings?.taste || 4) ? 'var(--warning)' : 'none'} color="var(--warning)" />)}
              </div>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Quantity</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2px' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < (mess.detailedRatings?.quantity || 4) ? 'var(--warning)' : 'none'} color="var(--warning)" />)}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Menu Section */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Utensils size={20} /> Weekly Marathi Menu</h3>
            <div style={{ padding: '0.4rem 0.8rem', background: 'var(--primary-color)15', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-color)' }}>
              Sunday Special: {mess.specialSundayMenu || 'Puran Poli'}
            </div>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--card-border)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', width: '120px' }}>Day</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}><Sun size={14} style={{ marginRight: '4px' }} /> Lunch</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}><Moon size={14} style={{ marginRight: '4px' }} /> Dinner</th>
                </tr>
              </thead>
              <tbody>
                {DAYS.map(day => (
                  <tr key={day} style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: '700', textTransform: 'capitalize', color: 'var(--primary-color)' }}>{day}</td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{mess.menu?.[day]?.lunch || 'Bhakri, Veg, Dal, Rice'}</td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{mess.menu?.[day]?.dinner || 'Chapati, Veg, Rice'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        {/* Reviews Section moved here */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3>Reviews ({mess.reviewCount})</h3>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', color: 'var(--warning)', margin: '1rem 0' }}>
            <Star fill="currentColor" /> {mess.rating ? mess.rating.toFixed(1) : 'No ratings yet'} / 5.0
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
            {reviews.length > 0 ? reviews.map(rev => (
              <div key={rev._id} style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '0.9rem' }}>{rev.studentName || 'Verified Student'}</strong>
                  <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}><Star size={12} fill="currentColor" /> {rev.rating}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{rev.comment}</p>
              </div>
            )) : <p>No reviews yet. Be the first to share your experience!</p>}
          </div>

          <form onSubmit={submitReview} style={{ marginTop: '2rem', background: 'rgba(0,0,0,0.03)', padding: '1.5rem', borderRadius: '12px' }}>
            <h4 style={{ marginBottom: '1rem' }}>Rate Mess Service</h4>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <select className="input-field" style={{ width: '150px', marginBottom: 0 }} value={newReview.rating} onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
              </select>
              <button className="btn btn-secondary" style={{ flex: 1 }}>Submit Feedback</button>
            </div>
            <textarea className="input-field" required rows={3} placeholder="Tell us about the food quality and hygiene..." value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} style={{ marginBottom: 0 }}></textarea>
          </form>
        </div>
      </div>

      <div>
        <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Subscription Plans</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {(mess.serviceFor === 'Boys' || mess.serviceFor === 'Both') && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(79, 70, 229, 0.05)', borderRadius: '12px', border: '1px solid rgba(79, 70, 229, 0.1)' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: '600' }}>FOR BOYS</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-color)' }}>₹{mess.feesBoys || 'N/A'}</p>
                </div>
                <CheckCircle2 color="var(--primary-color)" />
              </div>
            )}
            {(mess.serviceFor === 'Girls' || mess.serviceFor === 'Both') && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(236, 72, 153, 0.05)', borderRadius: '12px', border: '1px solid rgba(236, 72, 153, 0.1)' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: '600' }}>FOR GIRLS</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-color)' }}>₹{mess.feesGirls || 'N/A'}</p>
                </div>
                <CheckCircle2 color="var(--accent-color)" />
              </div>
            )}
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px', marginBottom: '2rem', fontSize: '0.85rem' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><Info size={14} /> Includes Sunday Special</p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Info size={14} /> Unlimited Lunch & Dinner</p>
          </div>

          <button onClick={handleBooking} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>Subscribe Now</button>
        </div>
      </div>
    </div>
  </div>
);
}
