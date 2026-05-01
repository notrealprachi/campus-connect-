'use client';

import { useEffect, useState } from 'react';
import { Home as HomeIcon, Utensils, Star, MapPin } from 'lucide-react';

export default function Home() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [messes, setMesses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Initial fetch
    fetch('/api/rooms').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setRooms(data);
    });
    fetch('/api/messes').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setMesses(data);
    });
  }, []);

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    room.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredMesses = messes.filter(mess => 
    mess.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    mess.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid">
      <section style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1>Welcome to CampusConnect</h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          The ultimate platform to find verified student accommodations and hygienic mess services near your university.
        </p>
        
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto 2rem', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Search by name or location..." 
            className="input-field" 
            style={{ marginBottom: 0 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary">Search</button>
        </div>

        <div className="flex justify-center gap-4">
          <a href="/rooms" className="btn btn-primary">Find a Room</a>
          <a href="/messes" className="btn btn-secondary">Explore Messes</a>
        </div>
      </section>

      <section>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HomeIcon className="text-primary-color" /> Featured Rooms
        </h2>
        {filteredRooms.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <p>No rooms found matching your search.</p>
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {filteredRooms.map((room) => (
              <a href={`/rooms/${room._id}`} key={room._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'inherit', textDecoration: 'none' }}>
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
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Utensils className="text-primary-color" /> Hygienic Mess Services
        </h2>
        {filteredMesses.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <p>No messes found matching your search.</p>
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {filteredMesses.map((mess) => (
              <a href={`/messes/${mess._id}`} key={mess._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'inherit', textDecoration: 'none' }}>
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
      </section>
    </div>
  );
}
