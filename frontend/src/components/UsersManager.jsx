import React, { useState, useEffect } from 'react';
import { Users, Search, ShieldCheck, User } from 'lucide-react';

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const userStr = localStorage.getItem('dhoond_user');
      if (!userStr) { setLoading(false); return; }
      const adminUser = JSON.parse(userStr);

      const API_URL = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_URL}/api/V1/users/all`, {
        headers: { 'x-user-id': adminUser?.id || '' }
      });
      
      const data = await res.json();
      if (res.ok) {
        const list = Array.isArray(data) ? data : (data.users || []);
        setUsers(list);
      } else {
        setError(data.error || data.message || `Server Error (${res.status})`);
      }
    } catch (err) {
      setError(err.message === 'Failed to fetch' 
        ? 'Could not connect to server. Ensure backend is running.' 
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#64748b', gap: '12px' }}>
      <div style={{ width: '24px', height: '24px', border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      Loading users...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ padding: '24px', background: '#fef2f2', borderRadius: '16px', color: '#ef4444', fontWeight: 600 }}>
      ⚠️ {error}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#0f172a' }}>All Users</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>{users.length} registered users</p>
        </div>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by name, phone or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              paddingLeft: '36px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px',
              border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px',
              width: '280px', outline: 'none', background: '#f8fafc', color: '#0f172a'
            }}
          />
        </div>
      </div>

      {/* Summary Pills */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total', value: users.length, bg: '#eff6ff', color: '#2563eb' },
          { label: 'Admins', value: users.filter(u => u.role === 'admin').length, bg: '#fef3c7', color: '#d97706' },
          { label: 'Users', value: users.filter(u => u.role !== 'admin').length, bg: '#f0fdf4', color: '#16a34a' },
        ].map(p => (
          <div key={p.label} style={{ background: p.bg, borderRadius: '10px', padding: '10px 20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '20px', color: p.color }}>{p.value}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: p.color }}>{p.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
          <Users size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <p style={{ fontWeight: 600 }}>No users found</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, idx) => (
                <tr key={u.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Avatar + Name */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: u.role === 'admin' ? '#fef3c7' : '#eff6ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {u.role === 'admin'
                          ? <ShieldCheck size={18} color="#d97706" />
                          : <User size={18} color="#2563eb" />
                        }
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{u.name || '—'}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID #{u.id}</div>
                      </div>
                    </div>
                  </td>
                  {/* Phone */}
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#334155', fontWeight: 500 }}>
                    {u.phone || '—'}
                  </td>
                  {/* Email */}
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#64748b' }}>
                    {u.email || <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>not set</span>}
                  </td>
                  {/* Role badge */}
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 700,
                      background: u.role === 'admin' ? '#fef3c7' : '#f0fdf4',
                      color: u.role === 'admin' ? '#d97706' : '#16a34a',
                      textTransform: 'capitalize'
                    }}>
                      {u.role || 'user'}
                    </span>
                  </td>
                  {/* Joined */}
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748b' }}>
                    {formatDate(u.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersManager;
