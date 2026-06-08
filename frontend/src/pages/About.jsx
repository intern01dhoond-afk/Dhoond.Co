import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, Paintbrush, Zap, Wrench, Shield, Check, Heart, HelpCircle, 
  MapPin, Star, Users, Building, Hammer, ChevronRight, Play, Quote 
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { useUI } from '../context/UIContext';

// Import images
import heroGroupImg from '../assets/about us/screen.png';
import storyImg from '../assets/about us/screen 1.png';
import acTechImg from '../assets/about us/a_professional_and_warm_photograph_of_a_male_service_technician_electrician.png';

const About = () => {
  useSEO({
    title: "About Us — Dhoond.co",
    description: "Learn more about Dhoond, India's most trusted on-demand service ecosystem connecting customers with verified professional service partners.",
    canonicalPath: "/about"
  });

  const { openComingSoon } = useUI();

  return (
    <div className="about-page" style={{ background: '#ffffff', color: '#1e293b', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      
      <style>{`
        /* ── CUSTOM STYLE SHEET FOR PIXEL PERFECT DESIGN ── */
        .about-hero-section {
          position: relative;
          padding: 80px 5% 60px;
          background: radial-gradient(circle at top right, rgba(239, 246, 255, 0.7), transparent 60%), #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1400px;
          margin: 0 auto;
          gap: 40px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          background: #2563eb;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 99px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .hero-title {
          font-size: clamp(2.25rem, 5vw, 3.75rem);
          font-weight: 900;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
          font-family: 'Outfit', 'Inter', sans-serif;
        }

        .hero-desc {
          font-size: 1.05rem;
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 32px;
          max-width: 540px;
        }

        .btn-primary {
          background: #0a57d0;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 14px 28px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(10, 87, 208, 0.25);
          text-decoration: none;
        }

        .btn-primary:hover {
          background: #0045b5;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(10, 87, 208, 0.35);
        }

        .hero-image-wrapper {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          position: relative;
        }

        .hero-img {
          width: 100%;
          max-width: 580px;
          height: auto;
          object-fit: cover;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
        }

        /* ── SECTION: MISSION & STATS ── */
        .mission-stats-section {
          padding: 60px 5%;
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          gap: 40px;
        }

        .mission-card {
          flex: 1;
          background: #ffffff;
          border: 1px solid #f1f5f9;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
        }

        .mission-icon-box {
          width: 48px;
          height: 48px;
          background: #dbfbf0;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .stats-grid {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .stat-card {
          background: #f1f5f9;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-num {
          font-size: 2rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }

        .stat-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          line-height: 1.4;
        }

        /* ── SECTION: OUR STORY ── */
        .story-section {
          padding: 60px 5%;
          background: #fafbfc;
        }

        .story-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 60px;
        }

        .story-img-card {
          flex: 1;
          background: #ffffff;
          border: 1px solid #f1f5f9;
          border-radius: 24px;
          padding: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
        }

        .story-img {
          width: 100%;
          border-radius: 16px;
          display: block;
          margin-bottom: 16px;
        }

        .story-caption {
          font-size: 0.88rem;
          font-weight: 700;
          color: #2563eb;
          text-align: center;
          font-style: italic;
        }

        .story-content {
          flex: 1.2;
        }

        .section-tag {
          font-size: 0.78rem;
          font-weight: 800;
          color: #2563eb;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
          display: block;
        }

        .section-title {
          font-size: 2.25rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }

        .story-text {
          font-size: 0.98rem;
          color: #475569;
          line-height: 1.8;
          margin-bottom: 16px;
        }

        /* ── SECTION: WHAT WE DO ── */
        .wwd-section {
          padding: 80px 5%;
          max-width: 1400px;
          margin: 0 auto;
          text-align: center;
        }

        .wwd-header {
          max-width: 620px;
          margin: 0 auto 50px;
        }

        .wwd-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .wwd-card {
          background: #ffffff;
          border: 1px solid #f1f5f9;
          border-radius: 20px;
          padding: 30px 24px;
          text-align: left;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
          box-shadow: 0 4px 10px rgba(0,0,0,0.01);
        }

        .wwd-card:hover {
          border-color: #e2e8f0;
          box-shadow: 0 12px 28px rgba(0,0,0,0.04);
          transform: translateY(-4px);
        }

        .wwd-icon-box {
          width: 44px;
          height: 44px;
          background: #f1f5f9;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          color: #0a57d0;
        }

        .wwd-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .wwd-desc {
          font-size: 0.88rem;
          color: #64748b;
          line-height: 1.5;
        }

        .wwd-image-card {
          border-radius: 20px;
          overflow: hidden;
          padding: 0;
          border: none;
          box-shadow: none;
          height: 100%;
        }

        .wwd-image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* ── SECTION: EMPOWERING PROFESSIONALS ── */
        .empower-section {
          padding: 60px 5%;
          background: #ffffff;
        }

        .empower-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.05);
        }

        .empower-left {
          flex: 1.1;
          background: #004bc7; /* Rich blue matching design */
          color: #ffffff;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .empower-title {
          font-size: 2.25rem;
          font-weight: 900;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .empower-sub {
          font-size: 1rem;
          opacity: 0.85;
          line-height: 1.6;
          margin-bottom: 36px;
        }

        .empower-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .empower-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .empower-check {
          background: rgba(255,255,255,0.15);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .empower-item-title {
          font-weight: 800;
          font-size: 0.98rem;
          margin-bottom: 4px;
        }

        .empower-item-desc {
          font-size: 0.88rem;
          opacity: 0.8;
          line-height: 1.4;
        }

        .empower-right {
          flex: 1;
        }

        .empower-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* ── SECTION: VISION & MISSION ROW ── */
        .vm-section {
          padding: 60px 5%;
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          gap: 60px;
        }

        .vision-box {
          flex: 1;
          border-left: 3px solid #2563eb;
          padding-left: 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .vision-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 20px;
        }

        .vision-quote {
          font-size: 1.35rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.5;
          font-style: italic;
        }

        .mission-list-box {
          flex: 1.2;
        }

        .mission-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 24px;
        }

        .m-list-item {
          display: flex;
          gap: 16px;
          margin-bottom: 18px;
          align-items: flex-start;
        }

        .m-num {
          font-size: 0.88rem;
          font-weight: 800;
          color: #2563eb;
          margin-top: 2px;
        }

        .m-text {
          font-size: 0.98rem;
          color: #475569;
          font-weight: 600;
          line-height: 1.5;
        }

        /* ── SECTION: WHY CHOOSE DHOOND ── */
        .choose-section {
          padding: 60px 5% 80px;
          max-width: 1400px;
          margin: 0 auto;
          text-align: center;
        }

        .choose-title {
          font-size: 2rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 48px;
        }

        .choose-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }

        .choose-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .choose-icon-box {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 1.5px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          color: #0a57d0;
          transition: all 0.25s ease;
        }

        .choose-card:hover .choose-icon-box {
          border-color: #2563eb;
          background: #eff6ff;
          transform: scale(1.05);
        }

        .choose-label {
          font-weight: 800;
          font-size: 0.95rem;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .choose-sub {
          font-size: 0.78rem;
          color: #64748b;
          font-weight: 600;
          line-height: 1.4;
        }

        /* ── SECTION: CORE VALUES (DARK BG) ── */
        .values-section {
          background: #111827; /* Dark background matching mockup */
          color: #ffffff;
          padding: 60px 5%;
        }

        .values-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .values-title {
          text-align: center;
          font-size: 2rem;
          font-weight: 900;
          margin-bottom: 48px;
          letter-spacing: -0.01em;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 32px;
        }

        .value-col {
          display: flex;
          flex-direction: column;
        }

        .value-header {
          font-size: 1.05rem;
          font-weight: 800;
          margin-bottom: 12px;
          position: relative;
          padding-bottom: 12px;
          color: #ffffff;
        }

        .value-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 28px;
          height: 2px;
          background: #2563eb;
        }

        .value-desc {
          font-size: 0.85rem;
          color: #9ca3af;
          line-height: 1.6;
          font-weight: 500;
        }

        /* ── RESPONSIVE ADAPTATIONS ── */
        @media (max-width: 1024px) {
          .about-hero-section {
            flex-direction: column;
            text-align: center;
            padding: 60px 5% 40px;
          }
          .hero-desc {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-image-wrapper {
            justify-content: center;
          }
          .mission-stats-section {
            flex-direction: column;
          }
          .story-container {
            flex-direction: column;
            gap: 40px;
          }
          .wwd-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .empower-container {
            flex-direction: column;
          }
          .empower-left {
            padding: 40px;
          }
          .vm-section {
            flex-direction: column;
            gap: 40px;
          }
          .choose-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
          }
          .values-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .wwd-grid {
            grid-template-columns: 1fr;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .choose-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .values-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* 1. HERO SECTION */}
      <section className="about-hero-section">
        <div style={{ flex: 1.2, textAlign: 'left' }}>
          <span className="hero-badge">About Dhoond</span>
          <h1 className="hero-title">
            Building India's Most<br />
            Trusted On-Demand<br />
            Service Ecosystem
          </h1>
          <p className="hero-desc">
            Dhoond is a technology-driven platform connecting customers with verified professionals for home, commercial, and business services. Our goal is simple — make quality services accessible, reliable, and available whenever they are needed.
          </p>
          <Link to="/" className="btn-primary">
            Explore Services <ChevronRight size={16} strokeWidth={3} />
          </Link>
        </div>
        <div className="hero-image-wrapper">
          <img src={heroGroupImg} alt="Dhoond Team" className="hero-img" />
        </div>
      </section>

      {/* 2. MISSION & STATS */}
      <section className="mission-stats-section">
        <div className="mission-card">
          <div className="mission-icon-box">
            <Rocket size={20} color="#00b074" />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', marginBottom: '16px' }}>Our Mission</h2>
          <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
            We are transforming the way people discover, book, and manage professional services by creating a seamless ecosystem that benefits both customers and service partners. Through technology, transparency, and trust, Dhoond bridges the gap between demand and skilled professionals, elevating local service delivery and providing better customer experiences.
          </p>
        </div>
        <div className="stats-grid">
          {[
            { num: "500k+", label: "Services Delivered" },
            { num: "25k+", label: "Verified Experts" },
            { num: "150+", label: "Cities Reached" },
            { num: "4.9+", label: "Customer Rating" }
          ].map((stat, idx) => (
            <div key={idx} className="stat-card">
              <span className="stat-num">{stat.num}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. OUR STORY */}
      <section className="story-section">
        <div className="story-container">
          <div className="story-img-card">
            <img src={storyImg} alt="Technician with Customer" className="story-img" />
            <div className="story-caption">
              "Bridging the gap between demand and skilled professionals."
            </div>
          </div>
          <div className="story-content">
            <span className="section-tag">Dhoond History</span>
            <h2 className="section-title">Our Story</h2>
            <p className="story-text">
              Dhoond was founded with a vision to solve one of the most common challenges faced by individuals and businesses — finding trustworthy professionals quickly and efficiently.
            </p>
            <p className="story-text">
              Traditional service discovery often involves uncertainty, delays, inconsistent quality, and limited accountability. Dhoond was built to change that by establishing a standardized, technology-first approach to on-demand services.
            </p>
          </div>
        </div>
      </section>

      {/* 4. WHAT WE DO */}
      <section className="wwd-section">
        <div className="wwd-header">
          <span className="section-tag">Offerings</span>
          <h2 className="section-title">What We Do</h2>
          <p style={{ color: '#64748b', fontSize: '0.98rem', lineHeight: 1.6, margin: 0 }}>
            Dhoond offers a comprehensive range of home and commercial services through a single digital platform.
          </p>
        </div>
        <div className="wwd-grid">
          <div className="wwd-card">
            <div className="wwd-icon-box"><Paintbrush size={20} /></div>
            <h3 className="wwd-title">Professional Painting</h3>
            <p className="wwd-desc">Premium interior & exterior painting with precision.</p>
          </div>
          <div className="wwd-card">
            <div className="wwd-icon-box"><Zap size={20} /></div>
            <h3 className="wwd-title">Electrical Services</h3>
            <p className="wwd-desc">Certified electricians for installations and repairs.</p>
          </div>
          <div className="wwd-card">
            <div className="wwd-icon-box"><Wrench size={20} /></div>
            <h3 className="wwd-title">AC & Appliances</h3>
            <p className="wwd-desc">Complete maintenance for cooling systems and household appliances.</p>
          </div>
          <div className="wwd-card">
            <div className="wwd-icon-box"><HelpCircle size={20} /></div>
            <h3 className="wwd-title">Plumbing Services</h3>
            <p className="wwd-desc">Expert leak repairs and pipe installations.</p>
          </div>
          <div className="wwd-card">
            <div className="wwd-icon-box"><Hammer size={20} /></div>
            <h3 className="wwd-title">Carpentry Solutions</h3>
            <p className="wwd-desc">Custom furniture and wood repair services.</p>
          </div>
          <div className="wwd-card">
            <div className="wwd-icon-box"><Building size={20} /></div>
            <h3 className="wwd-title">Commercial Maint.</h3>
            <p className="wwd-desc">End-to-end facilities management for businesses.</p>
          </div>
          <div className="wwd-card wwd-image-card">
            <img src={acTechImg} alt="AC Technician" />
          </div>
          <div className="wwd-card">
            <div className="wwd-icon-box"><Users size={20} /></div>
            <h3 className="wwd-title">Technical Support</h3>
            <p className="wwd-desc">On-demand tech help for home and office.</p>
          </div>
        </div>
      </section>

      {/* 5. EMPOWERING SERVICE PROFESSIONALS */}
      <section className="empower-section">
        <div className="empower-container">
          <div className="empower-left">
            <h2 className="empower-title">Empowering Service Professionals</h2>
            <p className="empower-sub">
              Our Partner Platform empowers technicians, painters, delivery associates, and service experts to grow their careers with dignity and technology.
            </p>
            <div className="empower-list">
              <div className="empower-item">
                <div className="empower-check"><Check size={14} strokeWidth={3} /></div>
                <div>
                  <h4 className="empower-item-title">Verified Work Opportunities</h4>
                  <p className="empower-item-desc">Consistent job flow from a trusted platform.</p>
                </div>
              </div>
              <div className="empower-item">
                <div className="empower-check"><Check size={14} strokeWidth={3} /></div>
                <div>
                  <h4 className="empower-item-title">Transparent Earnings</h4>
                  <p className="empower-item-desc">Real-time tracking of payments and incentives.</p>
                </div>
              </div>
              <div className="empower-item">
                <div className="empower-check"><Check size={14} strokeWidth={3} /></div>
                <div>
                  <h4 className="empower-item-title">Training & Development</h4>
                  <p className="empower-item-desc">Continuous skill upgradation and certifications.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="empower-right">
            <img src={storyImg} alt="Empowering Professionals" className="empower-img" />
          </div>
        </div>
      </section>

      {/* 6. VISION & MISSION STATEMENT ROW */}
      <section className="vm-section">
        <div className="vision-box">
          <h3 className="vision-title">Our Vision</h3>
          <p className="vision-quote">
            "To become India's most trusted and innovative service marketplace that empowers millions of customers and service professionals through technology."
          </p>
        </div>
        <div className="mission-list-box">
          <h3 className="mission-title">Our Mission</h3>
          {[
            { num: "01", text: "Deliver reliable services with speed and transparency." },
            { num: "02", text: "Empower skilled professionals with earning opportunities." },
            { num: "03", text: "Create a trusted ecosystem built on quality and accountability." },
            { num: "04", text: "Use technology to simplify service discovery and management." },
            { num: "05", text: "Continuously innovate to improve customer and partner experiences." }
          ].map((item, idx) => (
            <div key={idx} className="m-list-item">
              <span className="m-num">{item.num}.</span>
              <span className="m-text">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. WHY CHOOSE DHOOND */}
      <section className="choose-section">
        <h2 className="choose-title">Why Choose Dhoond?</h2>
        <div className="choose-grid">
          {[
            { icon: <Shield size={24} />, label: "Trusted Vetting", sub: "Verification & Assessment" },
            { icon: <Rocket size={24} />, label: "Seamless", sub: "Book, track & manage" },
            { icon: <Star size={24} />, label: "Quality", sub: "Continuous monitoring" },
            { icon: <Users size={24} />, label: "Transparent", sub: "No hidden charges" },
            { icon: <Heart size={24} />, label: "Satisfaction", sub: "Customer-centric heart" }
          ].map((item, idx) => (
            <div key={idx} className="choose-card">
              <div className="choose-icon-box">{item.icon}</div>
              <span className="choose-label">{item.label}</span>
              <span className="choose-sub">{item.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CORE VALUES */}
      <section className="values-section">
        <div className="values-container">
          <h2 className="values-title">Core Values</h2>
          <div className="values-grid">
            {[
              { title: "Trust", desc: "Building lasting relationships through honesty." },
              { title: "Excellence", desc: "Striving for the highest quality in every task." },
              { title: "Innovation", desc: "Using tech to redefine the service industry." },
              { title: "Empowerment", desc: "Giving partners the tools to succeed." },
              { title: "Reliability", desc: "Being there exactly when you need us." }
            ].map((val, idx) => (
              <div key={idx} className="value-col">
                <h3 className="value-header">{val.title}</h3>
                <p className="value-desc">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
