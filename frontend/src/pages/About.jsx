import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { useUI } from '../context/UIContext';
import { isInsideGeofence } from '../utils/location';

// Import local images from the assets/about us folder
import heroImg from '../assets/about us/screen.png';
import storyImg from '../assets/about us/screen 1.png';
import techImg from '../assets/about us/a_professional_and_warm_photograph_of_a_male_service_technician_electrician.png';

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
    // 1. Define Tailwind config on window object BEFORE loading the script
    window.tailwind = {
      config: {
        corePlugins: {
          preflight: false,
        },
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
              "primary": "#003d9b",
              "on-primary": "#ffffff",
              "secondary": "#006b55",
              "secondary-container": "#6dfad2",
              "outline-variant": "#c3c6d6",
              "primary-container": "#0052cc",
              "secondary-fixed": "#6dfad2",
              "outline": "#737685",
              "error": "#ba1a1a",
              "on-primary-fixed-variant": "#0040a2",
              "on-primary-container": "#c4d2ff",
              "surface-dim": "#dadadc",
              "surface": "#f9f9fc",
              "error-container": "#ffdad6",
              "surface-variant": "#e2e2e5",
              "on-secondary-fixed-variant": "#005140",
              "on-tertiary": "#ffffff",
              "on-error-container": "#93000a",
              "inverse-on-surface": "#f0f0f3",
              "on-secondary-fixed": "#002018",
              "primary-fixed": "#dae2ff",
              "on-tertiary-fixed-variant": "#2f2ebe",
              "on-primary-fixed": "#001848",
              "surface-container": "#eeeef0",
              "tertiary-container": "#4547d3",
              "on-secondary": "#ffffff",
              "tertiary": "#2b29bb",
              "tertiary-fixed-dim": "#c0c1ff",
              "surface-container-low": "#f3f3f6",
              "on-secondary-container": "#00725b",
              "on-tertiary-fixed": "#07006c",
              "surface-container-high": "#e8e8ea",
              "tertiary-fixed": "#e1e0ff",
              "on-surface-variant": "#434654",
              "on-background": "#1a1c1e",
              "surface-bright": "#f9f9fc",
              "primary-fixed-dim": "#b2c5ff",
              "surface-container-lowest": "#ffffff",
              "inverse-surface": "#2f3133",
              "background": "#f9f9fc",
              "secondary-fixed-dim": "#4bddb7",
              "on-error": "#ffffff",
              "surface-tint": "#0c56d0",
              "on-surface": "#1a1c1e",
              "inverse-primary": "#b2c5ff",
              "on-tertiary-container": "#d0cfff",
              "surface-container-highest": "#e2e2e5"
            },
            "borderRadius": {
              "DEFAULT": "0.25rem",
              "lg": "0.5rem",
              "xl": "0.75rem",
              "full": "9999px"
            },
            "spacing": {
              "margin-desktop": "64px",
              "gutter": "24px",
              "margin-mobile": "16px",
              "xl": "32px",
              "md": "16px",
              "sm": "12px",
              "lg": "24px",
              "base": "8px",
              "xs": "4px"
            },
            "fontFamily": {
              "sans": ["Plus Jakarta Sans", "Inter", "sans-serif"],
              "body-lg": ["Inter"],
              "headline-md": ["Plus Jakarta Sans"],
              "body-md": ["Inter"],
              "label-sm": ["Inter"],
              "body-sm": ["Inter"],
              "label-md": ["Inter"],
              "headline-xl": ["Plus Jakarta Sans"],
              "headline-lg": ["Plus Jakarta Sans"],
              "headline-lg-mobile": ["Plus Jakarta Sans"]
            },
            "fontSize": {
              "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
              "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
              "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
              "label-sm": ["12px", { "lineHeight": "14px", "letterSpacing": "0.02em", "fontWeight": "500" }],
              "body-sm": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
              "label-md": ["14px", { "lineHeight": "16px", "letterSpacing": "0.01em", "fontWeight": "600" }],
              "headline-xl": ["40px", { "lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
              "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
              "headline-lg-mobile": ["28px", { "lineHeight": "36px", "letterSpacing": "-0.01em", "fontWeight": "700" }]
            }
          }
        }
      }
    };

    // 2. Check if Tailwind CSS CDN script is already in the document
    let tailwindScript = document.getElementById("dynamic-tailwind-cdn");
    if (!tailwindScript) {
      tailwindScript = document.createElement('script');
      tailwindScript.src = "https://cdn.tailwindcss.com?plugins=forms,container-queries";
      tailwindScript.id = "dynamic-tailwind-cdn";
      tailwindScript.async = true;
      document.head.appendChild(tailwindScript);
    }

    // 3. Inject Google Fonts link
    let fontsLink = document.getElementById("dynamic-fonts");
    if (!fontsLink) {
      fontsLink = document.createElement('link');
      fontsLink.id = "dynamic-fonts";
      fontsLink.rel = 'stylesheet';
      fontsLink.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap';
      document.head.appendChild(fontsLink);
    }

    // 4. Inject Material Symbols link
    let symbolsLink = document.getElementById("dynamic-symbols");
    if (!symbolsLink) {
      symbolsLink = document.createElement('link');
      symbolsLink.id = "dynamic-symbols";
      symbolsLink.rel = 'stylesheet';
      symbolsLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
      document.head.appendChild(symbolsLink);
    }
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden flex items-center bg-slate-50">
          <div className="absolute inset-0 z-0">
            <img 
              src={heroImg} 
              alt="Dhoond Service Professionals" 
              className="w-full h-full object-cover object-[center_right] md:object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-[1400px] mx-auto px-[5%] w-full">
            <span className="inline-block bg-blue-600 text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider mb-4 md:mb-6">
              About Dhoond
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-4 md:mb-6 max-w-2xl">
              Building India's Most Trusted On-Demand Service Ecosystem
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-slate-600 max-w-xl mb-6 md:mb-8 leading-relaxed font-body-lg">
              Dhoond is a technology-driven platform connecting customers with verified professionals for home, commercial, and business services. Our goal is simple — make quality services accessible, reliable, and available whenever they are needed.
            </p>
            <button 
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.querySelector('#services-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="bg-blue-800 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-blue-900 transition-colors shadow-lg"
            >
              Explore Services
            </button>
          </div>
        </section>

        {/* Mission & Stats */}
        <section className="max-w-[1400px] mx-auto px-[5%] py-6 md:py-8 w-full">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
            <div className="bg-white p-6 md:p-10 rounded-[24px] border border-[#eef1f6] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="w-12 h-12 bg-[#4ef0c6] rounded-[12px] flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#0a644f] text-2xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 500" }}>rocket_launch</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 font-headline-lg text-slate-900">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed font-body-md text-sm md:text-base">
                We are transforming the way people discover, book, and manage professional services by creating a seamless ecosystem that benefits both customers and service partners. Through technology, transparency, and trust, Dhoond bridges the gap between demand and skilled professionals, enabling faster service delivery and better customer experiences.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'SERVICES DELIVERED', value: '1.25L+', colorClass: 'text-[#3b5998]' },
                { label: 'VERIFIED EXPERTS', value: '500+', colorClass: 'text-[#20bf6b]' },
                { label: 'CITIES SERVED', value: '2', colorClass: 'text-[#3b5998]' },
                { label: 'CUSTOMER RATING', value: '4.9★', colorClass: 'text-slate-800' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-[#e9ecef] py-6 px-4 md:p-8 rounded-xl text-center flex flex-col justify-center items-center">
                  <div className={`text-xl md:text-2xl font-bold ${stat.colorClass} mb-2 font-headline-lg`}>{stat.value}</div>
                  <div className="text-[10px] font-bold text-slate-500 tracking-widest leading-normal">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="bg-slate-50 py-6 md:py-8 px-[5%] w-full">
          <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="relative group">
              <img 
                src={techImg} 
                alt="Technician interacting with customer" 
                className="w-full h-[300px] md:h-[420px] object-cover rounded-[24px] shadow-lg"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-5 rounded-[16px] border border-white/20 shadow-lg">
                <p className="text-[#0052cc] font-medium italic text-center text-sm font-body-sm leading-relaxed">
                  “Bridging the gap between demand and skilled professionals.”
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 font-headline-lg">Our Story</h2>
              <p className="text-slate-600 leading-relaxed mb-4 md:mb-6 font-body-md text-sm md:text-base">
                Dhoond was founded with a vision to solve one of the most common challenges faced by individuals and businesses — finding trustworthy professionals quickly and efficiently.
              </p>
              <p className="text-slate-600 leading-relaxed font-body-md text-sm md:text-base">
                Traditional service discovery often involves uncertainty, delays, inconsistent quality, and limited accountability. Dhoond was built to change that by establishing a standardized, technology-first approach to on-demand services.
              </p>
            </div>
          </div>
        </section>

        {/* What We Do - Service Grid */}
        <section className="bg-[#f8fafc] py-6 md:py-8 px-[5%] w-full">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline-lg text-slate-900">What We Do</h2>
              <p className="text-slate-500 max-w-2xl mx-auto font-body-md text-sm md:text-base">
                Dhoond offers a comprehensive range of home and commercial services through a single digital platform.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
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
                    className={`bg-white p-4 md:p-6 rounded-[16px] border border-slate-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md transition-all text-center cursor-pointer flex flex-col items-center justify-center ${!isAvailable ? 'opacity-70 grayscale-[30%]' : ''}`}
                  >
                    <div className="text-2xl mb-3 text-[#0052cc] flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                    </div>
                    <h3 className="text-xs md:text-sm font-bold mb-1 text-slate-700 font-headline-md h-10 flex items-center justify-center">{service.name}</h3>
                    <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest mt-1 ${isAvailable ? 'text-green-600' : 'text-slate-400'}`}>
                      {isAvailable ? 'AVAILABLE NOW' : 'COMING SOON'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Empowering Professionals Section */}
        <section className="max-w-[1400px] mx-auto px-[5%] py-6 md:py-8 w-full">
          <div className="flex flex-col md:flex-row overflow-hidden rounded-3xl bg-blue-700">
            <div className="flex-1 p-6 md:p-12 text-white">
              <h2 className="text-2xl md:text-4xl font-bold mb-4 font-headline-lg">Empowering Service Professionals</h2>
              <p className="text-blue-100 mb-6 md:mb-10 leading-relaxed font-body-lg text-sm md:text-base">
                Our Partner Platform empowers technicians, electricians, painters, delivery associates, and service experts to grow their careers with dignity and technology.
              </p>
              <ul className="space-y-4 md:space-y-6">
                {[
                  { title: 'Verified Work Opportunities', desc: 'Consistent job flow from a trusted platform.' },
                  { title: 'Transparent Earnings', desc: 'Real-time tracking of payments and incentives.' },
                  { title: 'Training & Development', desc: 'Continuous skill up-gradation and certifications.' }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center border border-blue-400">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold font-label-md">{item.title}</h4>
                      <p className="text-sm text-blue-200 font-body-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-2/5 min-h-[250px] md:min-h-0">
              <img 
                src={storyImg} 
                alt="Empowered Professionals" 
                className="w-full h-full max-h-[300px] md:max-h-none object-cover"
              />
            </div>
          </div>
        </section>

        {/* Our Vision & Mission Text */}
        <section className="max-w-[1400px] mx-auto px-[5%] py-6 md:py-8 grid md:grid-cols-2 gap-8 md:gap-16 border-t border-slate-100 w-full">
          <div className="border-l-4 border-blue-700 pl-4 md:pl-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 font-headline-lg">Our Vision</h2>
            <p className="text-xl md:text-3xl font-bold italic text-slate-800 leading-tight font-headline-xl">
              "To become India's most trusted and innovative service marketplace that empowers millions of customers and service professionals through technology."
            </p>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 font-headline-lg">Our Mission</h2>
            <ul className="space-y-4">
              {[
                "Deliver reliable services with speed and transparency.",
                "Empower skilled professionals with earning opportunities.",
                "Create a trusted ecosystem built on quality and accountability.",
                "Use technology to simplify service discovery and management.",
                "Continuously innovate to improve customer and partner experiences."
              ].map((text, idx) => (
                <li key={idx} className="flex gap-4 items-start text-slate-600 font-body-md text-sm md:text-base">
                  <span className="text-blue-700 font-bold">0{idx + 1}.</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Why Choose Dhoond */}
        <section className="bg-slate-50 py-6 md:py-8 px-[5%] w-full">
          <div className="max-w-[1400px] mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 font-headline-lg">Why Choose Dhoond?</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
              {[
                { label: 'Trusted Pros', icon: 'verified_user', sub: 'Verification & Assessment' },
                { label: 'Seamless', icon: 'touch_app', sub: 'Book, track & manage' },
                { label: 'Quality', icon: 'high_quality', sub: 'Continuous monitoring' },
                { label: 'Transparent', icon: 'payments', sub: 'No hidden charges' },
                { label: 'Satisfaction', icon: 'favorite', sub: 'Customer-centric heart' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <span className="material-symbols-outlined text-primary text-2xl md:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {item.icon}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs md:text-sm mb-1 font-label-md">{item.label}</h4>
                  <p className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-tighter font-body-sm">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="bg-slate-900 text-white py-6 md:py-8 px-[5%] w-full">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center font-headline-lg">Core Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
              {[
                { title: 'Trust', desc: 'Building lasting relationships through honesty.' },
                { title: 'Excellence', desc: 'Striving for the highest quality in every task.' },
                { title: 'Innovation', desc: 'Using tech to redefine the service industry.' },
                { title: 'Empowerment', desc: 'Giving partners the tools to succeed.' },
                { title: 'Reliability', desc: 'Being there exactly when you need us.' }
              ].map((value, idx) => (
                <div key={idx} className="space-y-3 md:space-y-4">
                  <div className="h-1 w-12 bg-blue-500"></div>
                  <h4 className="text-base md:text-lg font-bold font-headline-md">{value.title}</h4>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-body-sm">{value.desc}</p>
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
