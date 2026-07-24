import { ArrowRight, Clock } from 'lucide-react';

export default function ToolkitCard({ onOpen }) {
  return (
    <article
      className="toolkit-card"
      role="button"
      tabIndex={0}
      onClick={() => onOpen && onOpen()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen && onOpen();
        }
      }}
      aria-label="Read Professional Technician's Toolkit"
    >
      {/* Top Image Banner */}
      <div className="toolkit-card-image-wrap">
        <img
          src="/blog/toolkit.png"
          alt="Professional Technician's Toolkit"
          className="toolkit-card-image"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Card Body & Content */}
      <div className="toolkit-card-body">
        {/* Category / Tag Row */}
        <div className="toolkit-card-badge-row">
          <span className="toolkit-card-badge">TOOLKIT GUIDE</span>
          <span className="toolkit-card-breadcrumb-dot">•</span>
          <span className="toolkit-card-breadcrumb-text">Equipment Care</span>
        </div>

        {/* Title */}
        <h3 className="toolkit-card-title">
          Professional Technician's Toolkit
        </h3>

        {/* Short Description */}
        <p className="toolkit-card-desc">
          Essential tools & gear certified experts rely on for fast, reliable home repairs.
        </p>

        {/* Footer Meta & CTA */}
        <div className="toolkit-card-footer-wrap">
          {/* Metadata Row */}
          <div className="toolkit-card-metadata-row">
            <div className="toolkit-card-author-row">
              <div className="toolkit-card-avatar">DT</div>
              <span className="toolkit-card-author-name">Dhoond Team</span>
            </div>
            <div className="toolkit-card-read-time">
              <Clock size={12} className="clock-icon" />
              <span>6 min read</span>
            </div>
          </div>

          {/* Divider Line */}
          <hr className="toolkit-card-divider" />

          {/* CTA Link */}
          <div className="toolkit-card-cta-row">
            <span className="toolkit-card-read-link">
              <span className="toolkit-card-read-text">READ BLOG</span>
              <ArrowRight size={15} className="toolkit-card-arrow-icon" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
