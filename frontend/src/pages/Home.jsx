import React, { useEffect, useState, useRef } from 'react';
import { ArrowUpRight, Clock, ShieldCheck, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';



const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [featuredServices, setFeaturedServices] = useState([]);
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/services`)
      .then(res => res.json())
      .then(data => setFeaturedServices(data.slice(0, 6)))
      .catch(() => {});

    // Scroll animation observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    setTimeout(() => {
      document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#f9fafb', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>
      
      {/* Styles for dynamic layout features */}
      <style>{`
        .card-hover-lift { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, margin 0.3s ease; }
        .card-hover-lift:hover { transform: translateY(-10px); box-shadow: 0 16px 40px rgba(0,0,0,0.12) !important; }
        .card-hover-lift:active { transform: scale(0.98) !important; box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important; }
        
        .btn-hover { transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-hover:hover { transform: scale(1.05); box-shadow: 0 12px 30px rgba(0,0,0,0.15) !important; }
        .btn-hover:active { transform: scale(0.97); }

        .fade-up { opacity: 0; transform: translateY(40px); transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .animate-up { opacity: 1; transform: translateY(0); }
        
        .parallax-bg { background-image: url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M0,50 Q25,25 50,50 T100,50" stroke="rgba(217, 119, 6, 0.05)" stroke-width="2" fill="none"/></svg>'); }

        .cta-glow { position: relative; }
        .cta-glow::after { content: ''; position: absolute; inset: -4px; background: rgba(250, 204, 21, 0.5); opacity: 0; filter: blur(12px); border-radius: inherit; transition: opacity 0.3s; zIndex: -1; }
        .cta-glow:hover::after { opacity: 1; }

        .service-scroll::-webkit-scrollbar, .testi-scroll::-webkit-scrollbar { display: none; }
        .desktop-flex { display: flex; gap: 4rem; align-items: center; }
        .mobile-only { display: none; }
        .hero-text { flex: 1 1 460px; order: 1; }
        .hero-video { flex: 1 1 460px; order: 2; }
        
        .floating-rating { bottom: -30px; left: -30px; padding: 1.5rem; border-radius: 24px; gap: 0.25rem; }
        .floating-rating .rating-row { font-size: 1.5rem; gap: 0.5rem; }
        .floating-rating .rating-text { font-size: 1rem; }
        
        .video-container { border-radius: 32px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.15); }

        @media(max-width: 768px) {
           .desktop-flex { flex-direction: column; gap: 1.5rem !important; }
           .mobile-only { display: block; }
           .desktop-only { display: none !important; }
           .hero-text { order: 2; flex: none; width: 100%; padding-top: 0; }
           .hero-video { order: 1; flex: none; width: 100vw !important; margin-left: calc(-50vw + 50%) !important; position: relative; display: block; }
           .video-container { border-radius: 0 !important; box-shadow: none !important; }
           .hero-video video { max-height: 260px; object-fit: cover; border-radius: 0 !important; width: 100%; }
           .hero-section { padding: 0 5% 1.5rem !important; }
           .section-pad { padding: 2rem 5% !important; }
           .service-scroll { gap: 0.75rem !important; }
           .trust-inner { padding: 1.5rem !important; border-radius: 24px !important; }
           .trust-heading { font-size: 1.75rem !important; margin-bottom: 1.5rem !important; }
           .trust-icon-box { width: 44px !important; height: 44px !important; border-radius: 12px !important; }
           .trust-icon-box svg { width: 18px !important; height: 18px !important; }
           .trust-item-title { font-size: 1rem !important; }
           .trust-item-desc { font-size: 0.85rem !important; }
           .trust-image { max-width: 260px !important; transform: scale(1) !important; margin: 1rem auto 0 !important; display: block !important; }
           .service-card-img-container { height: 140px !important; }
           
           .floating-rating { bottom: 12px !important; left: 5vw !important; padding: 0.4rem 0.65rem !important; border-radius: 10px !important; gap: 0 !important; box-shadow: 0 8px 20px rgba(0,0,0,0.15) !important; }
           .floating-rating .rating-row { font-size: 0.95rem !important; gap: 0.25rem !important; }
           .floating-rating .rating-row svg { width: 14px !important; height: 14px !important; }
           .floating-rating .rating-text { font-size: 0.65rem !important; }
        }
        @media(min-width: 769px) {
           .service-grid { display: grid !important; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)) !important; overflow-x: visible !important; }
           .pop-grid { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; overflow-x: visible !important; align-items: start; }
           .testi-grid { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; overflow-x: visible !important; align-items: start; }
           
           /* BREAK THE PERFECT GRID safely without clipping */
           .stagger-card:nth-child(even) { margin-top: 32px; }
           
           .section-pad { padding: 5rem 5%; }
           .hero-section { padding: 5rem 5% 4rem; }
        }
      `}</style>
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* HERO SECTION */}
        <section className="hero-section" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div className="desktop-flex">
              
              {/* Left Side Content */}
              <div className="hero-text">
                <span style={{ display: 'inline-block', padding: '0.4rem 1rem', background: '#fef3c7', color: '#d97706', borderRadius: '99px', fontWeight: 800, fontSize: '0.8rem', marginBottom: '1rem', letterSpacing: '0.02em', boxShadow: '0 2px 10px rgba(253, 230, 138, 0.4)' }}>
                  #1 Rated Home Services
                </span>
                <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4.2rem)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
                  Home Services<br/>
                  <span style={{ color: '#2563eb' }}>At Your Doorstep</span>
                </h1>
                <p style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '1.5rem', lineHeight: 1.6, maxWidth: '500px', fontWeight: 500 }}>
                  Get trusted professionals for all your household needs — delivered instantly to your home, from routine fixes to major updates.
                </p>
                
                {/* CTAs */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <button onClick={() => navigate('/shop')} style={{ background: '#facc15', color: '#111', padding: '1.1rem 2rem', borderRadius: '99px', fontWeight: 800, fontSize: '1.05rem', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(250, 204, 21, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="btn-hover cta-glow">
                    Book Service <ArrowUpRight size={20} strokeWidth={3} />
                  </button>
                  <button onClick={() => navigate('/shop')} style={{ background: '#fff', color: '#111', padding: '1.1rem 2rem', borderRadius: '99px', fontWeight: 700, fontSize: '1.05rem', border: '2px solid #e5e7eb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="btn-hover">
                    Explore Services
                  </button>
                </div>

                {/* Trustpilot */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '16px', display: 'inline-flex' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map(i => <div key={i} style={{ background: '#00b67a', color: '#fff', padding: '4px', borderRadius: '4px' }}><Star size={16} fill="currentColor" /></div>)}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#4b5563' }}>100+ Verified Reviews on <strong style={{color:'#111', fontWeight: 900}}>Trustpilot</strong></span>
                </div>
              </div>

              {/* Right Side Video */}
              <div className="hero-video fade-up" style={{ position: 'relative' }}>
                 <div className="video-container">
                    <video autoPlay loop muted playsInline style={{ width: '100%', display: 'block', objectFit: 'cover' }}>
                      <source src="/hero_video.mp4" type="video/mp4" />
                    </video>
                 </div>
                 {/* FLOATING OVERLAP CARD */}
                 <div className="floating-rating" style={{ position: 'absolute', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', boxShadow: '0 20px 50px rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
                    <div className="rating-row" style={{ display: 'flex', alignItems: 'center', fontWeight: 900, color: '#111' }}>
                      <Star size={24} fill="#facc15" color="#facc15" /> 4.9 Rating
                    </div>
                    <span className="rating-text" style={{ color: '#4b5563', fontWeight: 600 }}>1 Lakh+ active bookings</span>
                 </div>
              </div>

            </div>
            
            {/* Service Shortcuts */}
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#111' }}>Trusted Home Care Services</h3>
              <div className="service-scroll service-grid" style={{ display: 'flex', gap: '1.25rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                {[
                  { label: 'Painting', img: '/icons/painter.png', color: '#fef3c7', cat: 'painter' },
                  { label: 'AC Tech', img: '/icons/ac_technician.png', color: '#e0f2fe', cat: 'technician' },
                  { label: 'RO Tech', img: '/icons/ro_technician.png', color: '#e0f2fe', cat: 'technician' },
                  { label: 'Plumber', img: '/icons/plumber.png', color: '#ffedd5', cat: 'plumber' },
                  { label: 'Electrician', img: '/icons/electrician.png', color: '#fef08a', cat: 'electrician' },
                  { label: 'Washing Mach.', img: '/icons/washing_machine.png', color: '#f3f4f6', cat: 'technician' },
                  { label: 'Refrigerator', img: '/icons/refrigerator.png', color: '#f0fdf4', cat: 'technician' }
                ].map((item, idx) => (
                  <div 
                    key={item.label} 
                    onClick={() => {
                      if (item.cat === 'painter') {
                        navigate('/painting');
                      } else {
                        navigate(item.cat ? '/shop?cat=' + item.cat : '/shop');
                      }
                    }}
                    style={{ 
                      flex: '0 0 auto', width: '120px', background: '#fff', padding: '1rem 0.75rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                    }} 
                    className="card-hover-lift"
                  >
                    <img src={item.img} alt={item.label} style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#334155', textAlign: 'center', lineHeight: 1.2 }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR SERVICES */}
        <section className="section-pad fade-up parallax-bg" style={{ background: '#f9fafb' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#2563eb', marginBottom: '0.5rem' }}>Popular Choices</p>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 900, color: '#111', letterSpacing: '-0.02em' }}>Top Demanding Services</h2>
              </div>
              <div className="desktop-only" style={{ display: 'flex', gap: '0.5rem' }}>
                 <button onClick={scrollLeft} style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={24} /></button>
                 <button onClick={scrollRight} style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={24} /></button>
              </div>
            </div>

            <div ref={scrollContainerRef} className="service-scroll pop-grid fade-up" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '3.5rem' }}>
              {featuredServices.slice(0,4).map(s => (
                <div key={s.id} onClick={() => navigate('/service/' + s.id)} style={{ flex: '0 0 auto', width: '280px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '24px', padding: '1.25rem', position: 'relative', cursor: 'pointer', boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }} className="card-hover-lift stagger-card">
                   {/* Badges */}
                   <div style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)', padding: '0.4rem 0.85rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 800, color: '#111', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.3rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                      <Star size={14} fill="#facc15" color="#facc15" /> 4.9
                   </div>
                   <div style={{ position: 'absolute', top: '2rem', right: '2rem', background: '#10b981', color: '#fff', padding: '0.4rem 0.85rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.3rem', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                      <ShieldCheck size={12} fill="currentColor" /> VERIFIED
                   </div>
                   
                   <div className="service-card-img-container" style={{ width: '100%', height: '200px', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.25rem', background: '#f8fafc' }}>
                      <img loading="lazy" src={s.image} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   </div>
                   
                   <div style={{ padding: '0 0.5rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111', marginBottom: '0.75rem', lineHeight: 1.3, height: '2.6em', overflow: 'hidden' }}>{s.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                         <span style={{ fontWeight: 900, color: '#111', fontSize: '1.4rem' }}>₹{Number(s.discountPrice).toFixed(0)}</span>
                         <span style={{ color: '#9ca3af', textDecoration: 'line-through', fontSize: '0.95rem' }}>₹{Number(s.originalPrice).toFixed(0)}</span>
                      </div>
                      <button style={{ width: '100%', background: '#fff', border: '2px solid #111', padding: '1rem', borderRadius: '14px', fontWeight: 800, fontSize: '1rem', color: '#111', cursor: 'pointer' }} className="btn-hover">
                        Book Now
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST SECTION */}
        <section className="section-pad fade-up" style={{ background: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', background: 'linear-gradient(135deg, #e0f2fe 0%, #1e3a8a 100%)', borderRadius: '48px', padding: '5rem 5%', position: 'relative' }} className="trust-inner">
             {/* Art accent */}
             <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'url("data:image/svg+xml;utf8,<svg width=\'100%\' height=\'100%\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M0 0 C 100 200, 300 100, 500 300\' stroke=\'rgba(255,255,255,0.05)\' stroke-width=\'40\' fill=\'none\'/></svg>")', pointerEvents: 'none' }} />
             
             <div className="desktop-flex" style={{ alignItems: 'center', position: 'relative', zIndex: 2 }}>
               <div style={{ flex: '1 1 400px' }}>
                  <h2 className="trust-heading" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', marginBottom: '2.5rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                    Join 1 Lakh+ <br/>Happy Customers!
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                     {[
                       { icon: <Clock size={24}/>, title: '15 Min Response', desc: 'Instant assigning of experts.' },
                       { icon: <ShieldCheck size={24}/>, title: 'Verified Experts', desc: 'Background checked professionals.' },
                       { icon: <Star size={24}/>, title: '4.9/5 Average Rating', desc: 'Consistent top-quality work.' },
                     ].map(item => (
                       <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div className="trust-icon-box" style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', flexShrink: 0 }}>
                             {item.icon}
                          </div>
                          <div>
                             <h4 className="trust-item-title" style={{ fontWeight: 800, fontSize: '1.15rem', color: '#f8fafc', margin: '0 0 0.25rem 0' }}>{item.title}</h4>
                             <p className="trust-item-desc" style={{ color: '#bae6fd', fontSize: '0.95rem', margin: 0, fontWeight: 500 }}>{item.desc}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
                <div style={{ flex: '1 1 400px', textAlign: 'center', position: 'relative' }}>
                  {/* Break symmetry phone image */}
                  <img className="trust-image" loading="lazy" src="/website_ui.webp" alt="App UI" style={{ width: '100%', maxWidth: '400px', filter: 'drop-shadow(0 40px 50px rgba(0,0,0,0.4))', transform: 'scale(1.1) translateX(5%) translateY(-5%)' }} />
               </div>
             </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="section-pad fade-up" style={{ background: '#f9fafb' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', fontWeight: 900, color: '#111', textAlign: 'center', marginBottom: '2rem', letterSpacing: '-0.02em' }}>Loved by Thousands</h2>
            <div className="testi-scroll testi-grid fade-up" style={{ display: 'flex', gap: '2rem', overflowX: 'auto', paddingBottom: '3.5rem' }}>
               {[
                  { name: 'Priya Sharma', role: 'Homeowner', text: 'The AC technician arrived exactly on time. Fixed the issue in 30 minutes. Extremely professional service.', img: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
                  { name: 'Rahul Mehta', role: 'Business Owner', text: 'I booked a full house painting. The team was clean, fast, and the finish is just premium. Highly recommended!', img: 'https://i.pravatar.cc/150?u=a04258a2462d826712d' },
                  { name: 'Sunita Kapoor', role: 'Resident', text: 'Plumbing leak was driving me crazy. Booked via Dhoond, guy came in 15 mins. Lifesaver!', img: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
               ].map(r => (
                  <div key={r.name} style={{ flex: '0 0 320px', background: '#fff', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }} className="card-hover-lift stagger-card">
                    <div style={{ display: 'flex', gap: '3px', color: '#facc15', marginBottom: '1.5rem' }}>
                      <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
                    </div>
                    <p style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem', fontWeight: 500, fontStyle: 'italic' }}>"{r.text}"</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img loading="lazy" src={r.img} alt={r.name} style={{ width: '56px', height: '56px', borderRadius: '50%' }} />
                      <div>
                        <h4 style={{ fontWeight: 800, color: '#111', margin: '0 0 0.2rem 0', fontSize: '1rem' }}>{r.name}</h4>
                        <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>{r.role}</p>
                      </div>
                    </div>
                  </div>
               ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="cta-section fade-up" style={{ background: '#fff', padding: '4rem 5% 6rem' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', background: '#111', borderRadius: '48px', padding: '5rem 2rem', position: 'relative', overflow: 'hidden' }} className="final-cta">
             <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '140%', height: '200%', background: 'radial-gradient(circle, rgba(250, 204, 21, 0.15) 0%, transparent 60%)', zIndex: 0 }} />
             <div style={{ position: 'relative', zIndex: 1 }}>
               <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 900, color: '#fff', marginBottom: '1.5rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                 Book trusted home<br/>services in seconds.
               </h2>
               <p style={{ color: '#9ca3af', fontSize: '1.15rem', marginBottom: '3rem', fontWeight: 500 }}>Join the quickest growing home services network today.</p>
               <button onClick={() => navigate('/shop')} style={{ background: '#facc15', color: '#111', padding: '1.25rem 3.5rem', borderRadius: '99px', fontWeight: 800, fontSize: '1.15rem', border: 'none', cursor: 'pointer', boxShadow: '0 12px 40px rgba(250, 204, 21, 0.4)' }} className="btn-hover cta-glow">
                 Book Service Now
               </button>
             </div>
          </div>
        </section>

        {/* Mobile Sticky CTA */}
        <div className="mobile-only fade-up" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '1rem', background: '#fff', borderTop: '1px solid #e5e7eb', zIndex: 50, paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
          <button onClick={() => navigate('/shop')} style={{ width: '100%', background: '#facc15', color: '#111', padding: '1.25rem 1.5rem', borderRadius: '16px', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', boxShadow: '0 8px 30px rgba(250, 204, 21, 0.5)' }} className="btn-hover cta-glow">
            <span style={{ fontWeight: 900, fontSize: '1.15rem' }}>Book Service</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <span style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.8 }}>Starting</span>
               <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>₹99</span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Home;
