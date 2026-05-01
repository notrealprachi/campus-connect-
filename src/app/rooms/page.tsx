'use client';
import { useEffect, useState } from 'react';
import { MapPin, Star } from 'lucide-react';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/rooms').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setRooms(data);
    });
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>All Rooms & PGs</h1>
      {rooms.length === 0 ? (
        <p>No rooms available right now.</p>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {rooms.map((room) => (
            <a href={`/rooms/${room._id}`} key={room._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'inherit' }}>
              <div style={{ background: '#e2e8f0', height: '180px', borderRadius: '8px', backgroundImage: `url(${room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <h3>{room.name}</h3>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <MapPin size={16} /> {room.location}
              </p>
              <div className="flex justify-between items-center" style={{ marginTop: 'auto' }}>
                <strong style={{ fontSize: '1.25rem', color: 'var(--primary-color)' }}>₹{room.rent}/mo</strong>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--warning)' }}>
                  <Star size={16} fill="currentColor" /> {room.rating || 'New'}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
