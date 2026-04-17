import React, { useState, useEffect } from 'react';
import { Plus, X, Check, Search, Users, ChevronDown, ChevronUp, ShieldCheck, ShieldX, FileText } from 'lucide-react';

const EMPTY_FORM = {
  name: '', phone: '', profession: '', experience: '',
  current_location: '', status: 'Off duty', work_status: 'idle'
};

const EMPTY_DOCS = {
  aadhaar: { number: '', verified: false },
  pan:     { number: '', verified: false },
  dl:      { number: '', verified: false },
  bank:    { account: '', ifsc: '', bank_name: '', verified: false }
};

const DOC_LABELS = {
  aadhaar: { label: 'Aadhaar Card',      icon: '🪪', fields: [{ key: 'number', placeholder: 'XXXX XXXX XXXX', label: 'Aadhaar Number' }] },
  pan:     { label: 'PAN Card',          icon: '🗂️', fields: [{ key: 'number', placeholder: 'ABCDE1234F',   label: 'PAN Number' }] },
  dl:      { label: 'Driving Licence',   icon: '🚗', fields: [{ key: 'number', placeholder: 'KA-01 XXXXX',  label: 'DL Number' }] },
  bank:    { label: 'Bank Details',      icon: '🏦', fields: [
    { key: 'account',   placeholder: 'Account Number',   label: 'Account No.' },
    { key: 'ifsc',      placeholder: 'SBIN0001234',       label: 'IFSC Code' },
    { key: 'bank_name', placeholder: 'State Bank of India', label: 'Bank Name' }
  ]}
};

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: '8px',
  border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none',
  boxSizing: 'border-box', color: '#0f172a', background: '#f8fafc',
  transition: 'border-color 0.2s'
};
const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 700, color: '#374151' };

const docSummary = (docs) => {
  if (!docs || Object.keys(docs).length === 0) return { total: 0, verified: 0, present: [] };
  const present  = Object.keys(EMPTY_DOCS).filter(k => {
    const d = docs[k];
    if (!d) return false;
    return k === 'bank' ? (d.account || d.ifsc) : d.number;
  });
  const verified = present.filter(k => docs[k]?.verified);
  return { total: present.length, verified: verified.length, present };
};

