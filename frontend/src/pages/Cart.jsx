import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  Trash2, ArrowRight, ShieldCheck, ShoppingBag, ChevronLeft,
  Sparkles, X, Phone, User, Lock, Package, Info, CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Friendly display names per category
const CATEGORY_LABELS = {
  painting: '🎨 Painting Services',
  painter: '🎨 Painting Services',
  ac: '❄️ AC Services',
  cleaning: '🧹 Cleaning Services',
  plumbing: '🔧 Plumbing Services',
  electrical: '⚡ Electrical Services',
  appliance: '🔌 Appliance Repair',
  carpentry: '🪵 Carpentry',
  pest: '🐜 Pest Control',
};

const getCategoryLabel = (cat) =>
  CATEGORY_LABELS[cat?.toLowerCase()] || `📦 ${cat || 'Services'}`;

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, setCheckoutCategory } = useCart();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Responsive state
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Login Modal States
  const [showLogin, setShowLogin] = React.useState(false);
  const [authStep, setAuthStep] = React.useState('mobile'); // mobile, otp
  const [authData, setAuthData] = React.useState({ name: '', mobile: '', otp: '' });
  const [isLoading, setIsLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState('');
  const [resendTimer, setResendTimer] = React.useState(0);
  const [pendingCategory, setPendingCategory] = React.useState(null);

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Group items by category
  const groups = cartItems.reduce((acc, item) => {
    const cat = item.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categoryKeys = Object.keys(groups);

  const handleProceed = (category) => {
    if (authLoading) return;
    setCheckoutCategory(category);
    if (isAuthenticated) {
      navigate(`/checkout?category=${encodeURIComponent(category)}`);
    } else {
      setPendingCategory(category);
      setAuthStep('mobile');
      setShowLogin(true);
    }
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    const mobile = authData.mobile.replace(/\D/g, '').slice(-10);
    if (mobile.length < 10) { setAuthError('Please enter a valid 10-digit mobile number'); return; }
    setIsLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mobile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      setAuthData(prev => ({ ...prev, otp: '' }));
      setAuthStep('otp');
      startResendTimer();
    } catch (err) {
      setAuthError(err.message || 'Could not send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (authData.otp.length < 4) { setAuthError('Please enter the 4-digit OTP'); return; }
    setIsLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: authData.mobile, otp: authData.otp, name: authData.name || 'Customer' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      login(data.user?.name || authData.name || 'Customer', authData.mobile, {
        id: data.user?.id,
        email: data.user?.email || '',
        role: data.user?.role || 'user',
        created_at: data.user?.created_at || new Date().toISOString(),
      }, data.token);
      setShowLogin(false);
      if (pendingCategory) navigate(`/checkout?category=${encodeURIComponent(pendingCategory)}`);
    } catch (err) {
      setAuthError(err.message || 'Incorrect OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '5rem', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <style>{`
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important; }
        .cart-grid { display: grid; grid-template-columns: 1fr 360px; gap: 2.5rem; align-items: start; }
        @media (max-width: 992px) {
          .cart-grid { grid-template-columns: 1fr !important; gap: 1.75rem; }
        }
        .cart-card { background: #fff; border-radius: 24px; border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 4px 20px rgba(0,0,0,0.02); overflow: hidden; transition: all 0.3s ease; }
        .cart-card:hover { box-shadow: 0 12px 30px rgba(0,0,0,0.04); }
        .checkout-btn { background: #0a57d0; color: #fff; border: none; padding: 1rem 1.75rem; border-radius: 16px; font-weight: 500; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 4px 12px rgba(10,87,208,0.15); transition: all 0.25s; }
        .checkout-btn:hover { background: #0845a3; box-shadow: 0 6px 20px rgba(10,87,208,0.25); }
        .qty-btn { background: transparent; border: none; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.1rem; font-weight: 600; color: #475569; transition: all 0.2s; }
        .qty-btn:hover { color: #0f172a; }
        .qty-btn.plus { color: #0a57d0; }
        .qty-btn.plus:hover { color: #0845a3; }
        .sidebar-card { background: #fff; border-radius: 24px; border: 1px solid rgba(226, 232, 240, 0.8); padding: 1.75rem; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
        .trust-item { display: flex; align-items: flex-start; gap: 1rem; padding: 0.85rem 0; }
        .trust-item:not(:last-child) { border-bottom: 1px solid #f1f5f9; }
        .trust-icon-wrapper { width: 36px; height: 36px; border-radius: 50%; background: #eff6ff; display: flex; align-items: center; justify-content: center; color: #0a57d0; flex-shrink: 0; }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      
      {/* Step Progress Tracker */}
      <div style={{ padding: '2rem 5% 1.75rem', background: '#ffffff', borderBottom: '1px solid #f1f5f9', boxShadow: '0 2px 10px rgba(0,0,0,0.01)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Breadcrumbs & Back Link Container */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#0f172a'} onMouseLeave={e => e.target.style.color = '#64748b'}>Home</Link>
              <span style={{ opacity: 0.5 }}>/</span>
              <span style={{ color: '#0f172a', fontWeight: 500 }}>Cart</span>
            </div>
            <Link to="/painting?service=Expert%20Consultation%20on%20Site&sub=Talk%20to%20an%20expert%20%E2%80%94%20%E2%82%B949&filter=consultation" style={{ color: '#0a57d0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500, fontSize: '0.9rem' }} onMouseEnter={e => e.target.style.color = '#0845a3'} onMouseLeave={e => e.target.style.color = '#0a57d0'}>
              <ChevronLeft size={16} strokeWidth={2.5} /> Continue Shopping
            </Link>
          </div>

          {/* Title and Stepper Container */}
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row', 
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'flex-start' : 'center', 
            gap: '1rem' 
          }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 600, color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>My Cart</h1>
            
            {/* Horizontal Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: isMobile ? '0.25rem' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '50%', background: '#0a57d0', color: '#fff', fontSize: '0.75rem', fontWeight: 500 }}>1</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#0a57d0' }}>Cart</span>
              </div>
              <div style={{ width: '30px', height: '2px', background: '#e2e8f0' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '50%', background: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 500, border: '1px solid #e2e8f0' }}>2</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>Details</span>
              </div>
              <div style={{ width: '30px', height: '2px', background: '#e2e8f0' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '50%', background: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 500, border: '1px solid #e2e8f0' }}>3</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 5% 0' }}>
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '4px solid #fff', boxShadow: '0 10px 20px rgba(0,0,0,0.03)' }}>
              <Package size={40} color="#94a3b8" strokeWidth={1.5} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem' }}>Your cart is empty</h2>
            <p style={{ color: '#64748b', margin: '0 0 2.5rem', fontSize: '1.05rem', maxWidth: '300px', marginInline: 'auto' }}>Looks like you haven't added any services to your cart yet.</p>
            <button onClick={() => navigate('/')} style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', padding: '1rem 2.5rem', borderRadius: '16px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 8px 25px rgba(37,99,235,0.3)', fontSize: '1.05rem', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(37,99,235,0.4)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(37,99,235,0.3)'; }}>Explore Services</button>
          </div>
        ) : (
          <div className="cart-grid">
            
            {/* Left Column: Cart items grouped by category */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {categoryKeys.map((cat) => {
                const items = groups[cat];
                const subtotal = items.reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0);
                
                return (
                  <div key={cat} className="cart-card">
                    <div style={{ padding: '1.25rem 1.75rem', background: '#fff', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0a57d0' }} />
                        {getCategoryLabel(cat)}
                      </h3>
                      <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#0a57d0', background: '#eff6ff', padding: '0.35rem 0.75rem', borderRadius: '99px', textTransform: 'uppercase' }}>{items.length} items</span>
                    </div>
                    
                    <div style={{ padding: '0 1.75rem' }}>
                      {items.map((item, idx) => (
                        <div key={item.id} className="cart-item-row" style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: '1.25rem', padding: '1.5rem 0', borderBottom: idx === items.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                          
                          {/* Image & Title Info */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: '#f8fafc', overflow: 'hidden', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                              <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ margin: '0 0 0.4rem', fontSize: '1.05rem', fontWeight: 500, color: '#0f172a', lineHeight: 1.35 }}>{item.title}</h4>
                              <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600, color: '#0a57d0' }}>₹{item.discountPrice}</p>
                            </div>
                          </div>
                          
                          {/* Controls: Quantity & Trash */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'space-between' : 'flex-end', gap: '1rem', marginTop: isMobile ? '0.75rem' : 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '99px', padding: '4px 8px' }}>
                              <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)} style={{ padding: '0 8px' }}>−</button>
                              <span style={{ width: '28px', textAlign: 'center', fontSize: '0.95rem', fontWeight: 500, color: '#0f172a' }}>{item.quantity}</span>
                              <button className="qty-btn plus" onClick={() => updateQuantity(item.id, 1)} style={{ padding: '0 8px' }}>+</button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)} 
                              style={{ 
                                background: isMobile ? '#fee2e2' : '#fff', 
                                border: isMobile ? 'none' : '1px solid #fee2e2', 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '12px', 
                                color: '#ef4444', 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                transition: 'all 0.2s' 
                              }}  
                              onMouseEnter={e => { if (!isMobile) e.currentTarget.style.background = '#fee2e2'; }} 
                              onMouseLeave={e => { if (!isMobile) e.currentTarget.style.background = '#fff'; }}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          
                        </div>
                      ))}
                    </div>

                    <div style={{ 
                      padding: '1.5rem 1.75rem', 
                      background: '#f8fafc', 
                      borderTop: '1px solid #f1f5f9', 
                      display: 'flex', 
                      flexDirection: isMobile ? 'column' : 'row', 
                      alignItems: isMobile ? 'stretch' : 'center', 
                      justifyContent: 'space-between', 
                      gap: '1.25rem' 
                    }}>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Category Subtotal</div>
                        <div style={{ fontWeight: 600, fontSize: '1.55rem', color: '#0f172a', letterSpacing: '-0.02em' }}>₹{subtotal}</div>
                      </div>
                      <button className="checkout-btn" onClick={() => handleProceed(cat)} style={{ width: isMobile ? '100%' : 'auto' }}>
                        Checkout this order <ArrowRight size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                );
              })}
              

            </div>

            {/* Right Column: Sidebar summaries & Trust banners */}
            <div style={{ position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Order Info sidebar card */}
              <div className="sidebar-card">
                <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Info size={20} color="#0a57d0" /> Cart Summary
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                    <span>Total Service Types</span>
                    <span style={{ fontWeight: 500, color: '#0f172a' }}>{categoryKeys.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                    <span>Total Items Count</span>
                    <span style={{ fontWeight: 500, color: '#0f172a' }}>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                  </div>
                  <div style={{ height: '1px', background: '#f1f5f9', margin: '0.25rem 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', color: '#0f172a', fontWeight: 600 }}>
                    <span>Total Value</span>
                    <span style={{ color: '#0a57d0', fontSize: '1.25rem', fontWeight: 600 }}>₹{cartItems.reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0)}</span>
                  </div>
                </div>
                
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a', display: 'flex', marginTop: '2px' }}><CheckCircle size={16} /></span>
                  <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 500, lineHeight: 1.45 }}>
                    Checkout is processed category by category to assign the best localized experts.
                  </span>
                </div>
              </div>

              {/* Trust badges sidebar card */}
              <div className="sidebar-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={20} color="#0a57d0" /> Why Dhoond?
                </h3>
                
                {[
                  { icon: <ShieldCheck size={18} />, title: 'Verified Professionals', desc: 'Every technician is background checked and certified.' },
                  { icon: <Sparkles size={18} />, title: 'Satisfaction Warranty', desc: 'Quality guaranteed or we redo the job completely free.' },
                  { icon: <Lock size={18} />, title: 'Secure Checkout', desc: 'Your personal data and payments are fully encrypted.' }
                ].map((item, idx) => (
                  <div key={idx} className="trust-item">
                    <div className="trust-icon-wrapper">
                      {item.icon}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.15rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{item.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4, fontWeight: 400 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
            </div>

          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)' }} onClick={() => setShowLogin(false)} />
          <div style={{ width: '100%', maxWidth: '420px', background: '#fff', padding: '2.5rem 2rem', borderRadius: '24px', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <button onClick={() => setShowLogin(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', border: 'none', background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }} onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}><X size={18} /></button>
            
            <div style={{ width: '56px', height: '56px', background: '#eff6ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid #dbeafe' }}>
              <User size={28} color="#2563eb" />
            </div>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: '#0f172a' }}>{authStep === 'mobile' ? 'Verify your number' : 'Enter OTP'}</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {authStep === 'mobile' ? 'We need this to confirm your booking and send updates.' : `Sent to +91 ${authData.mobile}`}
            </p>
            
            {authError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Info size={16} /> {authError}</div>}
            
            {authStep === 'mobile' ? (
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 500 }}>+91</span>
                <input type="tel" value={authData.mobile} onChange={e => setAuthData({...authData, mobile: e.target.value.replace(/\D/g, '')})} placeholder="Mobile Number" maxLength={10} style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '14px', border: '2px solid #e2e8f0', fontSize: '1.05rem', fontWeight: 500, color: '#0f172a', outline: 'none', transition: 'border-color 0.2s', background: '#fafafa' }} onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#fafafa'; }} />
              </div>
            ) : (
              <div style={{ marginBottom: '1.5rem' }}>
                <input type="text" value={authData.otp} onChange={e => setAuthData({...authData, otp: e.target.value})} placeholder="Enter 4-digit OTP" maxLength={4} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '2px solid #e2e8f0', fontSize: '1.1rem', fontWeight: 500, color: '#0f172a', outline: 'none', textAlign: 'center', letterSpacing: '0.2em', transition: 'border-color 0.2s', background: '#fafafa' }} onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#fafafa'; }} />
              </div>
            )}
            
            <button onClick={authStep === 'mobile' ? handleSendOtp : handleVerifyOtp} disabled={isLoading} style={{ width: '100%', padding: '1rem', background: isLoading ? '#94a3b8' : '#0f172a', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 600, fontSize: '1.05rem', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', boxShadow: isLoading ? 'none' : '0 4px 15px rgba(15,23,42,0.2)' }}>
              {isLoading ? 'Processing...' : (authStep === 'mobile' ? 'Send OTP' : 'Verify & Continue')}
            </button>
            
            {authStep === 'otp' && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button onClick={resendTimer === 0 ? handleSendOtp : null} style={{ background: 'none', border: 'none', color: resendTimer === 0 ? '#2563eb' : '#94a3b8', fontWeight: 500, cursor: resendTimer === 0 ? 'pointer' : 'default', fontSize: '0.9rem' }}>
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
