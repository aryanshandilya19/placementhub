import Navbar from './Navbar.jsx';

function AppLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      <Navbar />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {children}
      </main>
    </div>
  );
}

export default AppLayout;