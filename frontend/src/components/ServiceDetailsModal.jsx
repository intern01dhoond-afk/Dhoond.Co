import React from 'react';
import { X, CheckCircle2, Star } from 'lucide-react';

const ServiceDetailsModal = ({ item, onAddItem, onClose, quantity }) => {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }} onClick={onClose}>
      <div 
        style={{ 
          background: '#fff', borderRadius: '28px', width: '100%', maxWidth: '480px', maxHeight: '85vh', 
          overflowY: 'auto', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
          animation: 'modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }} 
        onClick={e => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f5f5f5', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
          <X size={20} />
        </button>

        {/* Top Header Section */}
        <div style={{ padding: '3rem 2.5rem 1.5rem', borderBottom: '8px solid #f9fafb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#111', margin: 0, flex: 1, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{item.title}</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#eff6ff', padding: '8px 16px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
               {quantity > 0 ? (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 900, color: '#7c3aed', fontSize: '1rem' }}>{quantity}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed', opacity: 0.7 }}>IN CART</span>
                 </div>
               ) : (
                 <button onClick={onAddItem} style={{ background: 'none', border: 'none', color: '#7c3aed', fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer' }}>Add</button>
               )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#4b5563', fontSize: '1rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={16} fill="#facc15" color="#facc15" /> 4.8 (2k+)
            </div>
            <span style={{ opacity: 0.3 }}>|</span>
            <div style={{ fontWeight: 900, color: '#111' }}>₹{item.price}</div>
            <span style={{ opacity: 0.3 }}>|</span>
            <div>{item.time}</div>
          </div>
        </div>

        {/* Benefits Section */}
        <div style={{ padding: '2.5rem' }}>
           <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111', marginBottom: '1.75rem', letterSpacing: '-0.01em' }}>Expert consultant will help you</h3>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                'Identify problem areas & suggest the best solution',
                'Select paint type, brand & colour',
                'Get a detailed quotation',
                'Clarify any questions or doubts'
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.25rem' }}>
                   <div style={{ background: '#f0fdf4', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                     <CheckCircle2 size={24} color="#10b981" />
                   </div>
                   <p style={{ margin: 0, fontSize: '1.15rem', color: '#374151', lineHeight: 1.4, fontWeight: 600 }}>{text}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Banner Section */}
        <div style={{ margin: '0 2.5rem 2.5rem', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', borderRadius: '24px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #a7f3d0' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ width: '40px', height: '40px', background: '#059669', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
             </div>
             <div style={{ fontWeight: 900, color: '#065f46', fontSize: '1.25rem', lineHeight: 1.2 }}>Pay after <br/>service satisfaction</div>
           </div>
           <div style={{ width: '64px', height: '64px', border: '3px dashed #059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900, color: '#065f46', textAlign: 'center', padding: '4px' }}>
             SATISFACTION GUARANTEED
           </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '0 2.5rem 2.5rem' }}>
          <button onClick={onClose} style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '1.25rem', borderRadius: '20px', fontWeight: 900, fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 12px 30px rgba(37,99,235,0.4)', transition: 'transform 0.2s' }} className="btn-hover">
            Done
          </button>
        </div>

      </div>

      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .btn-hover:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
};

export default ServiceDetailsModal;
