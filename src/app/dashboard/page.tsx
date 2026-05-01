export default function DashboardPage() {
  return (
    <div>
      <h1 style={{ background: 'var(--text-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Owner Dashboard
      </h1>
      <p>Welcome back! Manage your properties and mess menus here.</p>
      
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', marginTop: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>Add New Room</h3>
          <p style={{ fontSize: '0.875rem' }}>List a new student accommodation property.</p>
          <a href="/dashboard/rooms/add" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Listing</a>
        </div>
        
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>Add New Mess</h3>
          <p style={{ fontSize: '0.875rem' }}>List your mess and weekly menu.</p>
          <a href="/dashboard/messes/add" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Create Listing</a>
        </div>
        
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>My Listings</h3>
          <p style={{ fontSize: '0.875rem' }}>View and update your active properties.</p>
          <a href="/dashboard/listings" className="btn btn-secondary" style={{ marginTop: '1rem' }}>View All</a>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>Manage Bookings</h3>
          <p style={{ fontSize: '0.875rem' }}>View and respond to booking requests.</p>
          <a href="/dashboard/bookings" className="btn btn-primary" style={{ marginTop: '1rem' }}>View Requests</a>
        </div>
      </div>
    </div>
  );
}
