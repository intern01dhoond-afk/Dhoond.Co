import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';

export default function FeaturedBlogCard({ post, onOpen }) {
  if (!post) return null;

  const images = post.images || [post.image];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  // Initials for avatar circle
  const getInitials = (name) => {
    if (!name) return 'DT';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <motion.article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(post)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(post);
        }
      }}
      aria-label={`Read featured blog: ${post.title}`}
      className="featured-blog-card-horizontal"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left Column: Image banner */}
      <div className="featured-card-media-horizontal" style={{ position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence initial={false}>
          <motion.img
            key={activeImageIndex}
            src={images[activeImageIndex]}
            alt={`${post.title} - Slide ${activeImageIndex + 1}`}
            className="featured-card-img-horizontal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            loading="lazy"
            decoding="async"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </AnimatePresence>

        {/* Slider dots overlay to match reference card look */}
        {images.length > 1 && (
          <div className="featured-card-dots" onClick={(e) => e.stopPropagation()}>
            {images.map((_, idx) => (
              <span
                key={idx}
                role="button"
                tabIndex={0}
                aria-label={`Go to slide ${idx + 1}`}
                className={`featured-card-dot ${idx === activeImageIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImageIndex(idx);
                  }
                }}
              ></span>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Content panel */}
      <div className="featured-card-body-horizontal">
        {/* Badge & Breadcrumb */}
        <div className="featured-card-badge-row">
          <span className="featured-card-badge">FEATURED GUIDE</span>
          <span className="featured-card-breadcrumb-dot">•</span>
          <span className="featured-card-breadcrumb-text">
            {post.category === 'Services' ? 'Home Services' : post.category}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="featured-card-title-horizontal">{post.title}</h3>
        <p className="featured-card-desc-horizontal">{post.description}</p>

        {/* Footer info pinned to bottom */}
        <div className="featured-card-footer-horizontal">
          {/* Row 1: Metadata row containing Author (left) & Reading time (right) */}
          <div className="featured-card-metadata-row">
            <div className="featured-card-author-row">
              <div className="featured-card-avatar">
                {getInitials(post.author)}
              </div>
              <span className="featured-card-author-name">{post.author}</span>
            </div>
            <div className="featured-card-read-time">
              <Clock size={13} className="clock-icon" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Divider inside footer block */}
          <hr className="featured-card-divider-horizontal" />

          {/* Row 2: Primary CTA */}
          <span className="featured-card-read-link">
            <span className="featured-card-read-link-text">READ BLOG</span>
            <ArrowRight size={15} className="featured-card-arrow-icon" aria-hidden="true" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
