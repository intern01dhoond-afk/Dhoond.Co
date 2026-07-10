import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    // Dynamically set noindex for this 404 page to tell search engines not to index it
    const robots = document.querySelector("meta[name='robots']");
    if (robots) {
      robots.setAttribute('content', 'noindex, nofollow');
    }
    
    // Set title and description
    document.title = "Page Not Found | Dhoond.co";
    
    return () => {
      // Restore default robots behavior when navigating away
      if (robots) {
        robots.setAttribute('content', 'index, follow');
      }
    };
  }, []);

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      fontFamily: "'Outfit', sans-serif"
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: '#ffffff',
        padding: '50px 40px',
        borderRadius: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        textAlign: 'center',
        border: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        {/* Animated icon container */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(37, 99, 235, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          color: '#2563eb',
          animation: 'pulse 2s infinite'
        }}>
          <AlertCircle size={40} strokeWidth={1.5} />
        </div>

        <h1 style={{
          fontSize: '3rem',
          fontWeight: '800',
          color: '#0f172a',
          margin: '0 0 8px 0',
          lineHeight: '1.1',
          letterSpacing: '-0.02em'
        }}>
          404
        </h1>
        
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#334155',
          margin: '0 0 16px 0',
          letterSpacing: '-0.01em'
        }}>
          Page Not Found
        </h2>
        
        <p style={{
          fontSize: '0.95rem',
          color: '#64748b',
          lineHeight: '1.6',
          margin: '0 0 32px 0'
        }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track!
        </p>

        <button 
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            padding: '14px 28px',
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1d4ed8';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#2563eb';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Home size={18} />
          Back to Homepage
        </button>
      </div>
    </div>
  );
}
