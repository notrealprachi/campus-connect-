'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rent: '',
    description: '',
    totalBeds: '',
    collegeDistance: '',
    images: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    
    fetch('/api/rooms').then(res => res.json()).then(data => {
      if (Array.isArray(data)) {
        const room = data.find(r => r._id === params.id);
        if (room) {
          setFormData({
            name: room.name,
            location: room.location,
            rent: room.rent.toString(),
            description: room.description,
            totalBeds: room.totalBeds.toString(),
            collegeDistance: room.collegeDistance.toString(),
            images: room.images?.[0] || ''
          });
        }
      }
      setLoading(false);
    });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      rent: Number(formData.rent),
      totalBeds: Number(formData.totalBeds),
      collegeDistance: Number(formData.collegeDistance),
      images: [formData.images],
    };

    const res = await fetch(`/api/rooms/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      router.push('/dashboard/listings');
    } else {
      alert('Failed to update room');
    }
  };

  if (loading) return <p>Loading room data...</p>;

  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2>Edit Room / PG</h2>
      <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="input-group">
          <label className="input-label">Property Name</label>
          <input className="input-field" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Deluxe Boys PG" />
        </div>
        <div className="input-group">
          <label className="input-label">Location</label>
          <input className="input-field" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Maratha Colony" />
        </div>
        <div className="input-group">
          <label className="input-label">Monthly Rent (₹)</label>
          <input type="number" className="input-field" required value={formData.rent} onChange={e => setFormData({...formData, rent: e.target.value})} />
        </div>
        <div className="input-group">
          <label className="input-label">Total Beds</label>
          <input type="number" className="input-field" required value={formData.totalBeds} onChange={e => setFormData({...formData, totalBeds: e.target.value})} />
        </div>
        <div className="input-group">
          <label className="input-label">Distance from College (km)</label>
          <input type="number" step="0.1" className="input-field" required value={formData.collegeDistance} onChange={e => setFormData({...formData, collegeDistance: e.target.value})} />
        </div>
        <div className="input-group">
          <label className="input-label">Image URL</label>
          <input type="url" className="input-field" required value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} placeholder="https://..." />
        </div>
        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
          <label className="input-label">Description</label>
          <textarea className="input-field" rows={4} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Update Listing</button>
        </div>
      </form>
    </div>
  );
}
