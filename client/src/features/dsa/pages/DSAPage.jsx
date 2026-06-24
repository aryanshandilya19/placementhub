import { useState } from 'react';
import { useDSA } from '../hooks/useDSA.js';
import ProblemForm from '../components/ProblemForm.jsx';

const DIFFICULTY_COLORS = {
  easy: { background: '#dcfce7', color: '#15803d' },
  medium: { background: '#fef9c3', color: '#854d0e' },
  hard: { background: '#fee2e2', color: '#dc2626' },
};

const STATUS_COLORS = {
  todo: { background: '#f1f5f9', color: '#64748b' },
  solving: { background: '#e0e7ff', color: '#4338ca' },
  done: { background: '#dcfce7', color: '#15803d' },
};

function DSAPage() {
  const {
    problems, stats, loading, filter,
    setFilter, addProblem, updateProblem, deleteProblem,
  } = useDSA();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const handleEdit = (problem) => {
    setEditTarget(problem);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditTarget(null);
  };

  const handleSubmit = async (data) => {
    if (editTarget) return updateProblem(editTarget._id, data);
    return addProblem(data);
  };

  const handleQuickStatus = async (problem, newStatus) => {
    await updateProblem(problem._id, { status: newStatus });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>DSA Tracker</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Problem</button>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Solved', value: stats.totalSolved, color: '#0f172a' },
            { label: 'Easy', value: stats.easySolved, color: '#15803d' },
            { label: 'Medium', value: stats.mediumSolved, color: '#854d0e' },
            { label: 'Hard', value: stats.hardSolved, color: '#dc2626' },
            { label: '🔥 Streak', value: `${stats.streak} days`, color: '#ea580c' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <p style={{ fontSize: '1.4rem', fontWeight: '700', color }}>{value}</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search problems..."
          value={filter.search}
          onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
          style={{ flex: 1, minWidth: '200px', padding: '0.5rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', background: '#f8fafc' }}
        />
        {[
          { key: 'difficulty', options: ['', 'easy', 'medium', 'hard'], labels: ['All Difficulties', 'Easy', 'Medium', 'Hard'] },
          { key: 'status', options: ['', 'todo', 'solving', 'done'], labels: ['All Status', 'Todo', 'Solving', 'Done'] },
        ].map(({ key, options, labels }) => (
          <select key={key}
            value={filter[key]}
            onChange={(e) => setFilter((f) => ({ ...f, [key]: e.target.value }))}
            style={{ padding: '0.5rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', background: '#f8fafc' }}>
            {options.map((o, i) => <option key={o} value={o}>{labels[i]}</option>)}
          </select>
        ))}
      </div>

      {/* Problems list */}
      {loading ? (
        <p style={{ color: '#64748b' }}>Loading...</p>
      ) : problems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px' }}>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>No problems yet</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>Add your first problem</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {problems.map((problem) => (
            <div key={problem._id} style={{
              background: 'white', padding: '1rem 1.25rem', borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: '0.75rem',
              borderLeft: `4px solid ${DIFFICULTY_COLORS[problem.difficulty]?.color || '#64748b'}`,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                  {problem.link ? (
                    <a href={problem.link} target="_blank" rel="noreferrer"
                      style={{ fontWeight: '600', fontSize: '0.9375rem', color: '#0f172a', textDecoration: 'none' }}>
                      {problem.title}
                    </a>
                  ) : (
                    <span style={{ fontWeight: '600', fontSize: '0.9375rem' }}>{problem.title}</span>
                  )}
                  <span style={{ ...DIFFICULTY_COLORS[problem.difficulty], padding: '1px 8px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '600' }}>
                    {problem.difficulty}
                  </span>
                  <span style={{ ...STATUS_COLORS[problem.status], padding: '1px 8px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '600' }}>
                    {problem.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem', color: '#64748b' }}>
                  <span>{problem.platform}</span>
                  {problem.tags?.map((tag) => (
                    <span key={tag} style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>{tag}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {problem.status !== 'done' && (
                  <button
                    onClick={() => handleQuickStatus(problem, 'done')}
                    style={{ padding: '0.3rem 0.75rem', background: '#dcfce7', color: '#15803d', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
                    ✓ Done
                  </button>
                )}
                <button onClick={() => handleEdit(problem)}
                  style={{ padding: '0.3rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', background: 'white' }}>
                  Edit
                </button>
                <button onClick={() => deleteProblem(problem._id)}
                  style={{ padding: '0.3rem 0.75rem', border: '1.5px solid #fee2e2', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', background: 'white', color: '#dc2626' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProblemForm
          initial={editTarget}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default DSAPage;