const PartnersManager = () => {
  const [partners, setPartners]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [addModal, setAddModal]   = useState(false);
  const [formData, setFormData]   = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState('');

  // Per-partner expanded docs state
  const [expandedId, setExpandedId]   = useState(null);
  const [editDocs, setEditDocs]       = useState({}); // { [partnerId]: JSONB docs }
  const [savingDocs, setSavingDocs]   = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || '';
  const getUser = () => { try { return JSON.parse(localStorage.getItem('dhoond_user') || '{}'); } catch { return {}; } };

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/V1/partners`, { headers: { 'x-user-id': getUser()?.id || '' } });
      const data = await res.json();
      if (res.ok) setPartners(data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPartners(); }, []);

  // Toggle docs drawer for a partner
  const toggleExpand = (p) => {
    if (expandedId === p.id) { setExpandedId(null); return; }
    setExpandedId(p.id);
    // Deep merge existing docs with empty template
    const existing = p.partner_docs || {};
    setEditDocs(prev => ({ ...prev, [p.id]: {
      aadhaar: { ...EMPTY_DOCS.aadhaar, ...(existing.aadhaar || {}) },
      pan:     { ...EMPTY_DOCS.pan,     ...(existing.pan     || {}) },
      dl:      { ...EMPTY_DOCS.dl,      ...(existing.dl      || {}) },
      bank:    { ...EMPTY_DOCS.bank,    ...(existing.bank    || {}) },
    }}));
  };

  const handleDocChange = (partnerId, docKey, field, value) => {
    setEditDocs(prev => ({
      ...prev,
      [partnerId]: {
        ...prev[partnerId],
        [docKey]: { ...prev[partnerId][docKey], [field]: value }
      }
    }));
  };

  const saveDocs = async (partnerId) => {
    setSavingDocs(partnerId);
    try {
      const res = await fetch(`${API_URL}/api/V1/partners/${partnerId}/docs`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-user-id': getUser()?.id || '' },
        body: JSON.stringify({ partner_docs: editDocs[partnerId] })
      });
      if (res.ok) {
        const updated = await res.json();
        setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, partner_docs: updated.data?.partner_docs || editDocs[partnerId] } : p));
        setExpandedId(null);
      }
    } catch (e) { console.error(e); }
    finally { setSavingDocs(null); }
  };

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setFormError('');
    try {
      const res = await fetch(`${API_URL}/api/V1/partners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': getUser()?.id || '' },
        body: JSON.stringify({ ...formData, partner_docs: {} })
      });
      if (res.ok) { setAddModal(false); setFormData(EMPTY_FORM); fetchPartners(); }
      else { const d = await res.json(); setFormError(d.error || 'Failed'); }
    } catch (e) { setFormError(e.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this partner?')) return;
    await fetch(`${API_URL}/api/V1/partners/${id}`, { method: 'DELETE', headers: { 'x-user-id': getUser()?.id || '' } });
    setPartners(prev => prev.filter(p => p.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const filtered = partners.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.profession?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search)
  );

  return (
    <div>
      <style>{`
        .pm-row:hover { background: #f8fafc; }
        .pm-doc-row { background: #f8fafc; border-top: 1px solid #e2e8f0; }
        .pm-input:focus { border-color: #2563eb !important; background: #fff !important; }
        .pm-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.45); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .pm-modal { background: #fff; border-radius: 20px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 32px 64px rgba(0,0,0,0.2); }
        @keyframes spin { to { transform: rotate(360deg); } }
        .pm-doc-card { background: #fff; border-radius: 12px; border: 1.5px solid #e2e8f0; padding: 16px; }
        .pm-doc-card:hover { border-color: #2563eb22; }
      `}</style>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Partners</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>{partners.length} registered partners</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input placeholder="Search name, phone, profession…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '32px', width: '240px' }} />
          </div>
          <button onClick={() => { setAddModal(true); setFormData(EMPTY_FORM); setFormError(''); }}
            style={{ padding: '10px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 700, fontSize: '14px' }}>
            <Plus size={16} /> Add Partner
          </button>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px', gap: '12px', color: '#64748b' }}>
          <div style={{ width: '24px', height: '24px', border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          Loading partners…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#94a3b8' }}>
          <Users size={48} style={{ marginBottom: '12px', opacity: 0.3 }} />
          <p style={{ fontWeight: 600 }}>{search ? 'No partners match your search' : 'No partners yet'}</p>
          {!search && <button onClick={() => setAddModal(true)} style={{ marginTop: '12px', padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}>Add First Partner</button>}
        </div>
      ) : (
        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '950px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Name & Phone', 'Profession', 'Experience', 'Documents', 'Partner Status', 'Work Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => {
                const onDuty    = p.status === 'On duty';
                const isWorking = !['idle', 'Idle', '', null, undefined].includes(p.work_status);
                const isExpanded = expandedId === p.id;
                const ds = docSummary(p.partner_docs);
                const docs = editDocs[p.id];

                return (
                  <React.Fragment key={p.id}>
                    <tr className="pm-row" style={{ borderBottom: (!isExpanded && idx < filtered.length - 1) ? '1px solid #f1f5f9' : 'none', transition: 'background 0.15s' }}>

                      {/* Name & Phone */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '15px', flexShrink: 0 }}>
                            {(p.name || 'P').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{p.name}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{p.phone || <em style={{ color: '#cbd5e1' }}>No phone</em>}</div>
                          </div>
                        </div>
                      </td>

                      {/* Profession */}
                      <td style={{ padding: '14px 16px' }}>
                        {p.profession ? <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e40af', background: '#eff6ff', padding: '3px 10px', borderRadius: '20px', textTransform: 'capitalize' }}>{p.profession}</span>
                          : <span style={{ color: '#cbd5e1', fontSize: '12px' }}>—</span>}
                      </td>

                      {/* Experience */}
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569', fontWeight: 600 }}>
                        {p.experience || <span style={{ color: '#cbd5e1' }}>—</span>}
                      </td>

                      {/* Documents summary */}
                      <td style={{ padding: '14px 16px' }}>
                        <button onClick={() => toggleExpand(p)}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', transition: 'all 0.15s', color: '#475569' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}>
                          <FileText size={14} />
                          <span style={{ fontSize: '12px', fontWeight: 700 }}>
                            {ds.total === 0 ? 'No docs' : `${ds.verified}/${ds.total} verified`}
                          </span>
                          {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                      </td>

                      {/* Partner Status */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 700, background: onDuty ? '#eff6ff' : '#f1f5f9', color: onDuty ? '#2563eb' : '#64748b' }}>
                          {p.status || 'Off duty'}
                        </span>
                      </td>

                      {/* Work Status */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 700, background: isWorking ? '#fefce8' : '#f0fdf4', color: isWorking ? '#a16207' : '#16a34a' }}>
                          {isWorking ? 'Working' : 'Idle'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px' }}>
                        <button onClick={() => handleDelete(p.id)}
                          style={{ padding: '7px 12px', border: '1px solid #fee2e2', borderRadius: '8px', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: 700, transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}>
                          Delete
                        </button>
                      </td>
                    </tr>

                    {/* EXPANDED DOCS DRAWER */}
                    {isExpanded && docs && (
                      <tr className="pm-doc-row">
                        <td colSpan={7} style={{ padding: '0 0 20px 0' }}>
                          <div style={{ padding: '20px 24px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <FileText size={16} color="#6366f1" /> Documents for {p.name}
                            </h4>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => setExpandedId(null)}
                                style={{ padding: '7px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '12px', color: '#64748b' }}>
                                Cancel
                              </button>
                              <button onClick={() => saveDocs(p.id)} disabled={savingDocs === p.id}
                                style={{ padding: '7px 16px', background: savingDocs === p.id ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: savingDocs === p.id ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {savingDocs === p.id
                                  ? <><div style={{ width: '13px', height: '13px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Saving…</>
                                  : <><Check size={13} /> Save Documents</>}
                              </button>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', padding: '12px 24px 8px' }}>
                            {Object.entries(DOC_LABELS).map(([docKey, meta]) => {
                              const docData = docs[docKey] || {};
                              const isVerified = docData.verified;
                              return (
                                <div key={docKey} className="pm-doc-card">
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <span style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span>{meta.icon}</span> {meta.label}
                                    </span>
                                    {/* Verified Toggle */}
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                      <div onClick={() => handleDocChange(p.id, docKey, 'verified', !isVerified)}
                                        style={{ width: '36px', height: '20px', borderRadius: '99px', background: isVerified ? '#22c55e' : '#e2e8f0', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
                                        <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: isVerified ? '19px' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                                      </div>
                                      {isVerified
                                        ? <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px' }}><ShieldCheck size={12} /> Verified</span>
                                        : <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}><ShieldX size={12} /> Not Verified</span>}
                                    </label>
                                  </div>

                                  {/* Fields for this doc type */}
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {meta.fields.map(f => (
                                      <div key={f.key}>
                                        <label style={labelStyle}>{f.label}</label>
                                        <input
                                          className="pm-input"
                                          value={docData[f.key] || ''}
                                          onChange={e => handleDocChange(p.id, docKey, f.key, e.target.value)}
                                          placeholder={f.placeholder}
                                          style={inputStyle}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD PARTNER MODAL */}
      {addModal && (
        <div className="pm-overlay" onClick={e => e.target === e.currentTarget && setAddModal(false)}>
          <div className="pm-modal">
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>➕ Add New Partner</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Documents can be added after creating the partner</p>
              </div>
              <button onClick={() => setAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={22} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input className="pm-input" name="name" value={formData.name} onChange={handleFormChange} required placeholder="Ravi Kumar" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Mobile Number</label>
                  <input className="pm-input" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="9876543210" type="tel" maxLength={15} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Profession</label>
                  <input className="pm-input" name="profession" value={formData.profession} onChange={handleFormChange} placeholder="Electrician, Plumber…" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Experience</label>
                  <input className="pm-input" name="experience" value={formData.experience} onChange={handleFormChange} placeholder="3 years, 6 months…" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Current Location</label>
                  <input className="pm-input" name="current_location" value={formData.current_location} onChange={handleFormChange} placeholder="Bangalore, HSR Layout…" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Partner Status</label>
                  <select className="pm-input" name="status" value={formData.status} onChange={handleFormChange} style={inputStyle}>
                    <option value="On duty">On Duty</option>
                    <option value="Off duty">Off Duty</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Work Status</label>
                  <select className="pm-input" name="work_status" value={formData.work_status} onChange={handleFormChange} style={inputStyle}>
                    <option value="idle">Idle</option>
                    <option value="in progress">Working</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div style={{ marginTop: '16px', padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '13px', fontWeight: 600 }}>
                  ⚠️ {formError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setAddModal(false)}
                  style={{ padding: '11px 24px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '14px', color: '#64748b' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  style={{ padding: '11px 28px', background: submitting ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {submitting
                    ? <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Saving…</>
                    : <><Check size={16} /> Create Partner</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnersManager;
