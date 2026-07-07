import { useAdmin } from '../hooks/useAdmin.js';
import StatCard from '../../../components/ui/StatCard.jsx';
import useAuthStore from '../../../store/authStore.js';

function AdminPage() {
  const { users, stats, loading, search, setSearch, updateRole, deleteUser } = useAdmin();
  const currentUser = useAuthStore((state) => state.user);

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Admin Panel</h1>

      {/* Platform stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard label="Total Users" value={stats.totalUsers} color="#4f46e5" />
          <StatCard label="Students" value={stats.totalStudents} color="#0891b2" />
          <StatCard label="Admins" value={stats.totalAdmins} color="#7c3aed" />
          <StatCard label="Verified" value={stats.verifiedUsers} color="#15803d" />
          <StatCard label="Unverified" value={stats.unverifiedUsers} color="#dc2626" />
          <StatCard label="Applications" value={stats.totalApplications} color="#ea580c" />
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: '1.25rem' }}>
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '0.625rem 0.875rem',
            border: '1.5px solid #e2e8f0', borderRadius: '8px',
            fontSize: '0.9rem', background: '#f8fafc',
          }}
        />
      </div>

      {/* Users table */}
      {loading ? (
        <p style={{ color: '#64748b' }}>Loading users...</p>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['User', 'Email', 'Role', 'Verified', 'Joined', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    No users found
                  </td>
                </tr>
              ) : users.map((user) => (
                <tr key={user._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <img
                        src={user.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff&size=32`}
                        alt={user.name}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#64748b' }}>{user.email}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    {currentUser?._id === user._id ? (
                      <span style={{ fontSize: '0.8rem', padding: '2px 8px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '999px' }}>
                        {user.role} (you)
                      </span>
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user._id, e.target.value)}
                        style={{ fontSize: '0.8rem', padding: '2px 6px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#f8fafc', cursor: 'pointer' }}
                      >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{
                      fontSize: '0.75rem', padding: '2px 8px', borderRadius: '999px',
                      background: user.isEmailVerified ? '#dcfce7' : '#fee2e2',
                      color: user.isEmailVerified ? '#15803d' : '#dc2626',
                    }}>
                      {user.isEmailVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    {currentUser?._id !== user._id && (
                      <button
                        onClick={() => deleteUser(user._id)}
                        style={{ fontSize: '0.8rem', padding: '4px 10px', border: '1px solid #fee2e2', borderRadius: '6px', background: 'white', color: '#dc2626', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
//not for the normal user
