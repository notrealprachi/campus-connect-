'use client';
import { useEffect, useState } from 'react';

export default function ManageBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For this dummy flow, we fetch all bookings. 
    // In a real app, we'd filter by the owner's property IDs.
    fetch('/api/bookings').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setBookings(data);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (res.ok) {
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
    } else {
      alert('Failed to update status');
    }
  };

  if (loading) return <p>Loading booking requests...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Manage Booking Requests</h1>
      {bookings.length === 0 ? (
        <p>No booking requests yet.</p>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          {bookings.map((booking) => (
            <div key={booking._id} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ textTransform: 'capitalize' }}>{booking.targetType} Booking</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Student: {booking.studentName}</p>
                </div>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '12px', 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  background: booking.status === 'pending' ? 'var(--warning)' : booking.status === 'confirmed' ? 'var(--success)' : 'var(--danger)',
                  color: 'white'
                }}>
                  {booking.status.toUpperCase()}
                </span>
              </div>
              
              <p style={{ margin: '1rem 0', fontSize: '0.875rem' }}>Requested on: {new Date(booking.createdAt).toLocaleDateString()}</p>
              
              {booking.status === 'pending' && (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button onClick={() => updateStatus(booking._id, 'confirmed')} className="btn btn-primary" style={{ flex: 1, background: 'var(--success)' }}>Confirm</button>
                  <button onClick={() => updateStatus(booking._id, 'cancelled')} className="btn btn-secondary" style={{ flex: 1, color: 'var(--danger)' }}>Cancel</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
