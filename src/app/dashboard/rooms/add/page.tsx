'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const BASIC_FACILITIES = ['Attached Bathroom', 'Shared Bathroom', '24x7 Water', 'Drinking Water Filter', 'Electricity Backup', 'WiFi', 'Cupboard', 'Study Table', 'Balcony', 'Parking'];
const APPLIANCES = ['Fan', 'Cooler', 'Heater', 'Induction', 'Refrigerator', 'Washing Machine', 'Iron', 'Laptop/PC'];
const SECURITY_RULES = ['CCTV', 'Security Guard', 'Boys Only', 'Girls Only', 'Both Allowed', 'Visitor Allowed', 'Night Timing Restrictions', 'No Smoking', 'No Alcohol'];
const VACANCY_STATUSES = ['Available', 'Few Beds Left', 'No Vacancy', 'Vacancy Coming Soon'];

export default function AddRoomPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rent: '',
    gender: 'Boys',
    description: '',
    totalBeds: '',
    occupiedBeds: '0',
    collegeDistance: '',
    vacancyStatus: 'Available',
    expectedVacancyDate: '',
  });

  const [facilities, setFacilities] = useState({
    basic: [] as string[],
    appliances: [] as string[],
    security: [] as string[]
  });

  const [imageFiles, setImageFiles] = useState<string[]>([]);

  const handleFacilityChange = (category: keyof typeof facilities, item: string) => {
    setFacilities(prev => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter(i => i !== item)
        : [...prev[category], item]
    }));
  };

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
      occupiedBeds: Number(formData.occupiedBeds),
      collegeDistance: Number(formData.collegeDistance),
      images: imageFiles,
      ownerId: user.uid,
      facilities,
      expectedVacancyDate: formData.expectedVacancyDate || null
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

  const bedsAvailable = Math.max(0, Number(formData.totalBeds || 0) - Number(formData.occupiedBeds || 0));

  return (
    <div className="glass-panel" style={{ maxWidth: '900px', margin: '2rem auto', padding: '2.5rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>List a New Room / PG</h2>
      
      <form onSubmit={handleSubmit} className="animate-fade-in">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Basic Info Section */}
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
            <label className="input-label">Type of Stay</label>
            <select className="input-field" required value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
              <option value="Boys">Boys Only</option>
              <option value="Girls">Girls Only</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Distance from College (km)</label>
            <input type="number" step="0.1" className="input-field" required value={formData.collegeDistance} onChange={e => setFormData({...formData, collegeDistance: e.target.value})} />
          </div>

          {/* Bed Management Section */}
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '1.5rem', marginTop: '1rem', background: 'rgba(255,255,255,0.3)' }}>
            <h4 style={{ marginBottom: '1rem' }}>Bed Management & Vacancy</h4>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Total Beds</label>
                <input type="number" className="input-field" required value={formData.totalBeds} onChange={e => setFormData({...formData, totalBeds: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Beds Occupied</label>
                <input type="number" className="input-field" required value={formData.occupiedBeds} onChange={e => setFormData({...formData, occupiedBeds: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Beds Available</label>
                <input type="number" className="input-field" readOnly value={bedsAvailable} style={{ background: 'rgba(0,0,0,0.05)', cursor: 'not-allowed' }} />
              </div>
              <div className="input-group">
                <label className="input-label">Vacancy Status</label>
                <select className="input-field" value={formData.vacancyStatus} onChange={e => setFormData({...formData, vacancyStatus: e.target.value})}>
                  {VACANCY_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Expected Vacancy Date</label>
                <input type="date" className="input-field" value={formData.expectedVacancyDate} onChange={e => setFormData({...formData, expectedVacancyDate: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Facilities Section */}
          <div style={{ gridColumn: '1 / -1', marginTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Structured Facilities</h4>
            
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              <div>
                <label className="input-label" style={{ color: 'var(--primary-color)' }}>Basic Facilities</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                  {BASIC_FACILITIES.map(item => (
                    <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input type="checkbox" checked={facilities.basic.includes(item)} onChange={() => handleFacilityChange('basic', item)} />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="input-label" style={{ color: 'var(--primary-color)' }}>Appliances Allowed</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                  {APPLIANCES.map(item => (
                    <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input type="checkbox" checked={facilities.appliances.includes(item)} onChange={() => handleFacilityChange('appliances', item)} />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="input-label" style={{ color: 'var(--primary-color)' }}>Security & Rules</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                  {SECURITY_RULES.map(item => (
                    <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input type="checkbox" checked={facilities.security.includes(item)} onChange={() => handleFacilityChange('security', item)} />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="input-group" style={{ gridColumn: '1 / -1', marginTop: '1.5rem' }}>
            <label className="input-label">Property Images</label>
            <input type="file" className="input-field" accept="image/*" multiple onChange={handleFileChange} />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', overflowX: 'auto', padding: '0.5rem' }}>
              {imageFiles.map((img, i) => (
                <img key={i} src={img} alt="preview" style={{ height: '80px', width: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--primary-color)' }} />
              ))}
            </div>
          </div>

          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label className="input-label">Description</label>
            <textarea className="input-field" rows={4} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the room, surroundings, and specific rules..."></textarea>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Create Premium Listing</button>
        </div>
      </form>
    </div>
  );
}
