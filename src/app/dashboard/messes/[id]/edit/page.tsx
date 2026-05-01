'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditMessPage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    feesBoys: '',
    feesGirls: '',
    collegeDistance: '',
    images: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    
    fetch('/api/messes').then(res => res.json()).then(data => {
      if (Array.isArray(data)) {
        const mess = data.find(m => m._id === params.id);
        if (mess) {
          setFormData({
            name: mess.name,
            location: mess.location,
            feesBoys: mess.fees.boys.toString(),
            feesGirls: mess.fees.girls.toString(),
            collegeDistance: mess.collegeDistance.toString(),
            images: mess.images?.[0] || ''
          });
        }
      }
      setLoading(false);
    });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      location: formData.location,
      fees: { boys: Number(formData.feesBoys), girls: Number(formData.feesGirls) },
      collegeDistance: Number(formData.collegeDistance),
      images: [formData.images],
    };

    const res = await fetch(`/api/messes/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      router.push('/dashboard/listings');
    } else {
      alert('Failed to update mess');
    }
  };

  if (loading) return <p>Loading mess data...</p>;

  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2>Edit Mess Service</h2>
      <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="input-group">
          <label className="input-label">Mess Name</label>
          <input className="input-field" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Annapurna Mess" />
        </div>
        <div className="input-group">
          <label className="input-label">Location</label>
          <input className="input-field" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Randive Galli" />
        </div>
        <div className="input-group">
          <label className="input-label">Monthly Fees (Boys) ₹</label>
          <input type="number" className="input-field" required value={formData.feesBoys} onChange={e => setFormData({...formData, feesBoys: e.target.value})} />
        </div>
        <div className="input-group">
          <label className="input-label">Monthly Fees (Girls) ₹</label>
          <input type="number" className="input-field" required value={formData.feesGirls} onChange={e => setFormData({...formData, feesGirls: e.target.value})} />
        </div>
        <div className="input-group">
          <label className="input-label">Distance from College (km)</label>
          <input type="number" step="0.1" className="input-field" required value={formData.collegeDistance} onChange={e => setFormData({...formData, collegeDistance: e.target.value})} />
        </div>
        <div className="input-group">
          <label className="input-label">Image URL</label>
          <input type="url" className="input-field" required value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} placeholder="https://..." />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Update Mess Listing</button>
        </div>
      </form>
    </div>
  );
}
