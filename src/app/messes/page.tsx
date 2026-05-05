'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, Star, Search, Utensils } from 'lucide-react';

function MessesContent() {
  const searchParams = useSearchParams();
  const [messes, setMesses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/messes', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMesses(data);
      })
      .catch(err => console.error('Error fetching messes:', err))
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

  const filteredMesses = messes.filter(mess => {
    const matchesSearch = 
      mess.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      mess.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeFilter === 'veg') return mess.vegNonVeg === 'Veg';
    if (activeFilter === 'budget') return (mess.feesBoys || mess.feesGirls) <= 2000;
    
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1>All Mess Services</h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search messes..." 
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
            <option value="all">All Types</option>
            <option value="veg">Pure Veg</option>
            <option value="budget">Budget (≤2000)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Loading messes...</p>
        </div>
      ) : filteredMesses.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>No mess services found matching your search.</p>
          <button onClick={() => {setSearchTerm(''); setActiveFilter('all');}} className="btn btn-secondary" style={{ marginTop: '1rem' }}>Clear All Filters</button>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {filteredMesses.map((mess) => (
            <a href={`/messes/${mess._id}`} key={mess._id} className="glass-panel hover-scale" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'inherit', position: 'relative', textDecoration: 'none' }}>
              <div style={{ background: '#e2e8f0', height: '180px', borderRadius: '8px', backgroundImage: `url(${mess.images?.[0] || 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=800&auto=format&fit=crop'})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <span style={{ 
                  position: 'absolute', 
                  top: '0.5rem', 
                  left: '0.5rem', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '12px', 
                  fontSize: '0.7rem', 
                  fontWeight: '700',
                  background: 'rgba(255,255,255,0.9)',
                  color: mess.vegNonVeg === 'Veg' ? 'var(--success)' : 'var(--danger)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {mess.vegNonVeg || 'Veg'}
                </span>
              </div>
              <h3>{mess.name}</h3>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '0.9rem' }}>
                <MapPin size={16} /> {mess.location} • {mess.collegeDistance}km
              </p>
              {mess.specialSundayMenu && (
                <p style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: '600', margin: 0 }}>
                  Sunday: {mess.specialSundayMenu}
                </p>
              )}
              <div className="flex justify-between items-center" style={{ marginTop: 'auto' }}>
                <strong style={{ fontSize: '1.1rem', color: 'var(--accent-color)' }}>
                  {mess.feesBoys === mess.feesGirls ? `₹${mess.feesBoys}` : `₹${mess.feesBoys}(B)/₹${mess.feesGirls}(G)`}/mo
                </strong>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--warning)' }}>
                  <Star size={16} fill="currentColor" /> {mess.rating ? mess.rating.toFixed(1) : 'New'}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MessesPage() {
  return (
    <Suspense fallback={<p>Loading messes...</p>}>
      <MessesContent />
    </Suspense>
  );
}
