import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { useUI } from '../context/UIContext';
import { isInsideGeofence } from '../utils/location';
import './About.css';

// Import local images from the assets/about us folder (already migrated to webp)
import heroImg from '../assets/about us/screen.webp';
import storyImg from '../assets/about us/screen 1.webp';
import techImg from '../assets/about us/a_professional_and_warm_photograph_of_a_male_service_technician_electrician.webp';

const About = () => {
  useSEO({
    title: "About Us | Dhoond - Building India's Most Trusted Service Ecosystem",
    description: "Dhoond is a technology-driven platform connecting customers with verified professionals for home, commercial, and business services.",
    canonicalPath: "/about"
  });

  const { openComingSoon, locationLabel, locationSubtext, userLat, userLng } = useUI();
  const navigate = useNavigate();

  const isBengaluru = (locationLabel || '').toLowerCase().includes('bengaluru') || 
                      (locationLabel || '').toLowerCase().includes('bangalore') ||
                      (locationSubtext || '').toLowerCase().includes('bengaluru') ||
                      (locationSubtext || '').toLowerCase().includes('bangalore');

  const isNagpur = isInsideGeofence(userLat, userLng, 21.1497877, 79.0806859, 8000) || 
                    (locationLabel || '').toLowerCase().includes('nagpur') ||
                    (locationSubtext || '').toLowerCase().includes('nagpur');

  useEffect(() => {
    // Inject Google Fonts link for Plus Jakarta Sans statically if not present
    let fontsLink = document.getElementById("dynamic-fonts-about");
    if (!fontsLink) {
      fontsLink = document.createElement('link');
      fontsLink.id = "dynamic-fonts-about";
      fontsLink.rel = 'stylesheet';
      fontsLink.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap';
      document.head.appendChild(fontsLink);
    }

    // Inject Material Symbols link for icons
    let symbolsLink = document.getElementById("dynamic-symbols-about");
    if (!symbolsLink) {
      symbolsLink = document.createElement('link');
      symbolsLink.id = "dynamic-symbols-about";
      symbolsLink.rel = 'stylesheet';
      symbolsLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
      document.head.appendChild(symbolsLink);
    }
  }, []);

  return (
    <div className="about-container">
      <main>
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-bg">
            <img 
              src={heroImg} 
              alt="Dhoond Service Professionals" 
            />
          </div>
          <div className="about-hero-overlay"></div>
          
          <div className="about-hero-content">
            <span className="about-hero-badge">
              About Dhoond
            </span>
            <h1 className="about-hero-title">
              Building India's Most Trusted On-Demand Service Ecosystem
            </h1>
            <p className="about-hero-subtitle">
              Dhoond is a technology-driven platform connecting customers with verified professionals for home, commercial, and business services. Our goal is simple — make quality services accessible, reliable, and available whenever they are needed.
            </p>
            <button 
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.querySelector('#services-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="about-hero-btn"
            >
              Explore Services
            </button>
          </div>
        </section>

        {/* Mission & Stats */}
        <section className="about-section">
          <div className="about-mission-grid">
            <div className="about-mission-card">
              <div className="about-mission-icon">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 500" }}>rocket_launch</span>
              </div>
              <h2 className="about-mission-title">Our Mission</h2>
              <p className="about-mission-text">
                We are transforming the way people discover, book, and manage professional services by creating a seamless ecosystem that benefits both customers and service partners. Through technology, transparency, and trust, Dhoond bridges the gap between demand and skilled professionals, enabling faster service delivery and better customer experiences.
              </p>
            </div>

            <div className="about-stats-grid">
              {[
                { label: 'SERVICES DELIVERED', value: '1.25L+', colorClass: 'blue' },
                { label: 'VERIFIED EXPERTS', value: '500+', colorClass: 'green' },
                { label: 'CITIES SERVED', value: '2', colorClass: 'blue' },
                { label: 'CUSTOMER RATING', value: '4.9★', colorClass: 'dark' }
              ].map((stat, idx) => (
                <div key={idx} className="about-stat-card">
                  <div className={`about-stat-value ${stat.colorClass}`}>{stat.value}</div>
                  <div className="about-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="about-story-section">
          <div className="about-story-grid">
            <div className="about-story-img-wrap">
              <img 
                src={techImg} 
                alt="Technician interacting with customer" 
                className="about-story-img"
              />
              <div className="about-story-quote">
                <p className="about-story-quote-text">
                  “Bridging the gap between demand and skilled professionals.”
                </p>
              </div>
            </div>
            <div className="about-story-content">
              <h2 className="about-story-title">Our Story</h2>
              <p className="about-story-text">
                Dhoond was founded with a vision to solve one of the most common challenges faced by individuals and businesses — finding trustworthy professionals quickly and efficiently.
              </p>
              <p className="about-story-text">
                Traditional service discovery often involves uncertainty, delays, inconsistent quality, and limited accountability. Dhoond was built to change that by establishing a standardized, technology-first approach to on-demand services.
              </p>
            </div>
          </div>
        </section>

        {/* What We Do - Service Grid */}
        <section className="about-what-we-do-section">
          <div className="container">
            <div className="section-header">
              <h2>What We Do</h2>
              <p>
                Dhoond offers a comprehensive range of home and commercial services through a single digital platform.
              </p>
            </div>
            
            <div className="about-services-grid">
              {[
                { name: 'Painting', icon: 'brush', path: '/painting' },
                { name: 'AC Service', icon: 'ac_unit', path: '/shop?cat=technician&subcat=ac' },
                { name: 'RO Service', icon: 'water_drop', path: '/shop?cat=technician&subcat=ro' },
                { name: 'Electrician', icon: 'bolt', path: '/shop?cat=electrician' },
                { name: 'Washing Machine Repair', icon: 'local_laundry_service', path: '/shop?cat=technician&subcat=washing' },
                { name: 'Refrigerator Repair', icon: 'kitchen', path: '/' }
              ].map((service, idx) => {
                const isAvailable = service.name === 'Painting' ? isBengaluru : (service.name === 'Refrigerator Repair' ? false : isNagpur);
                return (
                  <div 
                    key={idx} 
                    onClick={() => {
                      if (!isAvailable) {
                        openComingSoon();
                      } else {
                        navigate(service.path);
                      }
                    }}
                    className={`about-service-card ${!isAvailable ? 'coming-soon' : ''}`}
                  >
                    <div className="about-service-icon-wrap">
                      <span className="material-symbols-outlined">{service.icon}</span>
                    </div>
                    <h3 className="about-service-title">{service.name}</h3>
                    <span className={`about-service-availability ${isAvailable ? 'active' : 'soon'}`}>
                      {isAvailable ? 'AVAILABLE NOW' : 'COMING SOON'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Empowering Professionals Section */}
        <section className="about-section">
          <div className="about-empower-banner">
            <div className="about-empower-content">
              <h2 className="about-empower-title">Empowering Service Professionals</h2>
              <p className="about-empower-sub">
                Our Partner Platform empowers technicians, electricians, painters, delivery associates, and service experts to grow their careers with dignity and technology.
              </p>
              <ul className="about-empower-list">
                {[
                  { title: 'Verified Work Opportunities', desc: 'Consistent job flow from a trusted platform.' },
                  { title: 'Transparent Earnings', desc: 'Real-time tracking of payments and incentives.' },
                  { title: 'Training & Development', desc: 'Continuous skill up-gradation and certifications.' }
                ].map((item, idx) => (
                  <li key={idx} className="about-empower-item">
                    <div className="about-empower-icon-wrap">
                      <svg className="about-empower-icon-svg" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="about-empower-item-content">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="about-empower-img-wrap">
              <img 
                src={storyImg} 
                alt="Empowered Professionals" 
                className="about-empower-img"
              />
            </div>
          </div>
        </section>

        {/* Our Vision & Mission Text */}
        <section className="about-section">
          <div className="about-vision-section">
            <div className="about-vision-block">
              <h2 className="about-vision-title">Our Vision</h2>
              <p className="about-vision-quote">
                "To become India's most trusted and innovative service marketplace that empowers millions of customers and service professionals through technology."
              </p>
            </div>
            <div className="about-mission-block">
              <h2 className="about-mission-block-title">Our Mission</h2>
              <ul className="about-mission-list">
                {[
                  "Deliver reliable services with speed and transparency.",
                  "Empower skilled professionals with earning opportunities.",
                  "Create a trusted ecosystem built on quality and accountability.",
                  "Use technology to simplify service discovery and management.",
                  "Continuously innovate to improve customer and partner experiences."
                ].map((text, idx) => (
                  <li key={idx} className="about-mission-list-item">
                    <span className="about-mission-item-num">0{idx + 1}.</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Why Choose Dhoond */}
        <section className="about-why-section">
          <div className="about-why-section-inner">
            <h2 className="about-why-title">Why Choose Dhoond?</h2>
            <div className="about-why-grid">
              {[
                { label: 'Trusted Pros', icon: 'verified_user', sub: 'Verification & Assessment' },
                { label: 'Seamless', icon: 'touch_app', sub: 'Book, track & manage' },
                { label: 'Quality', icon: 'high_quality', sub: 'Continuous monitoring' },
                { label: 'Transparent', icon: 'payments', sub: 'No hidden charges' },
                { label: 'Satisfaction', icon: 'favorite', sub: 'Customer-centric heart' }
              ].map((item, idx) => (
                <div key={idx} className="about-why-item">
                  <div className="about-why-icon-wrap">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {item.icon}
                    </span>
                  </div>
                  <h4 className="about-why-label">{item.label}</h4>
                  <p className="about-why-sub">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="about-values-section">
          <div className="about-values-section-inner">
            <h2 className="about-values-title">Core Values</h2>
            <div className="about-values-grid">
              {[
                { title: 'Trust', desc: 'Building lasting relationships through honesty.' },
                { title: 'Excellence', desc: 'Striving for the highest quality in every task.' },
                { title: 'Innovation', desc: 'Using tech to redefine the service industry.' },
                { title: 'Empowerment', desc: 'Giving partners the tools to succeed.' },
                { title: 'Reliability', desc: 'Being there exactly when you need us.' }
              ].map((value, idx) => (
                <div key={idx} className="about-value-card">
                  <div className="about-value-bar"></div>
                  <h4 className="about-value-title">{value.title}</h4>
                  <p className="about-value-desc">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
