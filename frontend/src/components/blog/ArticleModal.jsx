import { useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, Clock, X } from 'lucide-react';
import AuthorMeta from './AuthorMeta';
import CategoryBadge from './CategoryBadge';
import ImageSlider from './ImageSlider';
import { sanitizeBlogHtml } from '../../utils/blogUtils';

export default function ArticleModal({ article, onClose }) {
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!article) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [article, onClose]);

  if (!article) return null;

  const safeContent = sanitizeBlogHtml(article.content);

  return (
    <div className="modal-root" role="presentation">
      <button
        type="button"
        className="modal-backdrop"
        onClick={onClose}
        aria-label="Close article"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-modal-title"
        className="modal-panel blog-container"
      >
        <div className="modal-header-img">
          <ImageSlider
            images={article.images}
            singleImage={article.image}
            title={article.title}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, #FFFFFF 0%, rgba(255, 255, 255, 0.3) 70%, rgba(255, 255, 255, 0) 100%)',
            }}
            aria-hidden="true"
          />

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close article"
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #E2E8F0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0F172A',
            }}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="mobile-p-6" style={{ padding: '0 50px 50px', marginTop: -30, position: 'relative', zIndex: 2 }}>
          <CategoryBadge>{article.category}</CategoryBadge>

          <h1
            id="article-modal-title"
            style={{
              fontSize: 'clamp(22px, 4vw, 36px)',
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              margin: '12px 0 20px',
            }}
          >
            {article.title}
          </h1>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 16,
              borderBottom: '1px solid #F1F5F9',
              paddingBottom: 24,
              marginBottom: 24,
            }}
          >
            <AuthorMeta author={article.author} authorRole={article.authorRole} size="lg" />

            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 16,
                color: '#64748B',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={12} aria-hidden="true" /> {article.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} aria-hidden="true" /> {article.readTime}
              </span>
            </div>
          </div>

          <div
            className="modal-body"
            style={{ color: '#475569', fontSize: '15.5px', lineHeight: 1.75, fontWeight: 500 }}
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />

          <div style={{ borderTop: '1px solid #F1F5F9', marginTop: 40, paddingTop: 24 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#2563EB',
                fontWeight: 700,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <ChevronLeft size={16} aria-hidden="true" /> Back to Guides
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
