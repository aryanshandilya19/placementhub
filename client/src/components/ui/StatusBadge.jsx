const STATUS_STYLES = {
  applied:   { background: '#dbeafe', color: '#1d4ed8' },
  oa:        { background: '#fef9c3', color: '#854d0e' },
  interview: { background: '#e0e7ff', color: '#4338ca' },
  offer:     { background: '#dcfce7', color: '#15803d' },
  rejected:  { background: '#fee2e2', color: '#dc2626' },
  ghosted:   { background: '#f1f5f9', color: '#64748b' },
};

const STATUS_LABELS = {
  applied: 'Applied', oa: 'OA', interview: 'Interview',
  offer: 'Offer', rejected: 'Rejected', ghosted: 'Ghosted',
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.applied;
  return (
    <span style={{
      ...style,
      padding: '2px 10px',
      borderRadius: '999px',
      fontSize: '0.75rem',
      fontWeight: '600',
    }}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export default StatusBadge;