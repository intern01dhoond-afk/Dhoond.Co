import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

const ConsultationProcessModal = ({ onClose }) => {
  const steps = [
    {
      id: 1,
      title: 'At-home consultation',
      desc: 'Our expert will visit to understand your needs and take digital measurements of your rooms.',
      img: '/interior.jpg'
    },
    {
      id: 2,
      title: 'We inspect walls',
      desc: 'The consultant uses a digital dampness meter to check for seepage and inspects the wall for potential structural repairs.',
      imgs: ['/wall2.jpg', '/paint-progress.png']
    },
    {
      id: 3,
      title: 'Get custom quotation',
      desc: 'We will provide a personalized, transparent quote detailing the exact price, material quality, and project scope.',
      img: '/website_ui.webp'
    },
    {
      id: 4,
      title: 'Schedule service',
      desc: 'Upon quote approval, we deliver all necessary materials and start the transformation on your preferred date.'
    },
    {
      id: 5,
      title: 'Project handover',
      desc: 'We complete the service with perfection and conduct a final inspection with you for total satisfaction.'
    }
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }} onClick={onClose}>
      <div 
        style={{ 
          background: '#fff', borderRadius: '28px', width: '100%', maxWidth: '480px', maxHeight: '85vh', 
          overflowY: 'auto', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
          animation: 'modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }} 
        onClick={e => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f5f5f5', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIrndex: 10 }}>
          <X size={20} />
        </button>

        {/* Content */}
        <div className="modal-content" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '2.5rem' }}>
             <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#111', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>Consultation process</h2>
             <p style={{ color: '#666', fontSize: '1rem', fontWeight: 500, margin: 0 }}>The 5-step Dhoond transformation journey</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {steps.map((step, idx) => (
              <div key={step.id} style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', background: '#fff', 
                    color: '#6b7280', fontSize: '0.9rem', fontWeight: 800, display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', border: '2.5px solid #e5e7eb',
                    flexShrink: 0
                  }}>
                    {step.id}
                  </div>
                  {idx !== steps.length - 1 && (
                    <div style={{ width: '2.5px', flex: 1, background: '#e5e7eb', margin: '6px 0' }}></div>
                  )}
                </div>
                <div style={{ paddingBottom: idx === steps.length - 1 ? 0 : '2.5rem', flex: 1 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111', margin: '0 0 6px 0' }}>{step.title}</h3>
                  <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: 1.6, marginBottom: step.img || step.imgs ? '1.25rem' : 0, fontWeight: 500 }}>{step.desc}</p>
                  
                  {step.img && (
                    <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
                       <img src={step.img} alt={step.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    </div>
                  )}
                  {step.imgs && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.75rem' }}>
                       <img src={step.imgs[0]} alt="Step A" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '16px', border: '1px solid #f1f5f9' }} />
                       <img src={step.imgs[1]} alt="Step B" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '16px', border: '1px solid #f1f5f9' }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Action */}
        <div style={{ padding: '1.5rem 2.5rem 2.5rem', borderTop: '1px solid #f0f0f0', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', position: 'sticky', bottom: 0, borderRadius: '0 0 28px 28px' }}>
          <button onClick={onClose} style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '1.1rem', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(37,99,235,0.3)' }}>
            Done
          </button>
        </div>

      </div>

      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 480px) {
          .modal-content { padding: 1.5rem !important; }
          h2 { fontSize: 1.4rem !important; }
          div[style*="padding: 1.5rem 2.5rem 2.5rem"] { padding: 1rem 1.5rem 1.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default ConsultationProcessModal;
