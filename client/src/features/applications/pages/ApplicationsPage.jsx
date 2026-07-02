import { useState } from 'react';
import { useApplications } from '../hooks/useApplications.js';
import ApplicationForm from '../components/ApplicationForm.jsx';
import StatusBadge from '../../../components/ui/StatusBadge.jsx';

const STATUSES = ['', 'applied', 'oa', 'interview', 'offer', 'rejected', 'ghosted'];

function ApplicationsPage() {
  const {
    applications, stats, loading, filter,
    setFilter, createApplication, updateApplication, deleteApplication,
  } = useApplications();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const handleEdit = (app) => {
    setEditTarget(app);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditTarget(null);
  };

  const handleSubmit = async (data) => {
    if (editTarget) return updateApplication(editTarget._id, data);
    return createApplication(data);
  };

  return (
    <div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Application Tracker</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Application</button>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total', value: stats.total, color: '#0f172a' },
            { label: 'Applied', value: stats.applied, color: '#1d4ed8' },
            { label: 'OA', value: stats.oa, color: '#854d0e' },
            { label: 'Interview', value: stats.interview, color: '#4338ca' },
            { label: 'Offer', value: stats.offer, color: '#15803d' },
            { label: 'Rejected', value: stats.rejected, color: '#dc2626' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', color }}>{value}</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search company or role..."
          value={filter.search}
          onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
          style={{ flex: 1, minWidth: '200px', padding: '0.5rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', background: '#f8fafc' }}
        />
        <select
          value={filter.status}
          onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
          style={{ padding: '0.5rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', background: '#f8fafc' }}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Statuses'}</option>
          ))}
        </select>
      </div>

      {/* Applications list */}
      {loading ? (
        <p style={{ color: '#64748b' }}>Loading...</p>
      ) : applications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px' }}>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>No applications yet</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>Add your first application</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {applications.map((app) => (
            <div key={app._id} style={{ background: 'white', padding: '1.25rem 1.5rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontWeight: '600', fontSize: '1rem' }}>{app.company}</h3>
                  <StatusBadge status={app.status} />
                  {app.ctc && <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: '600' }}>{app.ctc} LPA</span>}
                </div>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{app.role}</p>
                {app.location && <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{app.location}</p>}
                <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  Applied: {new Date(app.appliedDate).toLocaleDateString()}
                  {app.rounds?.length > 0 && ` · ${app.rounds.length} round${app.rounds.length > 1 ? 's' : ''}`}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(app)}
                  style={{ padding: '0.4rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', background: 'white' }}>
                  Edit
                </button>
                <button onClick={() => deleteApplication(app._id)}
                  style={{ padding: '0.4rem 0.875rem', border: '1.5px solid #fee2e2', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', background: 'white', color: '#dc2626' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ApplicationForm
          initial={editTarget}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default ApplicationsPage;