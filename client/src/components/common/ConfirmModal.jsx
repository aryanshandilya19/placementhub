function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel = 'Delete', danger = true }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, padding: '1rem',
    }}>
      <div style={{
        background: 'white', borderRadius: '12px', padding: '2rem',
        width: '100%', maxWidth: '400px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}>
        <h3 style={{ fontWeight: '700', marginBottom: '0.75rem' }}>{title}</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={onCancel}
            style={{ padding: '0.625rem 1.25rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', background: 'white', fontWeight: '500' }}>
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-primary"
            style={{ background: danger ? '#dc2626' : '#4f46e5' }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;