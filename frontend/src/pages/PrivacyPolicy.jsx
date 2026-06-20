import React, { useState, useEffect } from 'react';
import { useSEO } from '../hooks/useSEO';
import { useUI } from '../context/UIContext';

const PrivacyPolicy = () => {
  useSEO({
    title: "Privacy Policy — Dhoond.co",
    description: "Read Dhoond's Privacy Policy to understand how we collect, use, store, and protect your personal information when using our home and commercial services platform.",
    canonicalPath: "/privacy-policy"
  });

  const { openComingSoon } = useUI();
  const isAppMode = new URLSearchParams(window.location.search).get('app') === 'true';
  const [activeSection, setActiveSection] = useState('introduction');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-10% 0px -75% 0px',
        threshold: 0
      }
    );

    const sections = document.querySelectorAll('.policy-section');
    sections.forEach((sec) => observer.observe(sec));

    return () => {
      sections.forEach((sec) => observer.unobserve(sec));
    };
  }, []);

  const handleTOCClick = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const h2Style = {
    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
    fontWeight: 800,
    color: '#0f172a',
    marginBottom: '1rem',
    letterSpacing: '-0.01em',
    lineHeight: 1.3,
  };

  const h3Style = {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '0.6rem',
    marginTop: '1.5rem',
  };

  const pStyle = {
    color: '#475569',
    fontSize: '0.95rem',
    lineHeight: 1.75,
    marginBottom: '0.75rem',
  };

  const ulStyle = {
    color: '#475569',
    fontSize: '0.95rem',
    lineHeight: 1.85,
    paddingLeft: '1.25rem',
    marginBottom: '1rem',
  };

  const liStyle = {
    marginBottom: '0.3rem',
  };

  const dividerStyle = {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)',
    margin: '2rem 0',
  };

  const tocItems = [
    { id: 'introduction', label: '1. Introduction' },
    { id: 'info-collect', label: '2. Information We Collect' },
    { id: 'how-collect', label: '3. How We Collect' },
    { id: 'why-collect', label: '4. Why We Collect' },
    { id: 'location-data', label: '5. Location Data' },
    { id: 'sharing-info', label: '6. Sharing of Info' },
    { id: 'data-security', label: '7. Data Security' },
    { id: 'cookies-policy', label: '8. Cookies Policy' },
    { id: 'customer-rights', label: '9. Customer Rights' },
    { id: 'provider-verification', label: '10. Partner Verification' },
    { id: 'data-retention', label: '11. Data Retention' },
    { id: 'children-privacy', label: '12. Children\'s Privacy' },
    { id: 'third-party', label: '13. Third-Party Services' },
    { id: 'policy-changes', label: '14. Policy Changes' },
    { id: 'contact-us', label: '15. Contact Us' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'Inter, sans-serif' }}>
      
      <style>{`
        /* Smooth scrolling for anchor targets */
        html {
          scroll-behavior: smooth;
        }

        .policy-wrapper {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          gap: 40px;
          padding: 40px 24px;
        }



        /* Right Sidebar TOC links */
        .toc-link {
          display: block;
          padding: 6px 0;
          color: #64748b;
          font-size: 0.82rem;
          font-weight: 550;
          text-decoration: none;
          transition: all 0.2s ease;
          border-left: 2px solid transparent;
          padding-left: 12px;
          margin-left: -19px; /* Overlap parent border */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .toc-link:hover {
          color: #2563eb;
          padding-left: 16px;
        }
        .toc-link.active {
          color: #2563eb;
          font-weight: 750;
          border-left: 2px solid #2563eb;
          padding-left: 16px;
        }

        .policy-section {
          scroll-margin-top: 110px; /* Offset spacing for sticky header when scrolling */
        }

        /* Inline content modifications */
        .policy-content a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }
        .policy-content a:hover {
          text-decoration: underline;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1140px) {
          .policy-right-sidebar {
            display: none;
          }
        }
        .policy-right-sidebar {
          width: 230px;
          position: sticky;
          top: 100px;
          height: fit-content;
          flex-shrink: 0;
          border-left: 1px solid #e2e8f0;
          padding-left: 18px;
        }

        .policy-content {
          flex: 1;
          min-width: 0;
          background: transparent;
          padding: 0;
        }

        @media (max-width: 860px) {
          .policy-wrapper {
            padding: 24px 16px;
          }
        }

        .policy-banner-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 36px 24px;
        }
        @media (max-width: 860px) {
          .policy-banner-inner {
            padding: 24px 16px;
          }
        }
      `}</style>

      {/* Full-width Gradient Banner Box */}
      <div style={{
        background: 'linear-gradient(180deg, #3b82f6 0%, #eff6ff 100%)',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        width: '100%',
        marginTop: '16px',
      }}>
        <div className="policy-banner-inner">
          {/* Breadcrumbs inside the banner */}
          {!isAppMode && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, marginBottom: '16px' }}>
              <span>Home</span>
              <span style={{ color: '#1e293b', opacity: 0.6 }}>/</span>
              <span>Privacy Policy</span>
            </div>
          )}
          <h1 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 900,
            color: '#0f172a',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '8px',
          }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>
            Last Updated: June 3, 2026
          </p>
        </div>
      </div>

      <div className="policy-wrapper">
        


        {/* Center Content Column (Flat View, No Card Background/Borders) */}
        <div className="policy-content">
          <p style={{ color: '#334155', fontSize: '0.95rem', fontWeight: 700, marginBottom: '28px' }}>
            Last Updated on June 3, 2026
          </p>

          {/* 1. Introduction */}
          <div id="introduction" className="policy-section">
            <h2 style={h2Style}>1. Introduction</h2>
            <p style={pStyle}>
              Welcome to Dhoond ("Dhoond", "we", "our", or "us"). Dhoond is a home and commercial services marketplace that connects customers with verified service professionals for services including painting, AC servicing, RO servicing, electrical work, appliance repairs, and other related services.
            </p>
            <p style={pStyle}>
              We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, disclose, and safeguard your information when you access our website, mobile application, or use any services provided through the Dhoond platform (collectively, the "Platform").
            </p>
            <p style={pStyle}>
              By accessing or using our Platform, you acknowledge that you have read, understood, and agreed to the terms of this Privacy Policy.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 2. Information We Collect */}
          <div id="info-collect" className="policy-section">
            <h2 style={h2Style}>2. Information We Collect</h2>

            <h3 style={h3Style}>A. Customer Information</h3>
            <p style={pStyle}>We may collect the following information from customers:</p>
            <ul style={ulStyle}>
              {['Full Name', 'Mobile Number', 'Email Address', 'Residential or Commercial Address', 'Service Location', 'Profile Photo (optional)', 'Booking and Service History', 'Customer Reviews and Ratings'].map(item => (
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>

            <h3 style={h3Style}>B. Service Provider Information</h3>
            <p style={pStyle}>We may collect the following information from service professionals:</p>
            <ul style={ulStyle}>
              {['Full Name', 'Mobile Number', 'Email Address', 'Residential Address', 'Government-issued Identification Documents (such as Aadhaar, PAN, Driving License, etc.)', 'Bank Account Details for payouts', 'Professional Certifications and Skill Documents', 'Profile Photos', 'Work Experience Information', 'Service Performance and Ratings'].map(item => (
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>

            <h3 style={h3Style}>C. Technical Information</h3>
            <p style={pStyle}>When you use our Platform, we may automatically collect:</p>
            <ul style={ulStyle}>
              {['Device Information', 'Browser Type and Version', 'IP Address', 'Operating System', 'Network Information', 'App Usage Data', 'Cookies and Similar Technologies', 'Diagnostic and Performance Data'].map(item => (
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>
          </div>

          <div style={dividerStyle} />

          {/* 3. How We Collect Information */}
          <div id="how-collect" className="policy-section">
            <h2 style={h2Style}>3. How We Collect Information</h2>
            <p style={pStyle}>We collect information through various methods, including:</p>

            <h3 style={h3Style}>Directly from Users</h3>
            <ul style={ulStyle}>
              {['Account registration forms', 'Service booking requests', 'Profile updates', 'Customer support interactions', 'Feedback and reviews', 'Contact forms'].map(item => (
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>

            <h3 style={h3Style}>Automatically</h3>
            <ul style={ulStyle}>
              {['Cookies', 'Analytics tools', 'Device identifiers', 'Website and application logs'].map(item => (
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>

            <h3 style={h3Style}>From Third Parties</h3>
            <ul style={ulStyle}>
              {['Payment gateway partners', 'Identity verification providers', 'Background verification agencies', 'Analytics and marketing service providers'].map(item => (
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>
          </div>

          <div style={dividerStyle} />

          {/* 4. Why We Collect Information */}
          <div id="why-collect" className="policy-section">
            <h2 style={h2Style}>4. Why We Collect Information</h2>
            <p style={pStyle}>We use personal information for the following purposes:</p>
            <ul style={ulStyle}>
              {[
                'Creating and managing user accounts',
                'Processing service bookings',
                'Connecting customers with service professionals',
                'Identity verification',
                'Service provider verification',
                'Processing payments and refunds',
                'Customer support and dispute resolution',
                'Fraud detection and prevention',
                'Improving platform functionality and user experience',
                'Sending booking confirmations and service notifications',
                'Marketing communications and promotional offers',
                'Compliance with legal obligations',
              ].map(item => (
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>
          </div>

          <div style={dividerStyle} />

          {/* 5. Location Data */}
          <div id="location-data" className="policy-section">
            <h2 style={h2Style}>5. Location Data</h2>
            <p style={pStyle}>
              To provide location-based services, Dhoond may collect and process location information.
            </p>
            <p style={pStyle}>Location data is used to:</p>
            <ul style={ulStyle}>
              {['Identify nearby service professionals', 'Improve service matching accuracy', 'Estimate service availability', 'Enhance customer experience'].map(item => (
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>
            <p style={pStyle}>
              Location information is collected only after obtaining your permission where required by applicable law.
            </p>
            <p style={pStyle}>
              Users may disable location access at any time through their device settings. However, some Platform features may not function properly without location access.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 6. Sharing of Information */}
          <div id="sharing-info" className="policy-section">
            <h2 style={h2Style}>6. Sharing of Information</h2>
            <p style={{ ...pStyle, fontWeight: 700, color: '#0f172a' }}>We do not sell personal information to third parties.</p>
            <p style={pStyle}>We may share information under the following circumstances:</p>

            <h3 style={h3Style}>A. Service Professionals</h3>
            <p style={pStyle}>To fulfill a service request, we may share:</p>
            <ul style={ulStyle}>
              {['Customer Name', 'Phone Number', 'Service Address', 'Service Requirements', 'Booking Information'].map(item => (
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>

            <h3 style={h3Style}>B. Payment Partners</h3>
            <p style={pStyle}>We may share necessary information with trusted payment processors to facilitate:</p>
            <ul style={ulStyle}>
              {['Payment processing', 'Refunds', 'Financial reconciliation'].map(item => (
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>

            <h3 style={h3Style}>C. Government Authorities</h3>
            <p style={pStyle}>We may disclose information when required:</p>
            <ul style={ulStyle}>
              {['By law', 'By court order', 'By regulatory authorities', 'For legal compliance and investigations'].map(item => (
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>

            <h3 style={h3Style}>D. Business Transfers</h3>
            <p style={pStyle}>
              In the event of a merger, acquisition, restructuring, financing, or sale of assets, personal information may be transferred as part of the transaction.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 7. Data Security */}
          <div id="data-security" className="policy-section">
            <h2 style={h2Style}>7. Data Security</h2>
            <p style={pStyle}>
              We implement appropriate technical and organizational measures to protect personal information from unauthorized access, disclosure, alteration, loss, misuse, or destruction.
            </p>
            <p style={pStyle}>Security measures include:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
              {[
                { icon: '🔒', text: 'SSL/TLS Encryption' },
                { icon: '☁️', text: 'Secure Cloud Infrastructure' },
                { icon: '🛡️', text: 'Access Control Mechanisms' },
                { icon: '🔑', text: 'Role-Based Authorization' },
                { icon: '💾', text: 'Secure Data Storage' },
                { icon: '📊', text: 'Continuous Monitoring' },
              ].map(item => (
                <div key={item.text} style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  background: '#f8fafc', border: '1px solid #f1f5f9',
                  padding: '0.75rem 1rem', borderRadius: '12px',
                  fontSize: '0.85rem', fontWeight: 600, color: '#334155',
                }}>
                  <span style={{ fontSize: '1.1rem' }}>{item.icon}</span> {item.text}
                </div>
              ))}
            </div>
            <p style={{ ...pStyle, fontSize: '0.88rem', color: '#94a3b8', fontStyle: 'italic' }}>
              While we strive to protect your information, no method of transmission or storage is completely secure. Therefore, we cannot guarantee absolute security.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 8. Cookies Policy */}
          <div id="cookies-policy" className="policy-section">
            <h2 style={h2Style}>8. Cookies Policy</h2>
            <p style={pStyle}>
              Dhoond uses cookies and similar technologies to improve user experience and platform performance.
            </p>
            <p style={pStyle}>Cookies may be used for:</p>
            <ul style={ulStyle}>
              {['User authentication and login sessions', 'Remembering preferences', 'Analytics and performance tracking', 'Personalization of content', 'Measuring platform usage', 'Improving website functionality'].map(item => (
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>
            <p style={pStyle}>
              Users may manage cookie preferences through their browser settings.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 9. Customer Rights */}
          <div id="customer-rights" className="policy-section">
            <h2 style={h2Style}>9. Customer Rights</h2>
            <p style={pStyle}>Subject to applicable laws, users may have the following rights:</p>
            <ul style={ulStyle}>
              {[
                'Access their personal information',
                'Correct inaccurate information',
                'Update account details',
                'Request deletion of their account',
                'Withdraw consent where applicable',
                'Request a copy of their personal data',
                'Request data portability where legally applicable',
              ].map(item => (
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>
            <p style={pStyle}>
              Requests may be submitted by contacting our support team.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 10. Service Provider Verification */}
          <div id="provider-verification" className="policy-section">
            <h2 style={h2Style}>10. Service Provider Verification</h2>
            <p style={pStyle}>
              To ensure customer safety and service quality, Dhoond may conduct verification processes for service professionals.
            </p>
            <p style={pStyle}>Verification measures may include:</p>
            <ul style={ulStyle}>
              {['Identity Verification', 'Government ID Verification', 'Address Verification', 'Skill and Certification Verification', 'Background Verification', 'Fraud Prevention Screening'].map(item => (
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>
            <p style={{ ...pStyle, fontSize: '0.88rem', color: '#94a3b8', fontStyle: 'italic' }}>
              Verification does not guarantee future conduct but helps maintain platform trust and safety.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 11. Data Retention */}
          <div id="data-retention" className="policy-section">
            <h2 style={h2Style}>11. Data Retention</h2>
            <p style={pStyle}>
              We retain personal information only for as long as necessary to fulfill the purposes described in this Privacy Policy.
            </p>

            <h3 style={h3Style}>Active Accounts</h3>
            <p style={pStyle}>Personal information will be retained while the account remains active.</p>

            <h3 style={h3Style}>Inactive Accounts</h3>
            <p style={pStyle}>Information may be retained for business, legal, fraud prevention, accounting, or compliance purposes.</p>

            <h3 style={h3Style}>Deleted Accounts</h3>
            <p style={pStyle}>
              Upon receiving a valid deletion request, we will delete or anonymize personal information within a reasonable period, unless retention is required by applicable law.
            </p>
            <p style={pStyle}>
              Transaction records may be retained for legal, tax, and audit requirements.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 12. Children's Privacy */}
          <div id="children-privacy" className="policy-section">
            <h2 style={h2Style}>12. Children's Privacy</h2>
            <p style={pStyle}>
              Dhoond services are intended only for individuals who are 18 years of age or older.
            </p>
            <p style={pStyle}>
              We do not knowingly collect personal information from children under the age of 18. If we become aware that such information has been collected, we will take reasonable steps to remove it.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 13. Third-Party Services */}
          <div id="third-party" className="policy-section">
            <h2 style={h2Style}>13. Third-Party Services</h2>
            <p style={pStyle}>Our Platform may integrate with third-party services such as:</p>
            <ul style={ulStyle}>
              {['Payment Gateways', 'Analytics Providers', 'Mapping Services', 'Cloud Hosting Providers', 'Communication Platforms'].map(item => (
                <li key={item} style={liStyle}>{item}</li>
              ))}
            </ul>
            <p style={pStyle}>
              These services operate under their own privacy policies, and Dhoond is not responsible for the privacy practices of third parties.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 14. Changes to This Privacy Policy */}
          <div id="policy-changes" className="policy-section">
            <h2 style={h2Style}>14. Changes to This Privacy Policy</h2>
            <p style={pStyle}>
              Dhoond may update this Privacy Policy from time to time to reflect changes in our services, legal obligations, or business practices.
            </p>
            <p style={pStyle}>
              Updated versions will be posted on this page along with the revised effective date.
            </p>
            <p style={pStyle}>
              Your continued use of the Platform after any update constitutes acceptance of the revised Privacy Policy.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 15. Contact Us */}
          <div id="contact-us" className="policy-section" style={{ marginBottom: 0 }}>
            <h2 style={h2Style}>15. Contact Us</h2>
            <p style={pStyle}>
              If you have any questions, concerns, complaints, or requests regarding this Privacy Policy, please contact us:
            </p>

            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%)',
              border: '1px solid #e0f2fe',
              borderRadius: '16px',
              padding: '1.5rem',
              marginTop: '1rem',
            }}>
              <p style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', marginBottom: '1rem' }}>
                AMEC CODEX PRIVATE LIMITED
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, minWidth: '110px' }}>CIN:</span>
                  <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.95rem' }}>U62091MH2024PTC425971</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, minWidth: '110px' }}>Email:</span>
                  <a href="mailto:support@dhoond.co" style={{ fontWeight: 700, color: '#2563eb', fontSize: '0.95rem' }}>support@dhoond.co</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, minWidth: '110px' }}>Privacy Officer:</span>
                  <a href="mailto:privacy@dhoond.co" style={{ fontWeight: 700, color: '#2563eb', fontSize: '0.95rem' }}>privacy@dhoond.co</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, minWidth: '110px' }}>Phone:</span>
                  <a href="tel:+919102740274" style={{ fontWeight: 700, color: '#2563eb', fontSize: '0.95rem' }}>+91 91027 40274</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, minWidth: '110px', marginTop: '2px' }}>Registered Address:</span>
                  <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.95rem', lineHeight: '1.4' }}>
                    Plot No. 5A, 13 A, MIDC, Hingna MIDC, Nagpur, Maharashtra, India, 440016
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar: Dynamic Table of Contents */}
        <div className="policy-right-sidebar">
          <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            On This Page
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {tocItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleTOCClick(e, item.id)}
                className={`toc-link ${activeSection === item.id ? 'active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
