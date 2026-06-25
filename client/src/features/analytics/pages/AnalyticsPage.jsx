import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useAnalytics } from '../hooks/useAnalytics.js';
import StatCard from '../../../components/ui/StatCard.jsx';

const STATUS_COLORS = {
  applied: '#3b82f6', oa: '#f59e0b', interview: '#8b5cf6',
  offer: '#10b981', rejected: '#ef4444', ghosted: '#94a3b8',
};

function SectionTitle({ children }) {
  return (
    <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
      {children}
    </h2>
  );
}

function AnalyticsPage() {
  const { data, loading } = useAnalytics();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: '#64748b' }}>Loading analytics...</p>
      </div>
    );
  }

  if (!data) return null;

  const { applications, dsa } = data;

  const statusPieData = Object.entries(applications.statusCounts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Analytics</h1>

      {/* ── Top stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Total Applications" value={applications.total} color="#3b82f6" />
        <StatCard label="Offers" value={applications.statusCounts.offer} color="#10b981" />
        <StatCard label="Offer Rate" value={`${applications.offerRate}%`} color="#8b5cf6" />
        <StatCard label="DSA Solved" value={dsa.stats.totalSolved} color="#f59e0b" />
        <StatCard label="Current Streak" value={`${dsa.stats.streak}d`} sub="consecutive days" color="#ea580c" />
      </div>

      {/* ── Applications over time ── */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
        <SectionTitle>Applications per Month</SectionTitle>
        {applications.monthlyData.every((d) => d.count === 0) ? (
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No application data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={applications.monthlyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem' }}
              />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Applications" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Status distribution + DSA difficulty ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Status pie */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <SectionTitle>Application Status</SectionTitle>
          {statusPieData.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No applications yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusPieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.name.toLowerCase()] || '#94a3b8'}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '0.875rem' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* DSA difficulty pie */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <SectionTitle>DSA by Difficulty</SectionTitle>
          {dsa.stats.totalSolved === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No problems solved yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={dsa.difficultyData.filter((d) => d.value > 0)}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {dsa.difficultyData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '0.875rem' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── DSA top tags ── */}
      {dsa.topTags.length > 0 && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <SectionTitle>Top Problem Tags</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dsa.topTags} layout="vertical" margin={{ top: 0, right: 16, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
              <YAxis type="category" dataKey="tag" tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '0.875rem' }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Solved" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Application status breakdown table ── */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <SectionTitle>Status Breakdown</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
          {Object.entries(applications.statusCounts).map(([status, count]) => (
            <div key={status} style={{
              textAlign: 'center', padding: '0.875rem',
              background: '#f8fafc', borderRadius: '8px',
              borderBottom: `3px solid ${STATUS_COLORS[status] || '#94a3b8'}`,
            }}>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', color: STATUS_COLORS[status] }}>{count}</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', textTransform: 'capitalize' }}>{status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;