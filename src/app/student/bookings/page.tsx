'use client';
import { useEffect, useState } from 'react';

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      window.location.href = '/login';
      return;
    }
    const user = JSON.parse(savedUser);

    fetch(`/api/bookings?userId=${user.uid}`).then(res => res.json()).then(data => {
      if (Array.isArray(data)) setBookings(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading your bookings...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>My Booking Requests</h1>
      {bookings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>You haven't made any booking requests yet.</p>
          <a href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Rooms & Messes</a>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {bookings.map((booking) => (
            <div key={booking._id} className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ textTransform: 'capitalize' }}>{booking.targetType} Booking</h3>
              <p style={{ margin: '0.5rem 0' }}>Request ID: <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{booking._id}</span></p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '12px', 
                  fontSize: '0.875rem', 
                  fontWeight: '600',
                  background: booking.status === 'pending' ? 'var(--warning)' : booking.status === 'confirmed' ? 'var(--success)' : 'var(--danger)',
                  color: 'white'
                }}>
                  {booking.status.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {new Date(booking.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
