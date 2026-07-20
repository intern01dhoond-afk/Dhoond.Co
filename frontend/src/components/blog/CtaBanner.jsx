import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Phone } from 'lucide-react';
import gsap from 'gsap';
import './CtaBanner.css';

/**
 * Reusable bottom-of-page CTA banner animated with GSAP.
 */
export default function CtaBanner({
  title = 'Need Professional Help?',
  description =
    'Our certified technicians are just a tap away. Get expert assistance for any home service with a 100% satisfaction guarantee.',
  bookHref = '/',
  phoneNumber = '+919102740274',
  phoneLabel = '+91 910 274 0274',
  imageSrc = '/blog/cta_technician_new.png',
  showShell = true,
}) {
  const navigate = useNavigate();
  const bannerRef = useRef(null);
  const mediaRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Set to final visible state immediately
      gsap.set(bannerRef.current, { opacity: 1, y: 0 });
      gsap.set(mediaRef.current, { opacity: 1, x: 0 });
      return;
    }

    // Set initial animated states
    gsap.set(bannerRef.current, { opacity: 0, y: 30 });
    gsap.set(mediaRef.current, { opacity: 0, x: 30 });

    // Floating bobbing animation loop for the image
    const bobTween = gsap.fromTo(
      imageRef.current,
      { y: 0 },
      {
        y: -8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      }
    );

    // Scroll trigger entrance using Intersection Observer
    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Fade & slide up the banner card
              gsap.to(bannerRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
              });

              // Fade & slide left the media container
              gsap.to(mediaRef.current, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out',
                delay: 0.1,
              });

              observer.disconnect();
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      observer.observe(bannerRef.current);
    } else {
      // Fallback if IntersectionObserver is not supported
      gsap.set([bannerRef.current, mediaRef.current], { opacity: 1, x: 0, y: 0 });
    }

    return () => {
      bobTween.kill();
      if (observer) observer.disconnect();
    };
  }, []);

  const bannerContent = (
    <div ref={bannerRef} className="cta-banner">
      <div className="cta-banner__content">
        <h2 className="cta-banner__title">{title}</h2>
        <p className="cta-banner__description">{description}</p>
        <div className="cta-banner__actions">
          <button
            type="button"
            onClick={() => navigate(bookHref)}
            className="cta-btn cta-btn-primary"
            aria-label="Book a service now"
          >
            Book Service Now <ArrowUpRight size={15} aria-hidden="true" />
          </button>
          <a
            href={`tel:${phoneNumber}`}
            className="cta-btn cta-btn-secondary"
            aria-label={`Call an expert at ${phoneLabel}`}
          >
            Call Expert <Phone size={14} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="cta-banner__media">
        <div ref={mediaRef} className="cta-banner__media-inner">
          <img
            ref={imageRef}
            src={imageSrc}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            width={420}
            height={420}
            className="cta-banner__image"
          />
        </div>
      </div>
    </div>
  );

  if (!showShell) {
    return bannerContent;
  }

  return (
    <div className="cta-banner-shell">
      {bannerContent}
    </div>
  );
}

// Single source of truth for category → display-title mapping.
// Add new categories here instead of extending an inline ternary chain
// (post.category === "Services" ? "Home Services" : post.category).
export const CATEGORY_TITLES = {
  Services: 'Home Services',
  Painting: 'Painting Services',
  AC: 'AC Services',
  'AC Service': 'AC Services',
  Electrician: 'Electrical Services',
  'RO Service': 'RO Services',
  'Washing Machine Repair': 'Washing Machine',
  'Refrigerator Repair': 'Refrigerator',
};

/**
 * Resolve a display title for a post category, falling back to the raw
 * category string for anything not yet mapped.
 */
export function getCategoryTitle(category) {
  return CATEGORY_TITLES[category] ?? category;
}
