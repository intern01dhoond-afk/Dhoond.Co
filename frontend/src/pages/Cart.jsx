import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  Trash2, ArrowRight, ShoppingBag, ChevronLeft,
  X, Phone, Lock, Package, Info, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ─── Luxury Design Tokens ────────────────────────────────────────── */
const LUX_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .lux-page {
    background: #08060e;
    min-height: 100vh;
    color: #e8e4f0;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .lux-page::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    z-index: 0;
  }

  .lux-header-bg {
    background: linear-gradient(180deg, rgba(20,18,34,1) 0%, rgba(8,6,14,1) 100%);
    padding: 5rem 5% 4rem;
    position: relative;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .lux-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.5rem, 8vw, 4rem);
    font-weight: 700;
    color: #f5f1ff;
    letter-spacing: -0.02em;
    margin: 0;
  }

  .lux-card {
    background: rgba(255,255,255,0.02);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 32px;
    overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.3s;
    margin-bottom: 2rem;
  }

  .lux-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    border-color: rgba(201,169,110,0.25);
  }

  .lux-cat-header {
    padding: 1.5rem 2rem;
    background: rgba(255,255,255,0.03);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex; justify-content: space-between; align-items: center;
  }

  .lux-cat-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 600; color: #f5f1ff;
  }

  .lux-btn-gold {
    background: linear-gradient(135deg, #c9a96e 0%, #e0bc7e 50%, #c9a96e 100%);
    background-size: 200% auto;
    color: #08060e;
    padding: 1.1rem 2.5rem;
    border-radius: 99px;
    border: none;
    font-weight: 700; font-size: 1rem;
    cursor: pointer;
    display: flex; align-items: center; gap: 0.75rem;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(201,169,110,0.2);
  }
  .lux-btn-gold:hover {
    background-position: right center;
    transform: scale(1.02) translateY(-2px);
    box-shadow: 0 15px 40px rgba(201,169,110,0.35);
  }

  .lux-item {
    padding: 2rem;
    display: flex; gap: 2rem;
    animation: lux-fade-in 0.5s ease both;
  }

  @keyframes lux-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .lux-qty-ctrl {
    display: flex; align-items: center; gap: 1rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px; padding: 0.5rem 1rem;
  }

  .lux-modal-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(8,6,14,0.85); backdrop-filter: blur(10px);
    display: flex; alignItems: center; justifyContent: center; padding: 1rem;
  }
