'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const MARATHI_DISHES = ['Poha', 'Sabudana Khichdi', 'Thalipeeth', 'Puran Poli', 'Bhakri', 'Pithla', 'Varun Bhat', 'Paneer Bhaji', 'Chicken Curry', 'Egg Curry', 'Misal Pav', 'Veg Kolhapuri', 'Dal Tadka', 'Rajma', 'Kadhi'];

export default function EditMessPage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    feesBoys: '',
    feesGirls: '',
    collegeDistance: '',
    vegNonVeg: 'Veg',
    specialSundayMenu: '',
    hygieneRating: '4',
    tasteRating: '4',
    quantityRating: '4',
  });
  const [menu, setMenu] = useState<any>(
    DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: { breakfast: '', lunch: '', dinner: '' }
    }), {})
  );
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [kitchenImages, setKitchenImages] = useState<string[]>([]);
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
            feesBoys: (mess.feesBoys || 0).toString(),
            feesGirls: (mess.feesGirls || 0).toString(),
            collegeDistance: mess.collegeDistance.toString(),
            vegNonVeg: mess.vegNonVeg || 'Veg',
            specialSundayMenu: mess.specialSundayMenu || '',
            hygieneRating: (mess.detailedRatings?.hygiene || 4).toString(),
            tasteRating: (mess.detailedRatings?.taste || 4).toString(),
            quantityRating: (mess.detailedRatings?.quantity || 4).toString(),
          });
          if (mess.menu) setMenu(mess.menu);
          setImageFiles(mess.images || []);
          setKitchenImages(mess.kitchenImages || []);
        }
      }
      setLoading(false);
    });
  }, [params.id]);

  const handleMenuChange = (day: string, type: 'breakfast' | 'lunch' | 'dinner', value: string) => {
    setMenu((prev: any) => ({
      ...prev,
      [day]: { ...prev[day], [type]: value }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setter((prev: any) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      location: formData.location,
      feesBoys: Number(formData.feesBoys),
      feesGirls: Number(formData.feesGirls),
      collegeDistance: Number(formData.collegeDistance),
      images: imageFiles,
      kitchenImages: kitchenImages,
      vegNonVeg: formData.vegNonVeg,
      specialSundayMenu: formData.specialSundayMenu,
      detailedRatings: {
        hygiene: Number(formData.hygieneRating),
        taste: Number(formData.tasteRating),
        quantity: Number(formData.quantityRating)
      },
      menu
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
    <div className="glass-panel" style={{ maxWidth: '1000px', margin: '2rem auto', padding: '2.5rem' }}>
      <button 
        onClick={() => router.back()} 
        className="btn-secondary" 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: '0.5rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: '600', color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Edit Marathi Mess Service</h2>
      
      <form onSubmit={handleSubmit} className="animate-fade-in">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="input-group">
            <label className="input-label">Mess Name</label>
            <input className="input-field" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="input-group">
            <label className="input-label">Location</label>
            <input className="input-field" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
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
            <label className="input-label">Veg / Non-Veg</label>
            <select className="input-field" value={formData.vegNonVeg} onChange={e => setFormData({...formData, vegNonVeg: e.target.value})}>
              <option value="Veg">Veg Only</option>
              <option value="Non-Veg">Non-Veg Only</option>
              <option value="Both">Both (Veg & Non-Veg)</option>
            </select>
          </div>

          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '1.5rem', background: 'rgba(255,255,255,0.3)', marginTop: '1rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Service Standards & Specialities</h4>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Hygiene Rating (1-5)</label>
                <input type="number" min="1" max="5" className="input-field" value={formData.hygieneRating} onChange={e => setFormData({...formData, hygieneRating: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Taste Rating (1-5)</label>
                <input type="number" min="1" max="5" className="input-field" value={formData.tasteRating} onChange={e => setFormData({...formData, tasteRating: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Quantity Rating (1-5)</label>
                <input type="number" min="1" max="5" className="input-field" value={formData.quantityRating} onChange={e => setFormData({...formData, quantityRating: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Special Sunday Menu</label>
                <input className="input-field" value={formData.specialSundayMenu} onChange={e => setFormData({...formData, specialSundayMenu: e.target.value})} />
              </div>
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '1.5rem' }}>Weekly Menu</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead>
                  <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderRadius: '8px 0 0 0' }}>Day</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Breakfast</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Lunch</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderRadius: '0 8px 0 0' }}>Dinner</th>
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map(day => (
                    <tr key={day} style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '600', textTransform: 'capitalize' }}>{day}</td>
                      <td style={{ padding: '0.5rem' }}>
                        <input className="input-field" value={menu[day].breakfast} onChange={e => handleMenuChange(day, 'breakfast', e.target.value)} />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <input className="input-field" value={menu[day].lunch} onChange={e => handleMenuChange(day, 'lunch', e.target.value)} />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <input className="input-field" value={menu[day].dinner} onChange={e => handleMenuChange(day, 'dinner', e.target.value)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="input-group" style={{ gridColumn: '1 / -1', marginTop: '1.5rem' }}>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <label className="input-label">Mess Images</label>
                <input type="file" className="input-field" accept="image/*" multiple onChange={e => handleFileChange(e, setImageFiles)} />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', overflowX: 'auto' }}>
                  {imageFiles.map((img, i) => (
                    <img key={i} src={img} alt="preview" style={{ height: '60px', borderRadius: '8px' }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="input-label">Kitchen Images</label>
                <input type="file" className="input-field" accept="image/*" multiple onChange={e => handleFileChange(e, setKitchenImages)} />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', overflowX: 'auto' }}>
                  {kitchenImages.map((img, i) => (
                    <img key={i} src={img} alt="preview" style={{ height: '60px', borderRadius: '8px' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Update Premium Listing</button>
        </div>
      </form>
    </div>
  );
}
