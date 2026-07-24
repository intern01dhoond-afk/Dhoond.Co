import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Check, ArrowRight, Search } from 'lucide-react';
import gsap from 'gsap';

import { BLOG_POSTS, BLOG_CATEGORIES as CATEGORIES } from '../data/blogPosts';
import CtaBanner from '../components/blog/CtaBanner';
import CategoryFilterBar from '../components/blog/CategoryFilterBar';
import BlogCard from '../components/blog/BlogCard';
import FeaturedBlogCard from '../components/blog/FeaturedBlogCard';
import ToolkitCard from '../components/blog/ToolkitCard';
import '../styles/blog.css';

const SERVICE_COLLECTIONS = [
  {
    title: 'Verified Professionals',
    desc: 'Trusted technicians for every home service',
    image: '/blog/dhoond_technician_thumbsup.jpg',
    alt: 'Verified Dhoond technician',
    className: 'img-verified-pros',
  },
  {
    title: 'Expert Home Services',
    desc: 'Professional AC, Painting, Electrical & Appliance Care',
    image: '/blog/dhoond_technician_handshake.jpg',
    alt: 'Dhoond technician greeting a customer',
    className: 'img-expert-services',
  },
  {
    title: 'Trusted Home Solutions',
    desc: 'Reliable service with verified experts you can trust',
    image: '/blog/dhoond_technician_ac.jpg',
    alt: 'Dhoond technician servicing an air conditioner',
    className: 'img-trusted-solutions',
  },
];

