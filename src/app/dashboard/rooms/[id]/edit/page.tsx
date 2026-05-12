'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const BASIC_FACILITIES = ['Attached Bathroom', 'Shared Bathroom', '24x7 Water', 'Drinking Water Filter', 'Electricity Backup', 'WiFi', 'Cupboard', 'Study Table', 'Balcony', 'Parking'];
const APPLIANCES = ['Fan', 'Cooler', 'Heater', 'Induction', 'Refrigerator', 'Washing Machine', 'Iron', 'Laptop/PC'];
const SECURITY_RULES = ['CCTV', 'Security Guard', 'Boys Only', 'Girls Only', 'Both Allowed', 'Visitor Allowed', 'Night Timing Restrictions', 'No Smoking', 'No Alcohol'];
const VACANCY_STATUSES = ['Available', 'Few Beds Left', 'No Vacancy', 'Vacancy Coming Soon'];

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rent: '',
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
  const [loading, setLoading] = useState(true);
  const [imageFiles, setImageFiles] = useState<string[]>([]);

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
            occupiedBeds: (room.occupiedBeds || 0).toString(),
            collegeDistance: room.collegeDistance.toString(),
            vacancyStatus: room.vacancyStatus || 'Available',
            expectedVacancyDate: room.expectedVacancyDate ? new Date(room.expectedVacancyDate).toISOString().split('T')[0] : '',
          });
          setFacilities(room.facilities || { basic: [], appliances: [], security: [] });
          setImageFiles(room.images || []);
        }
      }
      setLoading(false);
    });
  }, [params.id]);

  const handleFacilityChange = (category: keyof typeof facilities, item: string) => {
    setFacilities(prev => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter(i => i !== item)
        : [...prev[category], item]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      rent: Number(formData.rent),
      totalBeds: Number(formData.totalBeds),
      occupiedBeds: Number(formData.occupiedBeds),
      collegeDistance: Number(formData.collegeDistance),
      images: imageFiles,
      facilities,
      expectedVacancyDate: formData.expectedVacancyDate || null
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

  const bedsAvailable = Math.max(0, Number(formData.totalBeds || 0) - Number(formData.occupiedBeds || 0));

  if (loading) return <p>Loading room data...</p>;

  return (
    <div className="glass-panel" style={{ maxWidth: '900px', margin: '2rem auto', padding: '2.5rem' }}>
      <button 
        onClick={() => router.back()} 
        className="btn-secondary" 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: '0.5rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: '600', color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Edit Room / PG</h2>
      
      <form onSubmit={handleSubmit} className="animate-fade-in">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="input-group">
            <label className="input-label">Property Name</label>
            <input className="input-field" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="input-group">
            <label className="input-label">Location</label>
            <input className="input-field" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>
          <div className="input-group">
            <label className="input-label">Monthly Rent (₹)</label>
            <input type="number" className="input-field" required value={formData.rent} onChange={e => setFormData({...formData, rent: e.target.value})} />
          </div>
          <div className="input-group">
            <label className="input-label">Distance from College (km)</label>
            <input type="number" step="0.1" className="input-field" required value={formData.collegeDistance} onChange={e => setFormData({...formData, collegeDistance: e.target.value})} />
          </div>

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

          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label className="input-label">Description</label>
            <textarea className="input-field" rows={4} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Update Premium Listing</button>
        </div>
      </form>
    </div>
  );
}
