import { useState } from 'react';

const INITIAL = {
  title: '', platform: 'leetcode', difficulty: 'medium',
  status: 'todo', link: '', tags: '', notes: '',
};

function ProblemForm({ initial = null, onSubmit, onClose }) {
  const [form, setForm] = useState(
    initial
      ? { ...initial, tags: initial.tags?.join(', ') || '' }
      : INITIAL
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
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
        width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto',
      }}>
        <h2 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>
          {initial ? 'Edit Problem' : 'Add Problem'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Problem Title *</label>
            <input name="title" type="text" value={form.title} onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Platform</label>
              <select name="platform" value={form.platform} onChange={handleChange}
                style={{ padding: '0.625rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                {['leetcode', 'gfg', 'codeforces', 'codechef', 'other'].map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty *</label>
              <select name="difficulty" value={form.difficulty} onChange={handleChange}
                style={{ padding: '0.625rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                {['easy', 'medium', 'hard'].map((d) => (
                  <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              style={{ padding: '0.625rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
              {['todo', 'solving', 'done'].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Problem Link</label>
            <input name="link" type="url" value={form.link} onChange={handleChange} placeholder="https://leetcode.com/problems/..." />
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input name="tags" type="text" value={form.tags} onChange={handleChange} placeholder="array, dp, sliding window" />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
              style={{ padding: '0.625rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', resize: 'vertical', background: '#f8fafc' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
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

export default ProblemForm;