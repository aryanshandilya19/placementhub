import { useState } from 'react';
import { useProfile } from '../hooks/useProfile.js';

function ProfilePage() {
  const { profile, loading, updateProfile, uploadAvatar, uploadResume, deleteResume } = useProfile();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  if (loading) return <div className="auth-container"><p>Loading profile...</p></div>;

  const handleEditStart = () => {
    setFormData({
      name: profile.name || '',
      profile: {
        college: profile.profile?.college || '',
        branch: profile.profile?.branch || '',
        graduationYear: profile.profile?.graduationYear || '',
        skills: profile.profile?.skills?.join(', ') || '',
        bio: profile.profile?.bio || '',
        linkedin: profile.profile?.linkedin || '',
        github: profile.profile?.github || '',
        leetcode: profile.profile?.leetcode || '',
      },
    });
    setEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('profile.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        profile: { ...prev.profile, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    const payload = {
      ...formData,
      profile: {
        ...formData.profile,
        graduationYear: formData.profile.graduationYear
          ? Number(formData.profile.graduationYear)
          : undefined,
        skills: formData.profile.skills
          ? formData.profile.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      },
    };
    await updateProfile(payload);
    setEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadAvatar(file);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadResume(file);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' }}>
      <div className="auth-card" style={{ maxWidth: '100%' }}>

        {/* Avatar section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={profile.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=4f46e5&color=fff`}
              alt="Avatar"
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <label style={{ position: 'absolute', bottom: 0, right: 0, background: '#4f46e5', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: '14px' }}>
              +
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            </label>
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{profile.name}</h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{profile.email}</p>
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '999px' }}>
              {profile.role}
            </span>
          </div>
        </div>

        {/* Profile fields */}
        {!editing ? (
          <>
            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                ['College', profile.profile?.college],
                ['Branch', profile.profile?.branch],
                ['Graduation Year', profile.profile?.graduationYear],
                ['Bio', profile.profile?.bio],
                ['Skills', profile.profile?.skills?.join(', ')],
                ['LinkedIn', profile.profile?.linkedin],
                ['GitHub', profile.profile?.github],
                ['LeetCode', profile.profile?.leetcode],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ fontWeight: '500', minWidth: '130px', color: '#374151' }}>{label}</span>
                  <span style={{ color: value ? '#0f172a' : '#94a3b8' }}>{value || '—'}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={handleEditStart}>Edit Profile</button>
          </>
        ) : (
          <>
            <div className="auth-form" style={{ marginBottom: '1.5rem' }}>
              {[
                ['name', 'Full Name', 'text', false],
                ['profile.college', 'College', 'text', false],
                ['profile.branch', 'Branch', 'text', false],
                ['profile.graduationYear', 'Graduation Year', 'number', false],
                ['profile.bio', 'Bio', 'text', false],
                ['profile.skills', 'Skills (comma separated)', 'text', false],
                ['profile.linkedin', 'LinkedIn URL', 'url', false],
                ['profile.github', 'GitHub URL', 'url', false],
                ['profile.leetcode', 'LeetCode URL', 'url', false],
              ].map(([name, label, type]) => (
                <div className="form-group" key={name}>
                  <label>{label}</label>
                  <input
                    name={name}
                    type={type}
                    value={name.includes('.') ? formData.profile[name.split('.')[1]] : formData[name]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-primary" onClick={handleSave}>Save</button>
              <button onClick={() => setEditing(false)} style={{ padding: '0.75rem 1.5rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', background: 'white' }}>
                Cancel
              </button>
            </div>
          </>
        )}

        {/* Resume section */}
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Resume</h3>
          {profile.resume?.url ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <a href={profile.resume.url} target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'inline-block' }}>
                View Resume
              </a>
              <button onClick={deleteResume} style={{ padding: '0.75rem 1.5rem', border: '1.5px solid #fee2e2', borderRadius: '8px', cursor: 'pointer', background: '#fff', color: '#dc2626' }}>
                Delete
              </button>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Uploaded: {new Date(profile.resume.uploadedAt).toLocaleDateString()}
              </span>
            </div>
          ) : (
            <label className="btn-primary" style={{ display: 'inline-block', cursor: 'pointer' }}>
              Upload Resume (PDF)
              <input type="file" accept=".pdf" onChange={handleResumeChange} style={{ display: 'none' }} />
            </label>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;