'use client';
import { useEffect, useState } from 'react';
import { MapPin, Star } from 'lucide-react';

export default function MessesPage() {
  const [messes, setMesses] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/messes').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setMesses(data);
    });
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>All Mess Services</h1>
      {messes.length === 0 ? (
        <p>No messes available right now.</p>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {messes.map((mess) => (
            <a href={`/messes/${mess._id}`} key={mess._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'inherit' }}>
              <div style={{ background: '#e2e8f0', height: '180px', borderRadius: '8px', backgroundImage: `url(${mess.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <h3>{mess.name}</h3>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <MapPin size={16} /> {mess.location}
              </p>
              <div className="flex justify-between items-center" style={{ marginTop: 'auto' }}>
                <strong style={{ fontSize: '1.25rem', color: 'var(--accent-color)' }}>From ₹{mess.fees.boys}/mo</strong>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--warning)' }}>
                  <Star size={16} fill="currentColor" /> {mess.rating || 'New'}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
