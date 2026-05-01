'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function OwnerListingsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [messes, setMesses] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    fetch('/api/rooms').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setRooms(data.filter(r => r.ownerId === user.uid));
    });
    fetch('/api/messes').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setMesses(data.filter(m => m.ownerId === user.uid));
    });
  }, [user]);

  const handleDelete = async (id: string, type: 'room' | 'mess') => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    const res = await fetch(`/api/${type === 'room' ? 'rooms' : 'messes'}/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      if (type === 'room') setRooms(rooms.filter(r => r._id !== id));
      if (type === 'mess') setMesses(messes.filter(m => m._id !== id));
    } else {
      alert('Failed to delete listing.');
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>My Manageable Listings</h1>

      <section style={{ marginBottom: '3rem' }}>
        <h2>My Rooms</h2>
        {rooms.length === 0 ? <p>No rooms listed yet.</p> : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {rooms.map(room => (
              <div key={room._id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem' }}>{room.name}</h3>
                <p>Location: {room.location}</p>
                <p>Rent: ₹{room.rent}/mo</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <a href={`/dashboard/rooms/${room._id}/edit`} className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>Edit</a>
                  <button className="btn btn-primary" style={{ flex: 1, background: 'var(--danger)' }} onClick={() => handleDelete(room._id, 'room')}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>My Mess Services</h2>
        {messes.length === 0 ? <p>No mess services listed yet.</p> : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {messes.map(mess => (
              <div key={mess._id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem' }}>{mess.name}</h3>
                <p>Location: {mess.location}</p>
                <p>Boys/Girls Fees: ₹{mess.fees.boys} / ₹{mess.fees.girls}</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <a href={`/dashboard/messes/${mess._id}/edit`} className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>Edit</a>
                  <button className="btn btn-primary" style={{ flex: 1, background: 'var(--danger)' }} onClick={() => handleDelete(mess._id, 'mess')}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
