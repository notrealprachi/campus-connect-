'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin, Star, Search, Filter, ArrowLeft } from 'lucide-react';

function RoomsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/rooms', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRooms(data);
      })
      .catch(err => console.error('Error fetching rooms:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const search = searchParams.get('search');
    const filter = searchParams.get('filter');
    if (search !== null) setSearchTerm(search);
    if (filter !== null) setActiveFilter(filter);
    if (search === null && filter === null) {
      setSearchTerm('');
      setActiveFilter('all');
    }
  }, [searchParams]);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      room.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeFilter === 'girls') return room.gender === 'Girls';
    if (activeFilter === 'budget') {
      return (room.rent || 0) <= 2600;
    }
    if (activeFilter === 'near') return room.collegeDistance <= 0.5;
    
    return true;
  });

  return (
    <div className="animate-fade-in">
      <button 
        onClick={() => router.back()} 
        className="btn-secondary" 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: '0.5rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: '600', color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1>All Rooms & PGs</h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search stays..." 
              className="input-field" 
              style={{ marginBottom: 0, paddingLeft: '2.5rem', width: '250px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="input-field" 
            style={{ marginBottom: 0, width: '150px' }}
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <option value="all">All Stays</option>
            <option value="girls">Girls Only</option>
            <option value="budget">Budget (≤2600)</option>
            <option value="near">Near College</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Loading stays...</p>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>No rooms found matching your criteria.</p>
          <button onClick={() => {setSearchTerm(''); setActiveFilter('all');}} className="btn btn-secondary" style={{ marginTop: '1rem' }}>Clear All Filters</button>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {filteredRooms.map((room) => (
            <a href={`/rooms/${room._id}`} key={room._id} className="glass-panel hover-scale" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'inherit', position: 'relative', textDecoration: 'none' }}>
              <div style={{ background: '#e2e8f0', height: '180px', borderRadius: '8px', backgroundImage: `url(${room.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop'})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                {room.vacancyStatus && (
                  <span style={{ 
                    position: 'absolute', 
                    top: '0.5rem', 
                    right: '0.5rem', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    background: room.vacancyStatus === 'Available' ? 'var(--success)' : room.vacancyStatus === 'Few Beds Left' ? 'var(--warning)' : 'var(--danger)',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {room.vacancyStatus}
                  </span>
                )}
              </div>
              <h3>{room.name}</h3>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '0.9rem' }}>
                <MapPin size={16} /> {room.location} • {room.collegeDistance}km
              </p>
              <div className="flex justify-between items-center" style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--primary-color)' }}>₹{room.rent}/mo</strong>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '6px', 
                    fontSize: '0.7rem', 
                    fontWeight: '700',
                    background: room.gender === 'Boys' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(236, 72, 153, 0.1)',
                    color: room.gender === 'Boys' ? 'var(--primary-color)' : 'var(--accent-color)',
                    border: `1px solid ${room.gender === 'Boys' ? 'var(--primary-color)' : 'var(--accent-color)'}20`
                  }}>
                    {(room.gender || 'Both').toUpperCase()}
                  </span>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--warning)' }}>
                  <Star size={16} fill="currentColor" /> {room.rating ? room.rating.toFixed(1) : 'New'}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<p>Loading rooms...</p>}>
      <RoomsContent />
    </Suspense>
  );
}