const Blog = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const carouselRef = useRef(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const handleCarouselScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const children = Array.from(container.children);
    if (children.length === 0) return;

    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setActiveSlideIndex((prev) => (prev !== closestIndex ? closestIndex : prev));
  }, []);


  useEffect(() => {
    window.scrollTo(0, 0);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(['.hero-bg-image', '.hero-title-word', '.hero-description', '.hero-actions-container'], {
        opacity: 1,
        scale: 1,
        y: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-bg-image', { scale: 1.12 }, { scale: 1.0, duration: 2.2, ease: 'power2.out' });
      gsap.fromTo(
        '.hero-title-word',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: 'power3.out', delay: 0.1 }
      );
      gsap.fromTo(
        ['.hero-description', '.hero-actions-container'],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.6 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const featuredPost = useMemo(() => BLOG_POSTS.find((post) => post.featured), []);
  const toolkitPost = useMemo(() => BLOG_POSTS.find((post) => post.slug === 'inside-professional-technician-toolkit'), []);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      return selectedCategory === 'All' || post.category === selectedCategory;
    });
  }, [selectedCategory]);

  const gridPosts = useMemo(() => {
    return filteredPosts.filter((post) => !post.featured && post.slug !== 'inside-professional-technician-toolkit');
  }, [filteredPosts]);

  const openPost = useCallback((post) => navigate(`/blog/${post.slug}`), [navigate]);
  const scrollToArticles = useCallback(
    () => document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' }),
    []
  );
  const goHome = useCallback(() => navigate('/'), [navigate]);

  const handleSubscribe = useCallback(
    (e) => {
      e.preventDefault();
      if (!emailInput.trim()) return;
      setIsNewsletterSubscribed(true);
      setEmailInput('');
      setTimeout(() => setIsNewsletterSubscribed(false), 5000);
    },
    [emailInput]
  );

  return (
    <div className="blog-page">
      {/* ─── HERO SECTION ─── */}
      <div className="blog-hero" ref={heroRef}>
        <div className="hero-bg-image" />
        <div className="hero-bg-overlay" />
        <div className="blog-section" style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'flex-start' }}>
          <div className="blog-hero-content">
            <h1 className="hero-title on-dark">
              <span className="hero-title-line">
                <span className="hero-title-word">Reliable</span>{' '}
                <span className="hero-title-word">Home &</span>
              </span>{' '}
              <span className="hero-title-line">
                <span className="hero-title-word">Commercial</span>{' '}
                <span className="hero-title-word">Services</span>
              </span>{' '}
              <span className="hero-title-line">
                <span className="hero-title-word hero-accent-text">Right at</span>{' '}
                <span className="hero-title-word hero-accent-text">Your Spot</span>
              </span>
            </h1>

            <p className="hero-description on-dark">
              A comprehensive range of home and commercial services through a single digital platform.
            </p>

            <div className="hero-actions hero-actions-container">
              <button type="button" className="btn btn-blue hero-button" onClick={goHome}>
                Book an Expert
              </button>
              <button type="button" className="btn btn-light-outline hero-button" onClick={scrollToArticles}>
                Explore Guides
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FEATURED ARTICLE + TOOLKIT ─── */}
      {featuredPost && (
        <div className="blog-section featured-carousel-section" style={{ marginTop: 'clamp(-30px, -3vw, -16px)', marginBottom: 'clamp(20px, 4vw, 40px)', zIndex: 10, position: 'relative' }}>
          <div
            className="featured-toolkit-row"
            ref={carouselRef}
            onScroll={handleCarouselScroll}
          >
            <div className={`featured-carousel-item ${activeSlideIndex === 0 ? 'is-active' : ''}`}>
              <div className="featured-card-wrapper">
                <FeaturedBlogCard post={featuredPost} onOpen={openPost} />
              </div>
            </div>
            <div className={`featured-carousel-item ${activeSlideIndex === 1 ? 'is-active' : ''}`}>
              <ToolkitCard onOpen={() => toolkitPost && openPost(toolkitPost)} />
            </div>
          </div>
        </div>
      )}

      {/* ─── ARTICLES LIST & SEARCH ─── */}
      <div id="articles-section" className="blog-section" style={{ paddingBottom: 'clamp(48px, 10vw, 100px)', paddingTop: featuredPost ? '0' : 'clamp(24px, 5vw, 48px)' }}>
        <CategoryFilterBar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {gridPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
            <Search size={48} color="#3B82F6" style={{ margin: '0 auto 16px', opacity: 0.5 }} aria-hidden="true" />
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', color: '#0F172A' }}>No guides found</h3>
            <p style={{ color: '#64748B', fontSize: '14.5px' }}>Try adjusting your keyword search or category filters.</p>
          </div>
        ) : (
          <div className="blog-cards-grid">
            {gridPosts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                animationDelay={index * 0.05}
                onOpen={openPost}
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── SERVICE COLLECTIONS & CTA BANNER ─── */}
      <div className="blog-section" style={{ marginTop: 0, marginBottom: 'clamp(48px, 10vw, 100px)', marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(24px, 5vw, 48px)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.15)',
              borderRadius: '99px',
              padding: '6px 14px',
              marginBottom: '16px',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em' }}>What We Do</span>
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '12px' }}>
            A Comprehensive Range of Services
          </h2>
          <p style={{ fontSize: '16px', color: '#475569', fontWeight: 500, lineHeight: 1.6, maxWidth: '650px', margin: '0 auto 16px' }}>
            A comprehensive range of home and commercial services through a single digital platform.
          </p>
          <Link to="/" className="hover-nav-item" style={{ fontSize: '13.5px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Explore All Services <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className="collections-grid">
          {SERVICE_COLLECTIONS.map((col) => (
            <button key={col.title} type="button" className="collection-card" onClick={goHome} aria-label={`Explore ${col.title} collection`}>
              <img className={col.className} src={col.image} alt={col.alt} loading="lazy" decoding="async" />
              <div className="collection-overlay">
                <h3 className="collection-title">{col.title}</h3>
                <p className="collection-desc">{col.desc}</p>
                <div className="collection-link">
                  EXPLORE SERVICES <ArrowRight size={12} aria-hidden="true" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* ─── CTA BANNER BELOW CARDS ─── */}
        <div style={{ marginTop: 'clamp(36px, 5vw, 48px)', maxWidth: '820px', marginLeft: 'auto', marginRight: 'auto' }}>
          <CtaBanner showShell={false} />
        </div>
      </div>

      {/* ─── NEWSLETTER ─── */}
      <div className="newsletter-band">
        <div className="newsletter-inner">
          <div style={{ flex: '1 1 500px' }}>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              The Expert Weekly
            </h2>
            <p style={{ fontSize: '14.5px', color: '#475569', fontWeight: 500, lineHeight: 1.6, maxWidth: '580px' }}>
              Join 10,000+ homeowners receiving exclusive home care tips, design trends, and priority service offers.
            </p>
          </div>

          <div style={{ flex: '1 1 350px', maxWidth: '500px', width: '100%' }}>
            {isNewsletterSubscribed ? (
              <div role="status" className="newsletter-success">
                <Check size={18} aria-hidden="true" />
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: 800 }}>Successfully Subscribed!</div>
                  <div style={{ fontSize: '12.5px', opacity: 0.8, marginTop: '2px' }}>Thank you for joining our community list.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <div className="newsletter-input-wrap">
                  <Mail size={16} color="#64748B" style={{ marginRight: '10px', flexShrink: 0 }} aria-hidden="true" />
                  <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder="Your premium email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="newsletter-input no-input-style"
                  />
                </div>
                <button type="submit" className="newsletter-submit-btn">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;