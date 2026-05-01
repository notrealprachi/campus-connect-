'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AddMessPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    feesBoys: '',
    feesGirls: '',
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
      alert('Please login to list a mess service.');
      return;
    }

    const payload = {
      name: formData.name,
      location: formData.location,
      fees: { boys: Number(formData.feesBoys), girls: Number(formData.feesGirls) },
      collegeDistance: Number(formData.collegeDistance),
      images: imageFiles, // Using Base64 strings
      ownerId: user.uid,
      menu: {
        monday: { lunch: 'Chapati, Bhaji, Dal, Rice', dinner: 'Chapati, Paneer, Rice' },
        tuesday: { lunch: 'Chapati, Bhaji, Dal, Rice', dinner: 'Chapati, Veg Kolhapuri, Rice' },
        wednesday: { lunch: 'Chapati, Bhaji, Dal, Rice', dinner: 'Special Chicken / Paneer' },
        thursday: { lunch: 'Chapati, Bhaji, Dal, Rice', dinner: 'Chapati, Mix Veg, Rice' },
        friday: { lunch: 'Chapati, Bhaji, Dal, Rice', dinner: 'Egg Curry / Dal Tadka' },
        saturday: { lunch: 'Puri, Shrikhand, Veg Pulav', dinner: 'Chapati, Bhaji, Rice' },
        sunday: { lunch: 'Special Mutton / Mushroom', dinner: 'Light Meal (Khichdi)' }
      }
    };

    const res = await fetch('/api/messes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      window.location.href = '/';
    } else {
      alert('Failed to list mess');
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2>List a New Mess Service</h2>
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
          <label className="input-label">Mess Images (JPEG/PNG)</label>
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
        <div style={{ gridColumn: '1 / -1' }}>
          <p style={{ fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--warning)' }}>* Menu setup is auto-filled with a standard Kolhapur student mess template for now.</p>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Mess Listing</button>
        </div>
      </form>
    </div>
  );
}
