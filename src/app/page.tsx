'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home as HomeIcon, Utensils, Search, ShieldCheck, Camera, Zap, Users, GraduationCap } from 'lucide-react';

const LOCATIONS = ['Randive Galli', 'Maratha Colony', 'Chaugule Galli', 'Gruhayog', '100 Futi', 'Wadkar'];

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'rooms' | 'messes'>('rooms');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      router.push(`/${searchType}?search=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push(`/${searchType}`);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ 
        textAlign: 'center', 
        padding: '6rem 1rem', 
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
        borderRadius: '32px',
        marginBottom: '4rem'
      }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem' }}>
          Find Your Perfect <span className="text-gradient">Campus Stay</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 3rem' }}>
          Stop wandering in streets! Discover verified rooms, PGs, and premium Marathi mess services in Kasaba Bawada at your fingertips.
        </p>
        
        <form onSubmit={handleSearch} className="glass-panel" style={{ 
          maxWidth: '800px', 
          margin: '0 auto 3rem', 
          padding: '0.5rem', 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '0.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          borderRadius: '16px'
        }}>
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value as any)}
            className="input-field"
            style={{ marginBottom: 0, width: '120px', border: 'none', background: 'var(--bg-color)', fontWeight: '600' }}
          >
            <option value="rooms">Rooms</option>
            <option value="messes">Messes</option>
          </select>

          <div style={{ flex: '1', position: 'relative', minWidth: '200px' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
            <input 
              type="text" 
              placeholder={searchType === 'rooms' ? "Search for Rooms/PGs..." : "Search for Mess services..."}
              className="input-field" 
              style={{ marginBottom: 0, paddingLeft: '3rem', border: 'none' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              list="locations"
            />
            <datalist id="locations">
              {LOCATIONS.map(loc => <option key={loc} value={loc} />)}
            </datalist>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ padding: '0 2.5rem', borderRadius: '12px' }}>Search</button>
        </form>

        <div className="flex justify-center gap-4">
          <button onClick={() => router.push('/rooms')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HomeIcon size={18} /> Find a Room
          </button>
          <button onClick={() => router.push('/messes')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Utensils size={18} /> Explore Messes
          </button>
        </div>
      </section>

      {/* Quick Categories / Filters */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Quick Search by Category</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div onClick={() => router.push('/rooms?filter=girls')} className="glass-panel hover-scale" style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
            <div style={{ background: 'rgba(236, 72, 153, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Users color="var(--accent-color)" size={32} />
            </div>
            <h4 style={{ color: 'var(--accent-color)' }}>Girls Only PGs</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Safe & secure stays for girl students</p>
          </div>
          
          <div onClick={() => router.push('/rooms?filter=budget')} className="glass-panel hover-scale" style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Zap color="#22c55e" size={32} />
            </div>
            <h4 style={{ color: '#22c55e' }}>Budget Friendly</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Stays starting from ₹2000/mo</p>
          </div>

          <div onClick={() => router.push('/messes?filter=veg')} className="glass-panel hover-scale" style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
            <div style={{ background: 'rgba(79, 70, 229, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Utensils color="var(--primary-color)" size={32} />
            </div>
            <h4 style={{ color: 'var(--primary-color)' }}>Pure Veg Mess</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Hygienic vegetarian dining services</p>
          </div>

          <div onClick={() => router.push('/rooms?filter=near')} className="glass-panel hover-scale" style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <GraduationCap color="#f59e0b" size={32} />
            </div>
            <h4 style={{ color: '#f59e0b' }}>Near College</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Less than 500m from campus</p>
          </div>
        </div>
      </section>

      {/* Why CampusStay Section */}
      <section style={{ padding: '4rem 2rem', background: 'rgba(255,255,255,0.4)', borderRadius: '32px', marginBottom: '4rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '4rem' }}>Why Choose CampusStay?</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
          <div style={{ textAlign: 'center' }}>
            <ShieldCheck size={48} style={{ color: 'var(--success)', marginBottom: '1.5rem' }} />
            <h3>100% Verified</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Every room and mess is personally verified by our team for safety and quality.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Camera size={48} style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }} />
            <h3>Real Photos</h3>
            <p style={{ color: 'var(--text-secondary)' }}>No fake images. What you see on our platform is exactly what you get.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Zap size={48} style={{ color: 'var(--warning)', marginBottom: '1.5rem' }} />
            <h3>Direct Connect</h3>
            <p style={{ color: 'var(--text-secondary)' }}>No brokers. Connect directly with owners and book your stay instantly.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div className="flex justify-center gap-12 flex-wrap">
          <div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}>50+</h2>
            <p style={{ fontWeight: '600' }}>Verified Stays</p>
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-color)' }}>20+</h2>
            <p style={{ fontWeight: '600' }}>Hygienic Messes</p>
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--success)' }}>1000+</h2>
            <p style={{ fontWeight: '600' }}>Happy Students</p>
          </div>
        </div>
      </section>
    </div>
  );
}
