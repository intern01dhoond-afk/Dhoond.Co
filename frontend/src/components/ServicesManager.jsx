import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X, Check, Search, Package } from 'lucide-react';

const EMPTY_FORM = {
  title: '', category: '', original_price: '', discount_price: '',
  discount_tag: '', description: '', image: ''
};

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: '8px',
  border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none',
  boxSizing: 'border-box', color: '#0f172a', background: '#f8fafc',
  transition: 'border-color 0.2s'
};

const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: '#374151' };

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Modal state — null = closed, 'add' = add mode, service object = edit mode
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete confirmation
  const [deletingId, setDeletingId] = useState(null);

  const getUser = () => {
    try { return JSON.parse(localStorage.getItem('dhoond_user') || '{}'); }
    catch { return {}; }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const fetchServices = async () => {
    setLoading(true);
    try {
      const user = getUser();
      const res = await fetch(`${API_URL}/api/V1/services`, {
        headers: { 'x-user-id': user?.id || '' }
      });
      const data = await res.json();
      if (res.ok) {
        setServices(Array.isArray(data) ? data : (data.services || []));
      }
    } catch (err) {
      console.error('Failed to fetch services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  // Open add modal
  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setFormError('');
    setModal('add');
  };

  // Open edit modal pre-filled
  const openEdit = (service) => {
    setFormData({
      title: service.title || '',
      category: service.category || '',
      original_price: service.original_price ?? '',
      discount_price: service.discount_price ?? '',
      discount_tag: service.discount_tag || '',
      description: service.description || '',
      image: service.image || ''
    });
    setFormError('');
    setModal(service); // store the service being edited
  };

  const closeModal = () => { setModal(null); setFormError(''); };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      const user = getUser();
      const payload = {
        ...formData,
        original_price: parseFloat(formData.original_price),
        discount_price: parseFloat(formData.discount_price)
      };

      const isEdit = modal && modal !== 'add';
      const url = isEdit
        ? `${API_URL}/api/V1/services/${modal.id}`
        : `${API_URL}/api/V1/services`;

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user?.id || '' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        closeModal();
        fetchServices();
      } else {
        setFormError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const user = getUser();
      const res = await fetch(`${API_URL}/api/V1/services/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user?.id || '' }
      });
      if (res.ok) {
        setServices(prev => prev.filter(s => s.id !== id));
      } else {
        alert('Failed to delete service');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setDeletingId(null);
    }
  };

  const categories = ['all', ...Array.from(new Set(services.map(s => s.category).filter(Boolean))).sort()];

  const filtered = services.filter(s => {
    const matchesSearch = s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const isEdit = modal && modal !== 'add';

  return (
    <div>
      <style>{`
        .svc-input:focus { border-color: #2563eb !important; background: #fff !important; }
        .svc-row:hover { background: #f8fafc; }
        .svc-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.45); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .svc-modal { background: #fff; border-radius: 20px; width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto; box-shadow: 0 32px 64px rgba(0,0,0,0.2); }
        .action-btn { padding: 8px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .action-btn:hover { transform: scale(1.1); }
      `}</style>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Services Directory</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>{services.length} services registered</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search services…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '32px', width: '220px' }}
            />
          </div>
          <button
            onClick={openAdd}
            style={{ padding: '10px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 700, fontSize: '14px' }}
          >
            <Plus size={16} /> Add Service
          </button>
        </div>
      </div>

      {/* CATEGORY FILTER PILLS */}
      {!loading && categories.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {categories.map(cat => {
            const count = cat === 'all' ? services.length : services.filter(s => s.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '99px',
                  border: isActive ? '1.5px solid #2563eb' : '1.5px solid #e2e8f0',
                  background: isActive ? '#2563eb' : '#fff',
                  color: isActive ? '#fff' : '#64748b',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textTransform: 'capitalize',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {cat === 'all' ? 'All Services' : cat}
                <span style={{
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                  color: isActive ? '#fff' : '#475569',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '99px',
                  minWidth: '20px',
                  textAlign: 'center'
                }}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* TABLE */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px', gap: '12px', color: '#64748b' }}>
          <div style={{ width: '24px', height: '24px', border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Loading services…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#94a3b8' }}>
          <Package size={48} style={{ marginBottom: '12px', opacity: 0.35 }} />
          <p style={{ fontWeight: 600, fontSize: '16px' }}>{search ? 'No services match your search' : 'No services yet'}</p>
          {!search && <button onClick={openAdd} style={{ marginTop: '12px', padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}>Add First Service</button>}
        </div>
      ) : (
        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Image', 'Title & Category', 'Pricing', 'Description', 'Actions'].map((h, i) => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em', width: i === 0 ? '80px' : i === 4 ? '110px' : 'auto' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => (
                <tr key={s.id} className="svc-row" style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.15s' }}>
                  <td style={{ padding: '14px 16px' }}>
                    {s.image
                      ? <img src={s.image} alt={s.title} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                      : <div style={{ width: '56px', height: '56px', background: '#f1f5f9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#94a3b8' }}>No Img</div>
                    }
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{s.title}</div>
                    <span style={{ fontSize: '11px', color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '20px', fontWeight: 700, textTransform: 'capitalize', display: 'inline-block', marginTop: '4px' }}>{s.category}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>₹{s.discount_price}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through' }}>₹{s.original_price}</div>
                    {s.discount_tag && <span style={{ fontSize: '11px', color: '#16a34a', background: '#f0fdf4', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, display: 'inline-block', marginTop: '4px' }}>{s.discount_tag}</span>}
                  </td>
                  <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} title={s.description}>{s.description}</p>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="action-btn"
                        onClick={() => openEdit(s)}
                        title="Edit service"
                        style={{ border: '1px solid #dbeafe', background: '#eff6ff', color: '#2563eb' }}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => handleDelete(s.id)}
                        disabled={deletingId === s.id}
                        title="Delete service"
                        style={{ border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', opacity: deletingId === s.id ? 0.5 : 1 }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {modal && (
        <div className="svc-modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="svc-modal">
            {/* Modal Header */}
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  {isEdit ? '✏️ Edit Service' : '➕ Add New Service'}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                  {isEdit ? `Editing: ${modal.title}` : 'Fill in the details below'}
                </p>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}>
                <X size={22} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Service Title *</label>
                  <input className="svc-input" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. AC Installation" style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Category *</label>
                  <input className="svc-input" name="category" value={formData.category} onChange={handleChange} required placeholder="e.g. electrician" style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Discount Tag</label>
                  <input className="svc-input" name="discount_tag" value={formData.discount_tag} onChange={handleChange} placeholder="e.g. 20% OFF" style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Original Price (₹) *</label>
                  <input className="svc-input" type="number" name="original_price" value={formData.original_price} onChange={handleChange} required min="0" placeholder="599" style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Discount Price (₹) *</label>
                  <input className="svc-input" type="number" name="discount_price" value={formData.discount_price} onChange={handleChange} required min="0" placeholder="399" style={inputStyle} />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Image URL</label>
                  <input className="svc-input" name="image" value={formData.image} onChange={handleChange} placeholder="https://… or /public-path.png" style={inputStyle} />
                  {formData.image && (
                    <img src={formData.image} alt="preview" onError={e => e.target.style.display = 'none'} style={{ marginTop: '8px', height: '64px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                  )}
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Description</label>
                  <textarea className="svc-input" name="description" value={formData.description} onChange={handleChange} placeholder="Brief description of the service…" rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} />
                </div>

              </div>

              {formError && (
                <div style={{ marginTop: '16px', padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '13px', fontWeight: 600 }}>
                  ⚠️ {formError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={closeModal} style={{ padding: '11px 24px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '14px', color: '#64748b' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '11px 28px', background: submitting ? '#93c5fd' : isEdit ? '#7c3aed' : '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
                >
                  {submitting ? (
                    <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Saving…</>
                  ) : (
                    <><Check size={16} />{isEdit ? 'Save Changes' : 'Create Service'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