`;

// Friendly display names per category
const CATEGORY_LABELS = {
  painting: '🎨 Painting Portfolio',
  ac: '❄️ Climate Systems',
  cleaning: '✨ Home Restoration',
  plumbing: '🔧 Hydronic Services',
  electrical: '⚡ Energy Systems',
  appliance: '🔌 Tech Maintenance',
};

const getCategoryLabel = (cat) => CATEGORY_LABELS[cat?.toLowerCase()] || `🔱 ${cat || 'Boutique Services'}`;

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, setCheckoutCategory, totalAmount } = useCart();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = React.useState(false);
  const [authStep, setAuthStep] = React.useState('mobile');
  const [authData, setAuthData] = React.useState({ name: '', mobile: '', otp: '' });
  const [isLoading, setIsLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState('');
  const [resendTimer, setResendTimer] = React.useState(0);
  const [pendingCategory, setPendingCategory] = React.useState(null);

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!document.getElementById('lux-cart-styles')) {
      const el = document.createElement('style');
      el.id = 'lux-cart-styles';
      el.textContent = LUX_STYLES;
      document.head.appendChild(el);
    }
  }, []);

  const groups = cartItems.reduce((acc, item) => {
    const cat = item.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categoryKeys = Object.keys(groups);

  const handleProceed = (category) => {
    setCheckoutCategory(category);
    if (isAuthenticated) {
      navigate(`/checkout?category=${encodeURIComponent(category)}`);
    } else {
      setPendingCategory(category);
      setShowLogin(true);
    }
  };

  const handleSendOtp = async () => {
    const mobile = authData.mobile.replace(/\D/g, '').slice(-10);
    if (mobile.length < 10) { setAuthError('Please enter a valid 10-digit mobile number'); return; }
    setIsLoading(true); setAuthError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mobile }),
      });
      if (!res.ok) throw new Error('Failed to send code');
      setAuthStep('otp');
      setResendTimer(60);
    } catch (err) { setAuthError(err.message); } finally { setIsLoading(false); }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true); setAuthError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: authData.mobile, otp: authData.otp, name: authData.name || 'Dhoond Patron' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      login(data.user?.name || 'Customer', authData.mobile, data.user, data.token);
      setShowLogin(false);
      if (pendingCategory) navigate(`/checkout?category=${encodeURIComponent(pendingCategory)}`);
    } catch (err) { setAuthError(err.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="lux-page">
      <div className="lux-header-bg">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '1rem', color: '#c9a96e', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            <Link to="/" style={{ color: 'inherit' }}>Residence</Link>
            <span>/</span>
            <span>Atelier</span>
          </div>
          <h1 className="lux-title">Your Curated Selections</h1>
          {cartItems.length > 0 && (
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ color: '#9990b0', fontSize: '1.1rem' }}>
                <span style={{ color: '#fff', fontWeight: 700 }}>{cartItems.length}</span> Services in <span style={{ color: '#fff', fontWeight: 700 }}>{categoryKeys.length}</span> Categories
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '-3rem auto 0', padding: '0 5% 10rem', position: 'relative', zIndex: 10 }}>
        {cartItems.length === 0 ? (
          <div className="lux-card" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem' }}>
              <ShoppingBag size={42} color="#c9a96e" />
            </div>
            <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', marginBottom: '1rem' }}>Your Bag is Empty</h3>
            <p style={{ color: '#8b85a3', maxWidth: '400px', margin: '0 auto 3rem', lineHeight: 1.6 }}>Our masters are ready to deliver excellence. Begin your journey by selecting a service from our collection.</p>
            <button className="lux-btn-gold" style={{ margin: '0 auto' }} onClick={() => navigate('/painting')}>
              Discover Services <ArrowRight size={20} />
            </button>
          </div>
        ) : (
          <div>
            {categoryKeys.map((cat, groupIdx) => {
              const items = groups[cat];
              const catSubtotal = items.reduce((s, i) => s + (Number(i.discountPrice || 0) * (i.quantity || 1)), 0);

              return (
                <div key={cat} className="lux-card" style={{ animationDelay: `${groupIdx * 0.1}s` }}>
                  <div className="lux-cat-header">
                    <div className="lux-cat-title">{getCategoryLabel(cat)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <span style={{ color: '#9990b0', fontSize: '0.9rem', fontWeight: 500 }}>{items.length} items</span>
                       <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                       <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.4rem', color: '#c9a96e', fontWeight: 700 }}>₹{catSubtotal.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <div style={{ padding: '1rem 0' }}>
                    {items.map((item, i) => (
                      <div key={item.id} className="lux-item" style={{ borderBottom: i < items.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#12101a' }}>
                          <img src={item.image || '/logo.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.title} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <h4 style={{ fontSize: '1.3rem', fontFamily: 'Cormorant Garamond', margin: 0 }}>{item.title}</h4>
                            <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#ff5a5a', cursor: 'pointer', opacity: 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.6}>
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <div style={{ color: '#8b85a3', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Premium Service Offering</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div className="lux-qty-ctrl">
                              <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', color: '#8b85a3', cursor: 'pointer' }}><Minus size={16} /></button>
                              <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', color: '#8b85a3', cursor: 'pointer' }}><Plus size={16} /></button>
                            </div>
                            <div style={{ fontSize: '1.5rem', fontFamily: 'Cormorant Garamond', fontWeight: 700, color: '#f5f1ff' }}>₹{Number(item.discountPrice).toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#8b85a3', fontSize: '0.85rem' }}>
                       <ShieldCheck size={18} color="#c9a96e" /> Dhoond Protection Applied
                    </div>
                    <button className="lux-btn-gold" onClick={() => handleProceed(cat)}>
                      Finalize Order <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              );
            })}

            <button onClick={() => navigate('/painting')} style={{ background: 'none', border: 'none', color: '#8b85a3', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: '2rem auto', fontWeight: 600 }}>
              <ChevronLeft size={18} /> Continue Crafting Your Space
            </button>
          </div>
        )}
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="lux-modal-overlay">
          <div style={{ position: 'absolute', inset: 0 }} onClick={() => !isLoading && setShowLogin(false)} />
          <div style={{ position: 'relative', width: '100%', maxWidth: '440px', background: '#0f0d17', borderRadius: '40px', padding: '3.5rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}>
            <button onClick={() => setShowLogin(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', color: '#9990b0' }}>
              <X size={20} />
            </button>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
               <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', color: '#f5f1ff', margin: '0 0 0.5rem' }}>Welcome Back</h2>
               <p style={{ color: '#8b85a3', fontSize: '0.95rem' }}>{authStep === 'mobile' ? 'Please share your contact to proceed' : 'Enter the code sent to your device'}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {authError && <div style={{ color: '#ff5a5a', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>{authError}</div>}
              
              {authStep === 'mobile' ? (
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem' }}>
                  <input type="tel" placeholder="Mobile Identity" maxLength={10} value={authData.mobile} onChange={e => setAuthData({...authData, mobile: e.target.value.replace(/\D/g,'')})}
                    style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', width: '100%', fontSize: '1.5rem', textAlign: 'center', letterSpacing: '4px', fontFamily: 'DM Sans' }} />
                </div>
              ) : (
                <input type="text" placeholder="● ● ● ●" maxLength={4} value={authData.otp} onChange={e => setAuthData({...authData, otp: e.target.value.replace(/\D/g,'')})}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', outline: 'none', color: '#c9a96e', width: '100%', fontSize: '2.5rem', textAlign: 'center', letterSpacing: '1rem', borderRadius: '20px', padding: '1rem' }} />
              )}

              <button className="lux-btn-gold" style={{ width: '100%', justifyContent: 'center' }} onClick={authStep === 'mobile' ? handleSendOtp : handleVerifyOtp} disabled={isLoading}>
                {isLoading ? 'Processing...' : (authStep === 'mobile' ? 'Secure Access' : 'Authenticate')} <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
