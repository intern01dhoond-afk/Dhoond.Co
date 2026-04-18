import React, { useEffect, useRef } from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

/* ─── Scoped styles injected once ─────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .cd-overlay {
    position: fixed; inset: 0;
    background: rgba(8, 6, 14, 0.72);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex; justify-content: flex-end;
    animation: cd-fade-in 0.25s ease;
  }

  @keyframes cd-fade-in  { from { opacity: 0 } to { opacity: 1 } }
  @keyframes cd-slide-in { from { transform: translateX(100%) } to { transform: translateX(0) } }
  @keyframes cd-pop-in   {
    0%   { opacity: 0; transform: scale(0.94) translateY(8px) }
    100% { opacity: 1; transform: scale(1)    translateY(0)    }
  }

  .cd-panel {
    width: 420px; max-width: 100%; height: 100%;
    display: flex; flex-direction: column;
    background: #0f0d17;
    box-shadow: -20px 0 80px rgba(0,0,0,0.6);
    animation: cd-slide-in 0.32s cubic-bezier(0.22, 1, 0.36, 1);
    font-family: 'DM Sans', sans-serif;
    color: #e8e4f0;
    overflow: hidden;
    position: relative;
  }

  /* subtle noise grain overlay */
  .cd-panel::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  .cd-panel > * { position: relative; z-index: 1; }

  /* ── Header ── */
  .cd-header {
    padding: 1.75rem 1.75rem 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex; justify-content: space-between; align-items: center;
  }

  .cd-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.75rem; font-weight: 700;
    letter-spacing: -0.01em;
    display: flex; align-items: center; gap: 0.6rem;
    color: #f5f1ff;
  }

  .cd-title-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, #c9a96e 0%, #e8c98a 100%);
    display: flex; align-items: center; justify-content: center;
    color: #0f0d17;
    flex-shrink: 0;
  }

  .cd-badge {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.65rem; font-weight: 600;
    background: rgba(201,169,110,0.18);
    color: #c9a96e;
    border: 1px solid rgba(201,169,110,0.3);
    border-radius: 99px;
    padding: 0.18rem 0.55rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-left: 0.5rem;
    align-self: center;
  }

  .cd-close {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    cursor: pointer; color: #9990b0;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, color 0.2s, transform 0.15s;
  }
  .cd-close:hover {
    background: rgba(255,255,255,0.12);
    color: #f5f1ff;
    transform: rotate(90deg);
  }

  /* ── Items ── */
  .cd-items {
    flex: 1; overflow-y: auto; padding: 1.5rem 1.75rem;
    scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.08) transparent;
  }
  .cd-items::-webkit-scrollbar { width: 4px; }
  .cd-items::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }

  /* ── Empty state ── */
  .cd-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; height: 100%;
    text-align: center; padding: 2rem;
    gap: 1rem;
  }

  .cd-empty-icon {
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.18);
    margin-bottom: 0.5rem;
  }

  .cd-empty h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem; font-weight: 600;
    color: #f5f1ff; margin: 0;
  }

  .cd-empty p { color: #6b6480; font-size: 0.875rem; margin: 0; }

  .cd-browse-btn {
    margin-top: 0.5rem;
    padding: 0.65rem 1.5rem;
    background: rgba(201,169,110,0.1);
    border: 1px solid rgba(201,169,110,0.35);
    color: #c9a96e;
    border-radius: 99px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem; font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    letter-spacing: 0.02em;
  }
  .cd-browse-btn:hover {
    background: rgba(201,169,110,0.18);
    border-color: rgba(201,169,110,0.6);
  }

  /* ── Cart Item Card ── */
  .cd-item {
    display: flex; gap: 1rem;
    padding: 1.25rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    animation: cd-pop-in 0.3s ease both;
    transition: opacity 0.2s;
  }
  .cd-item:last-child { border-bottom: none; }

  .cd-item-thumb {
    width: 64px; height: 64px; flex-shrink: 0;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(201,169,110,0.12), rgba(201,169,110,0.04));
    border: 1px solid rgba(201,169,110,0.18);
    display: flex; align-items: center; justify-content: center;
    color: #c9a96e;
  }

  .cd-item-body { flex: 1; display: flex; flex-direction: column; gap: 0.45rem; }

  .cd-item-name {
    font-size: 0.925rem; font-weight: 600;
    color: #f0ebff; line-height: 1.3;
    letter-spacing: -0.01em;
  }

  .cd-item-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem; font-weight: 700;
    color: #c9a96e; letter-spacing: -0.01em;
  }

  .cd-item-controls {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 0.1rem;
  }

  .cd-qty {
    display: flex; align-items: center; gap: 0.75rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 99px; padding: 0.3rem 0.75rem;
  }

  .cd-qty-btn {
    background: none; border: none; cursor: pointer;
    color: #9990b0; display: flex; align-items: center;
    padding: 0; transition: color 0.15s, transform 0.1s;
    border-radius: 50%;
  }
  .cd-qty-btn:hover { color: #f5f1ff; transform: scale(1.2); }

  .cd-qty-val {
    font-size: 0.85rem; font-weight: 600;
    color: #f5f1ff; min-width: 16px; text-align: center;
  }

  .cd-remove-btn {
    background: none; border: none; cursor: pointer;
    color: rgba(255,90,90,0.5);
    font-size: 0.78rem; font-weight: 500;
    display: flex; align-items: center; gap: 0.3rem;
    padding: 0.3rem 0.5rem; border-radius: 6px;
    transition: color 0.15s, background 0.15s;
    letter-spacing: 0.01em;
  }
  .cd-remove-btn:hover {
    color: #ff5a5a;
    background: rgba(255,90,90,0.08);
  }

  /* ── Footer ── */
  .cd-footer {
    padding: 1.5rem 1.75rem;
    border-top: 1px solid rgba(255,255,255,0.07);
    background: rgba(0,0,0,0.25);
    backdrop-filter: blur(10px);
  }

  .cd-subtotal {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 1.25rem;
  }

  .cd-subtotal-label {
    font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em;
    text-transform: uppercase; color: #6b6480;
  }

  .cd-subtotal-amount {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 700;
    color: #f5f1ff; letter-spacing: -0.02em;
    line-height: 1;
  }

  .cd-subtotal-amount span {
    font-size: 1.1rem; color: #c9a96e; margin-right: 0.1rem;
  }

  .cd-checkout-btn {
    width: 100%;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, #c9a96e 0%, #e0bc7e 50%, #c9a96e 100%);
    background-size: 200% auto;
    border: none; border-radius: 14px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem; font-weight: 600;
    color: #0f0d17; letter-spacing: 0.02em;
    display: flex; align-items: center; justify-content: center; gap: 0.6rem;
    transition: background-position 0.4s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(201,169,110,0.22);
  }
  .cd-checkout-btn:hover {
    background-position: right center;
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(201,169,110,0.35);
  }
  .cd-checkout-btn:active { transform: translateY(0); }

  .cd-secure {
    text-align: center;
    font-size: 0.72rem; color: #4d4665;
    margin-top: 0.75rem; letter-spacing: 0.04em;
  }
`;

/* ─── Inject styles once ───────────────────────────────────────────────── */
if (!document.getElementById('cart-drawer-styles')) {
  const el = document.createElement('style');
  el.id = 'cart-drawer-styles';
  el.textContent = STYLES;
  document.head.appendChild(el);
}

/* ─── Component ────────────────────────────────────────────────────────── */
const CartDrawer = () => {
  const {
    isCartOpen, setIsCartOpen,
    cartItems, updateQuantity, removeFromCart,
    totalAmount, clearCart,
  } = useCart();
  const navigate = useNavigate();

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setIsCartOpen(false); };
    if (isCartOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div
      className="cd-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) setIsCartOpen(false); }}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      <div className="cd-panel">

        {/* ── Header ── */}
        <div className="cd-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="cd-title">
              <div className="cd-title-icon">
                <ShoppingBag size={18} />
              </div>
              Your Cart
            </div>
            {cartItems.length > 0 && (
              <span className="cd-badge">{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</span>
            )}
          </div>
          <button
            className="cd-close"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Items ── */}
        <div className="cd-items">
          {cartItems.length === 0 ? (
            <div className="cd-empty">
              <div className="cd-empty-icon">
                <ShoppingBag size={36} />
              </div>
              <h3>Nothing here yet</h3>
              <p>Add services to get started</p>
              <button
                className="cd-browse-btn"
                onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
              >
                Browse Services
              </button>
            </div>
          ) : (
            cartItems.map((item, i) => (
              <div
                key={item.id}
                className="cd-item"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="cd-item-thumb">
                  <ShoppingBag size={22} />
                </div>
                <div className="cd-item-body">
                  <div className="cd-item-name">{item.title}</div>
                  <div className="cd-item-price">
                    <span style={{ fontFamily: 'DM Sans', fontSize: '0.85rem', fontWeight: 400, color: '#9990b0', marginRight: '0.15rem' }}>₹</span>
                    {item.discountPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="cd-item-controls">
                    <div className="cd-qty">
                      <button className="cd-qty-btn" onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity">
                        <Minus size={14} />
                      </button>
                      <span className="cd-qty-val">{item.quantity}</span>
                      <button className="cd-qty-btn" onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      className="cd-remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.title}`}
                    >
                      <Trash2 size={12} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Footer ── */}
        {cartItems.length > 0 && (
          <div className="cd-footer">
            <div className="cd-subtotal">
              <span className="cd-subtotal-label">Total Amount</span>
              <span className="cd-subtotal-amount">
                <span>₹</span>{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <button className="cd-checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>
            <p className="cd-secure">🔒 Secure checkout · 100% satisfaction guarantee</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;