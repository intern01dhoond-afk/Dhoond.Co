import React, { useState } from 'react';
import { X, CheckCircle, ChevronRight, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const PAINT_BRANDS = [
  { name: 'Asian Paints', tagline: 'Har Ghar Kuch Kehta Hai', color: '#e63329', logo: '🏠' },
  { name: 'Berger Paints', tagline: 'Express Yourself', color: '#0057a8', logo: '🎨' },
  { name: 'Dulux (AkzoNobel)', tagline: 'Let\'s Colour', color: '#e31837', logo: '✨' },
  { name: 'Nippon Paint', tagline: 'Coat of Happiness', color: '#cc0000', logo: '🌟' },
  { name: 'Kansai Nerolac', tagline: 'Healthy Home Paints', color: '#f7b500', logo: '🌿' },
  { name: 'Indigo Paints', tagline: 'Top Coat Technology', color: '#4b0082', logo: '💜' },
];

const DAMAGE_OPTIONS = [
  { id: 'seepage', label: 'Seepage / Water leakage', icon: '💧' },
  { id: 'cracks', label: 'Cracks on walls', icon: '🧱' },
  { id: 'peeling', label: 'Paint peeling off', icon: '⚠️' },
  { id: 'dampness', label: 'Dampness / Moisture', icon: '🌧️' },
  { id: 'none', label: 'No issues — fresh paint only', icon: '✅' },
];

const CONSULTATION_FEE = 499;

const PaintingBookingModal = ({ service, onClose }) => {
  const [step, setStep] = useState(1); // 1 = paint, 2 = damage, 3 = confirm
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedDamages, setSelectedDamages] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const toggleDamage = (id) => {
    if (id === 'none') {
      setSelectedDamages(['none']);
      return;
    }
    setSelectedDamages(prev =>
      prev.includes(id)
        ? prev.filter(d => d !== d && d !== 'none')
        : [...prev.filter(d => d !== 'none'), id]
    );
  };

  const handleBook = () => {
    const consultItem = {
      id: `paint-consult-${Date.now()}`,
      title: `Painting Consultation — ${service.title}`,
      description: `Brand: ${selectedBrand} | Notes: ${selectedDamages.join(', ')}`,
      discountPrice: CONSULTATION_FEE,
      originalPrice: 799,
      discountTag: '38% OFF',
      image: service.image || '/ac_tech.png',
      category: 'painter',
    };
    addToCart(consultItem);
    navigate('/shop/cart');
    onClose();
  };

  const hasIssues = selectedDamages.length > 0 && !selectedDamages.includes('none');

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: '#111', margin: '0 0 0.25rem 0' }}>{service.title}</h2>
            <p style={{ color: '#888', fontSize: '0.82rem', margin: 0 }}>
              Step {step} of 3 — {step === 1 ? 'Choose Paint Brand' : step === 2 ? 'Wall Condition' : 'Confirm Booking'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', borderRadius: '50%' }}>
            <X size={20} color="#666" />
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '4px', background: '#f0f0f0' }}>
          <div style={{ height: '100%', background: '#2a70b2', width: `${(step / 3) * 100}%`, transition: 'width 0.4s ease', borderRadius: '99px' }} />
        </div>

        <div style={{ padding: '1.5rem' }}>

          {/* ── Step 1: Paint Brand ─────────────────────────────────── */}
          {step === 1 && (
            <>
              <h3 style={{ fontWeight: 600, fontSize: '1rem', color: '#111', marginBottom: '0.4rem' }}>🎨 Select Paint Brand</h3>
              <p style={{ color: '#777', fontSize: '0.82rem', marginBottom: '1.25rem' }}>We source directly from the brand of your choice</p>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                gap: '0.75rem', 
                marginBottom: '1.5rem' 
              }}>
                {PAINT_BRANDS.map(brand => (
                  <div key={brand.name} onClick={() => setSelectedBrand(brand.name)} style={{ 
                    border: selectedBrand === brand.name ? `2px solid ${brand.color}` : '1px solid #e5e7eb', 
                    borderRadius: '10px', 
                    padding: '0.85rem 1rem', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    transition: 'all 0.15s', 
                    background: selectedBrand === brand.name ? `${brand.color}08` : '#fff' 
                  }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: brand.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>{brand.logo}</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.82rem', color: '#111', margin: 0, lineHeight: 1.2 }}>{brand.name}</p>
                      <p style={{ fontSize: '0.7rem', color: '#888', margin: 0, lineHeight: 1.3 }}>{brand.tagline}</p>
                    </div>
                    {selectedBrand === brand.name && <CheckCircle size={16} color={brand.color} style={{ flexShrink: 0 }} />}
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(2)} disabled={!selectedBrand} style={{ width: '100%', background: selectedBrand ? '#2a70b2' : '#d1d5db', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem', cursor: selectedBrand ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                Continue <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* ── Step 2: Damage / Seepage ───────────────────────────── */}
          {step === 2 && (
            <>
              <h3 style={{ fontWeight: 600, fontSize: '1rem', color: '#111', marginBottom: '0.4rem' }}>🔍 Any Seepages or Damages?</h3>
              <p style={{ color: '#777', fontSize: '0.82rem', marginBottom: '1.25rem' }}>Select all that apply — our expert will inspect on-site</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
                {DAMAGE_OPTIONS.map(opt => {
                  const isActive = selectedDamages.includes(opt.id);
                  return (
                    <div key={opt.id} onClick={() => toggleDamage(opt.id)} style={{ border: isActive ? '2px solid #2a70b2' : '1px solid #e5e7eb', borderRadius: '10px', padding: '0.85rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.85rem', background: isActive ? '#eff6ff' : '#fff', transition: 'all 0.15s' }}>
                      <span style={{ fontSize: '1.3rem' }}>{opt.icon}</span>
                      <span style={{ fontWeight: 500, fontSize: '0.88rem', color: '#222' }}>{opt.label}</span>
                      {isActive && <CheckCircle size={18} color="#2a70b2" style={{ marginLeft: 'auto' }} />}
                    </div>
                  );
                })}
              </div>

              {hasIssues && (
                <div style={{ background: '#fffbeb', border: '1px solid #fbbf24', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '0.8rem', color: '#78350f', margin: 0 }}>Our expert will assess the damage and recommend repairs before painting.</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: '#f3f4f6', color: '#444', border: 'none', padding: '0.85rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Back</button>
                <button onClick={() => setStep(3)} disabled={selectedDamages.length === 0} style={{ flex: 2, background: selectedDamages.length > 0 ? '#2a70b2' : '#d1d5db', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: selectedDamages.length > 0 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  Continue <ChevronRight size={18} />
                </button>
              </div>
            </>
          )}

          {/* ── Step 3: Confirm ────────────────────────────────────── */}
          {step === 3 && (
            <>
              <h3 style={{ fontWeight: 600, fontSize: '1rem', color: '#111', marginBottom: '1rem' }}>📋 Booking Summary</h3>

              {/* Summary Cards */}
              <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: '#888', margin: '0 0 0.2rem 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Service</p>
                    <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#111', margin: 0 }}>{service.title}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: '#888', margin: '0 0 0.2rem 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paint Brand</p>
                    <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#111', margin: 0 }}>{selectedBrand}</p>
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                  <p style={{ fontSize: '0.72rem', color: '#888', margin: '0 0 0.4rem 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wall Conditions Noted</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {selectedDamages.map(d => {
                      const opt = DAMAGE_OPTIONS.find(o => o.id === d);
                      return <span key={d} style={{ background: '#e0f2fe', color: '#075985', padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 500 }}>{opt?.icon} {opt?.label}</span>;
                    })}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div style={{ background: 'linear-gradient(135deg, #2a70b2, #1e5799)', borderRadius: '10px', padding: '1.25rem 1.5rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', margin: '0 0 0.25rem 0' }}>Book Consultation</p>
                  <p style={{ color: '#fff', fontSize: '0.82rem', margin: 0, maxWidth: '220px' }}>Expert visit, site inspection &amp; painting estimate included</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'line-through', fontSize: '0.8rem', margin: '0 0 0.1rem 0' }}>₹799</p>
                  <p style={{ color: '#fff', fontWeight: 800, fontSize: '1.4rem', margin: 0 }}>₹{CONSULTATION_FEE}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, background: '#f3f4f6', color: '#444', border: 'none', padding: '0.85rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Back</button>
                <button onClick={handleBook} style={{ flex: 2, background: 'linear-gradient(135deg, #2a70b2, #1e5799)', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(42,112,178,0.35)' }}>
                  Book Consultation at ₹{CONSULTATION_FEE} →
                </button>
              </div>
              <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.75rem', marginTop: '0.75rem', marginBottom: 0 }}>Refundable if service is cancelled 24 hrs before visit</p>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default PaintingBookingModal;
