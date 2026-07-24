import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import ImageSlider from './ImageSlider';

export default function FeaturedBlogCard({ post, onOpen }) {
  if (!post) return null;

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
      <div className="featured-card-media-horizontal">
        <ImageSlider
          images={post.images}
          singleImage={post.image}
          title={post.title}
          imgStyle={{ className: 'featured-card-img-horizontal' }}
        />
      </div>

      {/* Right Column: Content panel */}
      <div className="featured-card-body-horizontal">
        {/* Badge */}
        <div className="featured-card-badge-row">
          <span className="featured-card-badge">FEATURED GUIDE</span>
        </div>

        {/* Title & Description */}
        <h3 className="featured-card-title-horizontal">{post.title}</h3>
        <p className="featured-card-desc-horizontal">{post.description}</p>

        {/* Read Time */}
        <div className="featured-card-read-time">
          <Clock size={13} className="clock-icon" />
          <span>{post.readTime}</span>
        </div>

        {/* Footer info pinned to bottom */}
        <div className="featured-card-footer-horizontal">
          {/* Divider inside footer block */}
          <hr className="featured-card-divider-horizontal" />

          {/* Primary CTA */}
          <span className="featured-card-read-link">
            <span className="featured-card-read-link-text">READ BLOG</span>
            <ArrowRight size={15} className="featured-card-arrow-icon" aria-hidden="true" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
