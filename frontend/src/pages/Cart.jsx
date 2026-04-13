import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight, ShieldCheck, ShoppingBag, ChevronLeft, CreditCard } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.discountPrice || 0) * (item.quantity || 1)), 0);
  const taxes = subtotal * 0.05; // 5% example tax
  const total = subtotal + taxes;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 72px)', paddingBottom: '5rem' }}>
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(to right, #1c6bbb, #2a85db)', padding: '2.5rem 5%', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', opacity: 0.8 }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link> / <Link to="/shop" style={{ color: '#fff', textDecoration: 'none' }}>Services</Link> / <span style={{ fontWeight: 600 }}>Checkout</span>
        </div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ShoppingBag size={32} /> Your Cart
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '-2rem auto 0', padding: '0 5%', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
          
          {/* Left Column - Cart Details */}
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cartItems.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <ShoppingBag size={40} color="#94a3b8" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Your cart is empty</h3>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>Looks like you haven't added any services yet.</p>
                <button onClick={() => navigate('/shop')} style={{ background: '#1c6bbb', color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '99px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(28,107,187,0.3)' }}>
                  Explore Services
                </button>
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Review Services</h3>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {cartItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', background: '#f8fafc', padding: '1rem', borderRadius: '16px' }}>
                      
                      <div style={{ width: '80px', height: '80px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden', background: '#e2e8f0' }}>
                        <img src={item.image || '/ac_tech.png'} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1c6bbb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{item.category}</div>
                        <h4 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>{item.title}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111' }}>₹{Number(item.discountPrice || 0).toFixed(0)}</span>
                          {item.originalPrice > item.discountPrice && (
                            <span style={{ color: '#94a3b8', textDecoration: 'line-through', fontSize: '0.85rem', fontWeight: 500 }}>₹{Number(item.originalPrice || 0).toFixed(0)}</span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: 'auto' }}>
                        {/* Elegant Pill Control */}
                        <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '99px', padding: '0.2rem', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                          <button style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', border: 'none', borderRadius: '50%', cursor: 'pointer', color: '#0f172a', fontWeight: 800, fontSize: '1.2rem', transition: 'background 0.2s' }} onClick={() => updateQuantity(item.id, -1)} onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>-</button>
                          <span style={{ width: '40px', textAlign: 'center', fontSize: '1rem', fontWeight: 700 }}>{item.quantity}</span>
                          <button style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1c6bbb', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', fontWeight: 800, fontSize: '1.2rem', transition: 'filter 0.2s' }} onClick={() => updateQuantity(item.id, 1)} onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'} onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}>+</button>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          style={{ background: '#fee2e2', border: 'none', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444', transition: 'all 0.2s', padding: 0 }}
                          title="Remove item"
                          onMouseEnter={e => { e.currentTarget.style.background = '#fca5a5'; e.currentTarget.style.color = '#7f1d1d'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#1c6bbb', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                    <ChevronLeft size={16} /> Add more services
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          {cartItems.length > 0 && (
            <div style={{ flex: '1 1 350px', position: 'sticky', top: '90px' }}>
              <div style={{ background: '#fff', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.5rem 0' }}>Order Summary</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', color: '#475569', fontWeight: 500 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal</span>
                    <span style={{ color: '#0f172a', fontWeight: 700 }}>₹ {subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Taxes & Fees (5%)</span>
                    <span style={{ color: '#0f172a', fontWeight: 700 }}>₹ {taxes.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo Code Style Block */}
                <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="text" placeholder="Promo code" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }} />
                  <button style={{ background: '#e2e8f0', color: '#475569', border: 'none', padding: '0.5rem 1rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>Apply</button>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 0 1.5rem 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Total Amount</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1c6bbb', letterSpacing: '-0.02em', lineHeight: 1 }}>₹ {total.toFixed(2)}</span>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  style={{ width: '100%', background: '#111', color: '#fff', border: 'none', padding: '1.1rem', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Proceed to Checkout <ArrowRight size={20} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
                  <ShieldCheck size={16} color="#10b981" /> 100% Secure Checkout Guarantee
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Cart;
