import { useState } from 'react';

const INITIAL = {
  company: '', role: '', status: 'applied',
  appliedDate: new Date().toISOString().split('T')[0],
  ctc: '', location: '', jobLink: '', notes: '',
};

function ApplicationForm({ initial = null, onSubmit, onClose }) {
  const [form, setForm] = useState(initial || INITIAL);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      ctc: form.ctc ? Number(form.ctc) : undefined,
    };
    const success = await onSubmit(payload);
    setLoading(false);
    if (success) onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '1rem',
    }}>
      <div style={{
        background: 'white', borderRadius: '12px', padding: '2rem',
        width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto',
      }}>
        <h2 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>
          {initial ? 'Edit Application' : 'Add Application'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { name: 'company', label: 'Company *', type: 'text', required: true },
            { name: 'role', label: 'Role *', type: 'text', required: true },
            { name: 'location', label: 'Location', type: 'text' },
            { name: 'ctc', label: 'CTC (LPA)', type: 'number' },
            { name: 'jobLink', label: 'Job Link', type: 'url' },
            { name: 'appliedDate', label: 'Applied Date', type: 'date' },
          ].map(({ name, label, type, required }) => (
            <div className="form-group" key={name}>
              <label>{label}</label>
              <input
                name={name} type={type}
                value={form[name]} onChange={handleChange}
                required={required}
              />
            </div>
          ))}

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              style={{ padding: '0.625rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9375rem', background: '#f8fafc' }}>
              {['applied','oa','interview','offer','rejected','ghosted'].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange}
              rows={3} style={{ padding: '0.625rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9375rem', resize: 'vertical', background: '#f8fafc' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose}
              style={{ padding: '0.75rem 1.5rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', background: 'white' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicationForm;