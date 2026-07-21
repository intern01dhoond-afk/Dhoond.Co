import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { getCategoryTitle } from './CtaBanner';
import { getCategoryIcon } from '../../utils/blogUtils';

export default function BlogCard({ post, animationDelay = 0, readText, onOpen }) {
  if (!post) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(post);
    }
  };

  // Determine category color coding class
  let catClass = 'cat-services';
  if (post.category === 'Electrician') catClass = 'cat-electrical';
  else if (post.category === 'Painting') catClass = 'cat-painting';
  else if (post.category === 'RO Service') catClass = 'cat-ro';
  else if (post.category === 'Washing Machine Repair') catClass = 'cat-washing';
  else if (post.category === 'AC Service') catClass = 'cat-ac';
  else if (post.category === 'Refrigerator Repair') catClass = 'cat-refrigerator';

  // Get initials for author avatar circle
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
      onKeyDown={handleKeyDown}
      aria-label={`Read blog: ${post.title}`}
      className="blog-card-new"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: animationDelay }}
    >
      <div className="card-media-new">
        <img
          src={post.image}
          alt={post.title}
          className="card-img-new"
          loading="lazy"
          decoding="async"
        />
        <div className="card-badge-overlay-new">
          <span className={`card-badge-new ${catClass}`}>
            {getCategoryIcon(post.category, 12)}
            <span>{getCategoryTitle(post.category)}</span>
          </span>
        </div>
      </div>
      <div className="card-body-new">
        <h3 className="card-title-new">{post.title}</h3>
        <p className="card-desc-new">{post.description}</p>
        
        <div className="card-footer-new">
          <div className="card-metadata-row-new">
            <div className="card-author-new">
              <div className="card-avatar-initials">{getInitials(post.author)}</div>
              <span className="card-author-name">{post.author}</span>
            </div>
            <div className="card-read-time-new">
              <Clock size={13} className="card-clock-icon-new" aria-hidden="true" />
              <span>{post.readTime}</span>
            </div>
          </div>
          
          <hr className="card-divider-new" />
          
          <div className="read-link-new">
            <span className="read-link-text-new">{readText || 'Read Guide'}</span>
            <ArrowRight size={14} className="card-arrow-icon-new" aria-hidden="true" />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

