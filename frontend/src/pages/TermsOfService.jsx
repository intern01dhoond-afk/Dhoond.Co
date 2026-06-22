import React, { useState, useEffect } from 'react';
import { useSEO } from '../hooks/useSEO';
import { useUI } from '../context/UIContext';

const TermsOfService = () => {
  useSEO({
    title: "Terms of Service — Dhoond.co",
    description: "Read Dhoond's Terms of Service to understand our rules, marketplace guidelines, cancellation policies, and user agreements for home and commercial services.",
    canonicalPath: "/terms-of-service"
  });

  const { openComingSoon } = useUI();
  const isAppMode = new URLSearchParams(window.location.search).get('app') === 'true';
  const [activeSection, setActiveSection] = useState('acceptance-terms');

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
    { id: 'acceptance-terms', label: '1. Acceptance of Terms' },
    { id: 'definitions', label: '2. Definitions' },
    { id: 'marketplace-nature', label: '3. Marketplace Nature' },
    { id: 'regulatory-compliance', label: '4. Regulatory Compliance' },
    { id: 'eligibility-accounts', label: '5. Eligibility and Accounts' },
    { id: 'customer-terms', label: '6. Customer Terms' },
    { id: 'partner-terms', label: '7. Partner Terms' },
    { id: 'background-verification', label: '8. Verification Disclaimer' },
    { id: 'booking-pricing', label: '9. Booking, Pricing, Payments' },
    { id: 'cancellation-refund', label: '10. Cancellation & Refund' },
    { id: 'property-damage', label: '11. Property Damage & Safety' },
    { id: 'anti-circumvention', label: '12. Anti-Circumvention' },
    { id: 'safety-policy', label: '13. Safety & Zero-Tolerance' },
    { id: 'user-content', label: '14. User Content & Reviews' },
    { id: 'intellectual-property', label: '15. Intellectual Property' },
    { id: 'third-party', label: '16. Third-Party Services' },
    { id: 'data-privacy', label: '17. Data Privacy Linkage' },
    { id: 'disclaimers-liability', label: '18. Disclaimers & Liability' },
    { id: 'indemnification', label: '19. Indemnification' },
    { id: 'suspension-termination', label: '20. Suspension & Termination' },
    { id: 'governing-law', label: '21. Governing Law & Arbitration' },
    { id: 'grievance-officer', label: '22. Grievance Officer' },
    { id: 'force-majeure', label: '23. Force Majeure & Misc' },
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

        .contact-card-container {
          background: linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%);
          border: 1px solid #e0f2fe;
          border-radius: 16px;
          padding: 1.5rem;
          margin-top: 1rem;
        }

        .contact-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 0.6rem;
        }
        .contact-row:last-child {
          margin-bottom: 0;
        }

        .contact-label {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 600;
          min-width: 150px;
          flex-shrink: 0;
        }

        .contact-value {
          font-weight: 600;
          color: #334155;
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .contact-value a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 700;
        }
        .contact-value a:hover {
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          .contact-row {
            flex-direction: column;
            gap: 4px;
          }
          .contact-label {
            min-width: auto;
          }
        }
      `}</style>

      {/* Full-width Gradient Banner Box */}
      <div style={{
        background: 'linear-gradient(180deg, #3b82f6 0%, #eff6ff 100%)',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        width: '100%',
        marginTop: '8px',
      }}>
        <div className="policy-banner-inner">
          {/* Breadcrumbs inside the banner */}
          {!isAppMode && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, marginBottom: '16px' }}>
              <span>Home</span>
              <span style={{ color: '#1e293b', opacity: 0.6 }}>/</span>
              <span>Terms of Service</span>
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
            Terms of Service
          </h1>
          <p style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>
            Last Updated: June 9, 2026
          </p>
        </div>
      </div>

      <div className="policy-wrapper">
        
        {/* Center Content Column */}
        <div className="policy-content">
          <p style={{ color: '#334155', fontSize: '0.95rem', fontWeight: 700, marginBottom: '28px', lineHeight: '1.6' }}>
            This document is an electronic record in terms of the Information Technology Act, 2000, and rules made thereunder. This electronic record is generated by a computer system and does not require any physical or digital signatures.
          </p>

          {/* 1. Acceptance of Terms */}
          <div id="acceptance-terms" className="policy-section">
            <h2 style={h2Style}>1. Acceptance of Terms</h2>
            <p style={pStyle}>
              These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "Customer," or "Service Professional") and AMEC CODEX PRIVATE LIMITED (CIN: U62091MH2024PTC425971), a company incorporated under the Companies Act, 2013, operating under the brand name Dhoond.co ("Dhoond," "we," "us," or "our").
            </p>
            <p style={pStyle}>
              By accessing, registering, or using the Dhoond website, mobile applications, or any associated digital interfaces (collectively, the "Platform"), you explicitly consent to be bound by these Terms. Acceptance is executed via a click-wrap mechanism during account creation or booking. If you do not agree with any part of these Terms, you must immediately cease all use of the Platform. Your continued use of the Platform signifies your unconditional acceptance of these Terms and any future modifications. Dhoond reserves the absolute right to refuse access to the Platform to any individual or entity at its sole discretion.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 2. Definitions */}
          <div id="definitions" className="policy-section">
            <h2 style={h2Style}>2. Definitions</h2>
            <ul style={ulStyle}>
              <li style={liStyle}><strong>"Dhoond"</strong> refers to AMEC CODEX PRIVATE LIMITED and its digital marketplace brand, Dhoond.co.</li>
              <li style={liStyle}><strong>"Platform"</strong> encompasses the Dhoond.co website, mobile applications, and related technological infrastructure.</li>
              <li style={liStyle}><strong>"Services"</strong> denotes the specific physical tasks (e.g., AC repair, plumbing, painting) requested by Customers and performed by Service Professionals.</li>
              <li style={liStyle}><strong>"Service Professionals"</strong> (or "Partners") are independent, third-party contractors registered on the Platform to offer their skills and execute Services.</li>
              <li style={liStyle}><strong>"Customers"</strong> are end-users who access the Platform to discover and book Services.</li>
              <li style={liStyle}><strong>"Booking"</strong> refers to a confirmed request made by a Customer for Services via the Platform.</li>
              <li style={liStyle}><strong>"Charges"</strong> or "Fees" include the cost of the Service, platform facilitation fees, taxes, and any applicable surge pricing.</li>
              <li style={liStyle}><strong>"Account"</strong> means the digital profile created by a User upon registration.</li>
              <li style={liStyle}><strong>"User Content"</strong> includes text, reviews, ratings, images, and communications uploaded to the Platform by Users.</li>
              <li style={liStyle}><strong>"Prohibited Conduct"</strong> defines actions expressly forbidden on the Platform, including but not limited to circumvention, harassment, fraud, and intellectual property infringement.</li>
            </ul>
          </div>

          <div style={dividerStyle} />

          {/* 3. Marketplace Nature of the Platform & Liability Disclaimers */}
          <div id="marketplace-nature" className="policy-section">
            <h2 style={h2Style}>3. Marketplace Nature of the Platform & Liability Disclaimers</h2>
            <p style={pStyle}>
              Dhoond strictly operates as a technology marketplace. We provide a digital infrastructure to facilitate discovery, booking, communication, and payment processing between Customers and Service Professionals. Dhoond does not physically perform any Services.
            </p>
            <p style={pStyle}>
              The contract for the provision of Services is an independent, bilateral agreement formed exclusively between the Customer and the Service Professional. Dhoond is neither an employer, principal, joint employer, nor contractor in this relationship. Consequently, Dhoond holds no direct or indirect responsibility for the workmanship, quality, safety, delays, omissions, negligence, or misconduct of any Service Professional. The Platform acts merely as an intermediary bridging demand and supply.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 4. Regulatory Compliance: Consumer Protection (E-Commerce) Rules, 2020 */}
          <div id="regulatory-compliance" className="policy-section">
            <h2 style={h2Style}>4. Regulatory Compliance: Consumer Protection (E-Commerce) Rules, 2020</h2>
            <p style={pStyle}>
              In compliance with Indian law, Dhoond operates as a "Marketplace E-Commerce Entity." We adhere to all statutory obligations mandated for marketplace intermediaries.
            </p>
            <p style={pStyle}>
              <strong>Grievance Redressal:</strong> Dhoond maintains a robust mechanism for resolving consumer disputes. All complaints will be acknowledged within forty-eight (48) hours of receipt, with final redressal provided within one (1) month from the date of the complaint.
            </p>
            <p style={pStyle}>
              <strong>Law Enforcement Cooperation:</strong> In the event of a formal complaint regarding fraud, deficiency of service, or criminal activity, Dhoond pledges full cooperation with statutory and law enforcement agencies. We will provide all necessary verification details of Service Professionals to authorized authorities as required by the laws of India.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 5. Eligibility and User Accounts */}
          <div id="eligibility-accounts" className="policy-section">
            <h2 style={h2Style}>5. Eligibility and User Accounts</h2>
            <p style={pStyle}>
              Access to the Platform is restricted to individuals who are at least eighteen (18) years of age and capable of entering into legally binding contracts under the Indian Contract Act, 1872.
            </p>
            <p style={pStyle}>
              Users must provide accurate, current, and complete registration data. Account creation and login are secured via an OTP verification mechanism linked to the User's registered mobile number. You are solely responsible for maintaining the confidentiality of your Account credentials and for all activities executing under your Account. Dhoond reserves the unilateral right to suspend, disable, or terminate any Account without prior notice if we suspect fraud, identity theft, or a breach of these Terms.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 6. Customer Terms */}
          <div id="customer-terms" className="policy-section">
            <h2 style={h2Style}>6. Customer Terms</h2>
            <p style={pStyle}>
              Customers utilize the Platform to request specific Services, receive estimates, and schedule appointments.
            </p>
            <p style={pStyle}>
              As a Customer, you are obligated to provide a safe, hazard-free environment for the Service Professional to operate. You must ensure clear access to the premises and render reasonable cooperation required to complete the Service. Customers may submit reviews and ratings post-service; however, Dhoond prohibits the use of defamatory language, profanity, baseless allegations, or the submission of fake reviews. Violations will result in the immediate removal of the content and potential Account suspension.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 7. Partner / Service Professional Terms */}
          <div id="partner-terms" className="policy-section">
            <h2 style={h2Style}>7. Partner / Service Professional Terms</h2>
            <p style={pStyle}>
              Service Professionals utilize the Platform purely as independent contractors. Nothing in these Terms shall be construed to create an employer-employee relationship, partnership, or joint venture between Dhoond and the Partner.
            </p>
            <p style={pStyle}>
              Partners are obligated to execute Services with a high standard of professional conduct and in strict compliance with all applicable local, municipal, and national laws. Service Professionals must furnish accurate identity documentation, professional licenses, and certifications upon onboarding and must keep these records continuously updated.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 8. Background Verification Disclaimer */}
          <div id="background-verification" className="policy-section">
            <h2 style={h2Style}>8. Background Verification Disclaimer</h2>
            <p style={pStyle}>
              Dhoond employs a vetting process for Service Professionals, which includes identity and skill checks (utilizing documents such as Aadhaar, PAN, and relevant credentials) conducted via authorized, third-party verification vendors interacting with government-approved validation APIs.
            </p>
            <p style={pStyle}>
              Dhoond does not store raw biometric data or unmasked sensitive government identifiers on its servers. It must be explicitly understood that this background verification serves strictly as a risk mitigation tool. Dhoond makes no absolute warranties regarding the character of any Partner. Vetting does not constitute a permanent warranty, endorsement, or guarantee of a Service Professional's future conduct or flawless execution of Services.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 9. Booking, Pricing, and Payments */}
          <div id="booking-pricing" className="policy-section">
            <h2 style={h2Style}>9. Booking, Pricing, and Payments</h2>
            <p style={pStyle}>
              The total Charges displayed at checkout consist of the Service Professional's fees, Platform facilitation fees, and occasionally, dynamic/surge pricing based on high demand or adverse weather conditions.
            </p>
            <p style={pStyle}>
              <strong>Tax Compliance:</strong> The liability to remit Goods and Services Tax (GST) and other local levies on the physical execution of Services rests entirely with the Service Professional, except in specific categories (such as certain housekeeping or maintenance services) where Indian fiscal laws, specifically Section 9(5) of the CGST Act, strictly mandate Dhoond to collect and remit taxes as an e-commerce operator.
            </p>
            <p style={pStyle}>
              <strong>Doorstep & Cash Collection Rules:</strong> Customers may opt for Cash on Delivery (COD) or direct UPI transfers to the Service Professional's personal account upon service completion, provided this method is selected within the Platform. Any offline or doorstep cash transaction undertaken without Dhoond's explicit digital tracking and authorization operates entirely outside our purview. Dhoond holds zero tracking, dispute-resolution, or refund capabilities for unauthorized offline payments.
            </p>
            <p style={pStyle}>
              <strong>Settlements:</strong> Payment authorizations, failed transaction handling, and refund cycles are subject to the processing timelines of our third-party payment gateways and the banking network.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 10. Cancellation and Refund Policy */}
          <div id="cancellation-refund" className="policy-section">
            <h2 style={h2Style}>10. Cancellation and Refund Policy</h2>
            <p style={pStyle}>
              Dhoond enforces a structured cancellation matrix to protect the time and resources of both Users.
            </p>
            <p style={pStyle}>
              <strong>Customer Cancellations:</strong> Cancellations made more than 24 hours prior to the scheduled Service incur no penalty. Cancellations within 24 hours, post-dispatch, or post-arrival of the Service Professional will attract tiered cancellation fees, up to the minimum visitation charge.
            </p>
            <p style={pStyle}>
              <strong>Professional Cancellations:</strong> If a Partner cancels, Dhoond’s automated systems will attempt to seamlessly re-assign the Booking. In instances of Partner no-shows where alternative fulfillment is impossible, the Customer is entitled to a full refund of any pre-paid amounts, and the defaulting Partner will incur platform penalties.
            </p>
            <p style={pStyle}>
              <strong>Dhoond Cancellations:</strong> Dhoond reserves the right to cancel any Booking due to operational constraints, verified safety concerns, or Force Majeure events, issuing a full refund to the Customer where applicable.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 11. Property Damage & In-Home Safety Protocols */}
          <div id="property-damage" className="policy-section">
            <h2 style={h2Style}>11. Property Damage & In-Home Safety Protocols</h2>
            <p style={pStyle}>
              In the unlikely event of an in-home dispute, safety risk, or property damage, Users must immediately trigger the emergency escalation protocols via the Platform's help center.
            </p>
            <p style={pStyle}>
              For any claims regarding property damage or bodily injury to be considered under any third-party insurance coverage or damage mitigation policies facilitated by the Platform, the Customer must file a formal, documented claim within forty-eight (48) hours of the service completion. Claims submitted beyond this window, or lacking sufficient evidentiary support (such as photographs and service receipts), will be summarily rejected.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 12. Anti-Circumvention Clause */}
          <div id="anti-circumvention" className="policy-section">
            <h2 style={h2Style}>12. Anti-Circumvention Clause</h2>
            <p style={pStyle}>
              The Platform relies on its ability to connect demand with supply. Customers and Service Professionals are strictly prohibited from exchanging direct contact details with the intent to bypass the Platform, transact offline, or avoid Dhoond's commission and facilitation fees.
            </p>
            <p style={pStyle}>
              Any attempt to solicit offline business or circumvent the Platform will result in severe remedies, including but not limited to: immediate and permanent Account bans, the withholding of pending Partner payouts, forfeiture of platform wallet balances, and active recovery of liquidated damages via civil legal action.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 13. Safety and Zero-Tolerance Policy */}
          <div id="safety-policy" className="policy-section">
            <h2 style={h2Style}>13. Safety and Zero-Tolerance Policy</h2>
            <p style={pStyle}>
              Dhoond maintains an absolute zero-tolerance policy against harassment, physical or verbal abuse, threats, violence, discrimination, sexual misconduct, and the creation of hostile environments by either Customers or Service Professionals.
            </p>
            <p style={pStyle}>
              Dhoond retains the immediate, unilateral authority to investigate allegations, suspend involved Accounts pending review, and proactively report severe incidents to local law enforcement authorities.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 14. User Content and Reviews */}
          <div id="user-content" className="policy-section">
            <h2 style={h2Style}>14. User Content and Reviews</h2>
            <p style={pStyle}>
              By uploading User Content (including but not limited to text reviews, service photographs, and profile pictures), you grant Dhoond a worldwide, perpetual, irrevocable, royalty-free, transferable, and sub-licensable license to host, display, modify, analyze, and distribute said content across marketing channels and digital properties to promote and optimize the Platform.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 15. Intellectual Property Rights */}
          <div id="intellectual-property" className="policy-section">
            <h2 style={h2Style}>15. Intellectual Property Rights</h2>
            <p style={pStyle}>
              All intellectual property rights associated with the Platform—including Dhoond trademarks, logos, proprietary software, source code, UI/UX designs, databases, and business workflows—are the exclusive property of AMEC CODEX PRIVATE LIMITED.
            </p>
            <p style={pStyle}>
              Users are strictly prohibited from engaging in automated scraping, data mining, reverse engineering, decompiling, or the unauthorized mirroring of the Platform. Infringement will result in immediate legal prosecution.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 16. Third-Party Services */}
          <div id="third-party" className="policy-section">
            <h2 style={h2Style}>16. Third-Party Services</h2>
            <p style={pStyle}>
              The Platform integrates with third-party payment gateways, external mapping services, and verification vendors. Dhoond explicitly disclaims all liability for failures, data breaches, or inaccuracies arising from these external third-party services. Your interaction with third-party links and tools is governed by their respective independent terms and policies.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 17. Data Privacy Linkage */}
          <div id="data-privacy" className="policy-section">
            <h2 style={h2Style}>17. Data Privacy Linkage</h2>
            <p style={pStyle}>
              The collection, processing, storage, and sharing of personal data, location data, and communication logs are governed strictly by the Dhoond Privacy Policy. By utilizing the Platform, you consent to our data practices as outlined in the Privacy Policy, which is incorporated by reference into these Terms.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 18. Disclaimers & Limitation of Liability */}
          <div id="disclaimers-liability" className="policy-section">
            <h2 style={h2Style}>18. Disclaimers & Limitation of Liability</h2>
            <p style={pStyle}>
              The Platform and all facilitated Services are provided on an "as-is" and "as-available" basis. Dhoond disclaims all warranties, express or implied, regarding uninterrupted uptime, bug-free software, or the immediate availability of a Service Professional.
            </p>
            <p style={pStyle}>
              <strong>Liability Cap:</strong> To the maximum extent permitted by Indian law, Dhoond's aggregate liability arising from or relating to any Booking or use of the Platform shall not exceed the total amount actually paid by the Customer for the specific Booking giving rise to the claim, or INR 5,000 (Five Thousand Indian Rupees), whichever is strictly lower.
            </p>
            <p style={pStyle}>
              Dhoond completely excludes all liability for indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, loss of data, or business interruption, regardless of whether Dhoond was advised of the possibility of such damages.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 19. Indemnification */}
          <div id="indemnification" className="policy-section">
            <h2 style={h2Style}>19. Indemnification</h2>
            <p style={pStyle}>
              You agree to indemnify, defend, and hold harmless Dhoond, its parent company (AMEC CODEX PRIVATE LIMITED), directors, officers, employees, and agents from and against any and all claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or connected with: (a) your breach of these Terms; (b) your misuse of the Platform; (c) your violation of any statutory law or regulation; or (d) your infringement of any third-party rights, including intellectual property or privacy rights.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 20. Suspension and Termination */}
          <div id="suspension-termination" className="policy-section">
            <h2 style={h2Style}>20. Suspension and Termination</h2>
            <p style={pStyle}>
              Dhoond may, at its sole discretion, suspend or terminate your Account and restrict your access to the Platform at any time, without prior notice, for reasons including but not limited to: confirmed fraud, material misrepresentation, sustained low star-ratings, verified safety concerns, violation of the Anti-Circumvention Clause, or any broader breach of these Terms.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 21. Governing Law and Arbitration */}
          <div id="governing-law" className="policy-section">
            <h2 style={h2Style}>21. Governing Law and Arbitration</h2>
            <p style={pStyle}>
              <strong>Governing Law:</strong> These Terms shall be exclusively governed by and construed in accordance with the laws of the Republic of India.
            </p>
            <p style={pStyle}>
              <strong>Jurisdiction:</strong> Subject to the arbitration clause below, the courts located in Nagpur, Maharashtra, shall have exclusive jurisdiction over any disputes.
            </p>
            <p style={pStyle}>
              <strong>Mandatory Arbitration:</strong> Any dispute, controversy, or claim arising out of or relating to these Terms, or the breach thereof, must be settled via binding arbitration in accordance with the Arbitration and Conciliation Act, 1996. The arbitration shall be conducted by a single, neutral arbitrator appointed by mutual consent of the parties or as otherwise provided by applicable law. The seat and venue of the arbitration shall be Nagpur, Maharashtra. The language of the arbitration proceedings shall be English.
            </p>
          </div>

          <div style={dividerStyle} />

          {/* 22. Grievance Officer */}
          <div id="grievance-officer" className="policy-section">
            <h2 style={h2Style}>22. Grievance Officer</h2>
            <p style={pStyle}>
              In accordance with the Information Technology Act, 2000, and the Consumer Protection (E-Commerce) Rules, 2020, the contact details of the Grievance Officer are provided below:
            </p>

            <div className="contact-card-container">
              <p style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', marginBottom: '1rem' }}>
                Grievance Officer, Dhoond
              </p>
              <div>
                <div className="contact-row">
                  <span className="contact-label">Email Address:</span>
                  <span className="contact-value">
                    <a href="mailto:grievances@dhoond.co">grievances@dhoond.co</a>
                  </span>
                </div>
                <div className="contact-row">
                  <span className="contact-label">Office Address:</span>
                  <span className="contact-value">
                    AMEC CODEX PRIVATE LIMITED, Nagpur, Maharashtra, India.
                  </span>
                </div>
                <div className="contact-row">
                  <span className="contact-label">Response Timelines:</span>
                  <span className="contact-value">
                    Acknowledgment within 48 hours; resolution within 30 days.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={dividerStyle} />

          {/* 23. Force Majeure & Miscellaneous */}
          <div id="force-majeure" className="policy-section" style={{ marginBottom: 0 }}>
            <h2 style={h2Style}>23. Force Majeure & Miscellaneous</h2>
            <p style={pStyle}>
              <strong>Force Majeure:</strong> Dhoond shall not be held liable for any failure or delay in performance resulting from circumstances beyond our reasonable control, including natural disasters, acts of God, epidemics, pandemics, government orders, strikes, or catastrophic telecommunication/cyber infrastructure failures.
            </p>
            <p style={pStyle}>
              <strong>Severability:</strong> If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force, effect, and enforceability.
            </p>
            <p style={pStyle}>
              <strong>Non-Waiver:</strong> Dhoond's failure to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision.
            </p>
            <p style={pStyle}>
              <strong>Assignment:</strong> You may not assign or transfer your rights under these Terms without Dhoond's prior written consent. Dhoond may freely assign its rights and obligations under these Terms.
            </p>
            <p style={pStyle}>
              <strong>Amendments:</strong> Dhoond retains the unilateral right to update or modify these Terms at any time via Platform updates. Continued use of the Platform following such modifications constitutes your acceptance of the revised Terms.
            </p>
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

export default TermsOfService;
