function StatCard({ label, value, sub, color = '#4f46e5' }) {
  return (
    <div style={{
      background: 'white', padding: '1.25rem 1.5rem',
      borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      borderTop: `3px solid ${color}`,
    }}>
      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.375rem' }}>{label}</p>
      <p style={{ fontSize: '1.75rem', fontWeight: '700', color }}>{value}</p>
      {sub && <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>{sub}</p>}
    </div>
  );
}

export default StatCard;