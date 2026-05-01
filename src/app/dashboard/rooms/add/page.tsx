'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AddRoomPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rent: '',
    description: '',
    totalBeds: '',
    collegeDistance: '',
    images: ''
  });

  const [imageFiles, setImageFiles] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageFiles(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to list a room.');
      return;
    }

    const payload = {
      ...formData,
      rent: Number(formData.rent),
      totalBeds: Number(formData.totalBeds),
      collegeDistance: Number(formData.collegeDistance),
      images: imageFiles, // Using Base64 strings
      ownerId: user.uid,
      facilities: { basic: [], appliances: [], security: [] }
    };

    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      window.location.href = '/';
    } else {
      alert('Failed to list room');
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2>List a New Room / PG</h2>
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
          <label className="input-label">Property Images (JPEG/PNG)</label>
          <input 
            type="file" 
            className="input-field" 
            accept="image/jpeg,image/png" 
            multiple 
            onChange={handleFileChange} 
          />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', overflowX: 'auto' }}>
            {imageFiles.map((img, i) => (
              <img key={i} src={img} alt="preview" style={{ height: '60px', borderRadius: '4px' }} />
            ))}
          </div>
        </div>
        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
          <label className="input-label">Description</label>
          <textarea className="input-field" rows={4} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Listing</button>
        </div>
      </form>
    </div>
  );
}
