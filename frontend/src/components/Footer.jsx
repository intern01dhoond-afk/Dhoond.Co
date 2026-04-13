import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: '#0f172a', color: '#f8fafc' }}>
    {/* Top contact bar */}
    <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '3.5rem 5%' }}>
      <div className="mobile-stack" style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
        <div className="mobile-text-center">
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Need Assistance?</p>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>We're here to help.</h3>
        </div>
        <div className="mobile-stack mobile-text-center" style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Call us</p>
            <a href="tel:+919102740274" style={{ fontWeight: 800, color: '#facc15', fontSize: '1.15rem' }}>+91 9102740274</a>
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Support</p>
            <a href="mailto:support@dhoond.co" style={{ fontWeight: 800, color: '#facc15', fontSize: '1.15rem' }}>support@dhoond.co</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'inherit' }}>
            <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>Follow us</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'inherit' }}>
              {[
                { label: 'Fb', bg: '#1877f2', color: '#fff' },
                { label: 'Ig', bg: '#e1306c', color: '#fff' },
                { label: 'X', bg: '#000', color: '#fff' },
                { label: 'in', bg: '#0a66c2', color: '#fff' },
              ].map(s => (
                <a key={s.label} href="#" style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1', textDecoration: 'none', transition: 'all 0.3s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background = s.bg; e.currentTarget.style.color = s.color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Main links */}
    <div className="mobile-stack mobile-text-center" style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 5%', display: 'flex', flexWrap: 'wrap', gap: '4rem', justifyContent: 'space-between' }}>
      <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', alignItems: 'inherit' }}>
        <img src="/logo.png" alt="Dhoond.co" style={{ height: 'auto', maxHeight: '110px', width: '160px', objectFit: 'contain', marginBottom: '1.5rem', filter: 'brightness(0) invert(1)' }} />
        <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.8, maxWidth: '320px', fontWeight: 500 }}>
          India's fastest growing premium home services marketplace. Quality craftsmanship delivered to your doorstep.
        </p>
      </div>
      {[
        { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press'] },
        { title: 'Services', links: ['Painting', 'AC Tech', 'Plumbing', 'Electrician', 'Deep Cleaning'] },
        { title: 'Support', links: ['Help Center', 'Privacy Policy', 'Terms of Service', 'Refund Policy'] },
        { title: 'Partners', links: ['Join as Expert', 'Partner with Us', 'Training Center'] },
      ].map(col => (
        <div key={col.title} style={{ flex: '1 1 150px' }}>
          <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{col.title}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {col.links.map(l => (
              <Link key={l} to="#" style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#facc15'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>{l}</Link>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Bottom bar */}
    <div style={{ borderTop: '1px solid #1e293b', padding: '2rem 5%' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }} className="mobile-stack mobile-text-center">
        <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>© {new Date().getFullYear()} DhoondApp. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          <Link to="#" style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>Terms of Service</Link>
          <Link to="#" style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
