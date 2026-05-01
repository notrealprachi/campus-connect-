'use client';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import Link from 'next/link';

export default function Header() {
  const { user, mongoUser } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/login';
  };

  return (
    <header className="glass-panel" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link href="/">
        <h2 style={{ margin: 0, background: 'linear-gradient(45deg, var(--primary-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CampusConnect
        </h2>
      </Link>
      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 500 }}>Home</Link>
        <Link href="/rooms" style={{ fontWeight: 500 }}>Rooms</Link>
        <Link href="/messes" style={{ fontWeight: 500 }}>Messes</Link>
        
        {user ? (
          <>
            {mongoUser?.role === 'student' ? (
              <Link href="/student/bookings" style={{ fontWeight: 500 }}>My Bookings</Link>
            ) : (
              <Link href="/dashboard" style={{ fontWeight: 500 }}>Dashboard</Link>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Hello, {mongoUser?.name || user.email}</span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Logout</button>
            </div>
          </>
        ) : (
          <Link href="/login" className="btn btn-primary" style={{ textDecoration: 'none' }}>Login / Sign Up</Link>
        )}
      </nav>
    </header>
  );
}
