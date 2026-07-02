function EmptyState({ title, description, action, onAction }) {
  return (
    <div style={{
      textAlign: 'center', padding: '3rem 1rem',
      background: 'white', borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📭</div>
      <h3 style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>{title}</h3>
      {description && <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{description}</p>}
      {action && onAction && (
        <button className="btn-primary" onClick={onAction}>{action}</button>
      )}
    </div>
  );
}

export default EmptyState;