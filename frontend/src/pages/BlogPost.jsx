import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Clock, Calendar, ArrowRight, Phone, ArrowUpRight, ChevronRight, Sparkles, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BLOG_POSTS } from '../data/blogPosts';
import { getCategoryIcon, getAuthorInitials } from '../utils/blogUtils';
import CtaBanner, { getCategoryTitle } from '../components/blog/CtaBanner';
import BlogCard from '../components/blog/BlogCard';
import '../styles/blog.css';

const BlogPost = () => {
  const params = useParams();
  const slugParam = params.slug || params.id;
  const navigate = useNavigate();

  const post = BLOG_POSTS.find((p) => p.slug === slugParam || String(p.id) === String(slugParam));
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) {
      document.title = post.seoTitle || `${post.title} | Dhoond Guides`;
    }
  }, [post]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowStickyCta(true);
      } else {
        setShowStickyCta(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return (
      <div style={styles.notFoundWrap}>
        <h2 style={styles.notFoundTitle}>Guide Not Found</h2>
        <p style={styles.notFoundText}>
          We couldn't find the article you are looking for. It may have been moved or deleted.
        </p>
        <Link to="/blog" style={styles.notFoundLink}>
          <ArrowLeft size={16} /> Back to Guides
        </Link>
      </div>
    );
  }

  const categoryLabel = getCategoryTitle(post.category);

  const relatedPosts = BLOG_POSTS
    .filter((p) => p.id !== post.id && (p.category === post.category || p.featured))
    .slice(0, 3);

  if (relatedPosts.length < 3) {
    const additional = BLOG_POSTS
      .filter((p) => p.id !== post.id && !relatedPosts.some((r) => r.id === p.id))
      .slice(0, 3 - relatedPosts.length);
    relatedPosts.push(...additional);
  }

  return (
    <div className="blog-post-page" style={styles.page}>
      <style>{`
        .blog-post-page, .blog-post-page * { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important; }
        .blog-content-body h2 { color: #0F172A; font-weight: 800; font-size: clamp(20px, 4vw, 24px); margin: clamp(24px, 5vw, 36px) 0 16px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; }
        .blog-content-body h3 { color: #1E293B; font-weight: 700; font-size: clamp(17px, 3.5vw, 20px); margin: clamp(18px, 4vw, 24px) 0 12px; }
        .blog-content-body h4 { color: #334155; font-weight: 600; font-size: 16px; margin: 18px 0 8px; }
        .blog-content-body p { color: #475569; line-height: 1.8; font-size: 16px; margin-bottom: 20px; }
        .blog-content-body blockquote { border-left: 4px solid #2563EB; background: rgba(37, 99, 235, 0.05); padding: 16px 24px; border-radius: 8px; color: #2563EB; font-style: italic; margin: 28px 0; font-weight: 500; font-size: 16.5px; }
        .blog-content-body ul, .blog-content-body ol { color: #475569; padding-left: 24px; margin-bottom: 20px; }
        .blog-content-body li { margin-bottom: 10px; line-height: 1.7; font-size: 16px; }
        .blog-content-body strong { color: #0F172A; }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #64748B;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .back-link:hover { color: #2563EB; transform: translateX(-4px); }
        .back-link:focus-visible {
          outline: 2px solid #2563EB;
          outline-offset: 4px;
          border-radius: 4px;
        }

        .breadcrumb-link {
          color: #94A3B8;
          text-decoration: none;
          transition: color 0.2s ease;
          font-weight: 600;
        }
        .breadcrumb-link:hover {
          color: #2563EB;
        }

        .related-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          overflow: hidden;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 15px rgba(0,0,0,0.01);
        }
        .related-card:hover,
        .related-card:focus-visible {
          transform: translateY(-6px);
          border-color: rgba(37, 99, 235, 0.2);
          box-shadow: 0 15px 35px rgba(15, 23, 42, 0.06);
        }
        .related-card:focus-visible { outline: 2px solid #2563EB; outline-offset: 2px; }
        .related-card:hover .related-img { transform: scale(1.03); }
        .related-img { transition: transform 0.4s ease; }

        .category-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(37, 99, 235, 0.06);
          border: 1px solid rgba(37, 99, 235, 0.12);
          color: #2563EB;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 6px 14px;
          border-radius: 99px;
          margin-bottom: 16px;
        }

        .sticky-btn-hover:hover {
          background-color: #1D4ED8 !important;
        }

        .sticky-cta-bar {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: min(92%, 580px);
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 10px 14px;
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.14);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          box-sizing: border-box;
        }

        @media (max-width: 640px) {
          .post-meta-stats {
            margin-left: 0 !important;
            width: 100%;
            margin-top: 8px;
          }
          .post-breadcrumb-trail {
            flex-wrap: wrap !important;
            gap: 6px !important;
            font-size: 12px !important;
          }
          .post-meta-row {
            flex-wrap: wrap !important;
            gap: 10px !important;
          }
          .sticky-cta-bar {
            bottom: 12px;
            padding: 8px 12px;
            border-radius: 16px;
            width: min(94%, 580px);
            gap: 8px;
          }
          .sticky-cta-subtext {
            display: none !important;
          }
          .sticky-cta-title {
            font-size: 12px !important;
          }
          .sticky-cta-btn {
            padding: 7px 14px !important;
            font-size: 11.5px !important;
          }
        }
        @media (max-width: 480px) {
          .post-container {
            padding: 0 1rem !important;
          }
          .post-meta-row {
            flex-wrap: wrap !important;
            gap: 10px !important;
          }
        }

        .post-container {
          width: 100%;
          max-width: 768px;
          margin: 0 auto;
          padding: 0 1.5rem;
          box-sizing: border-box;
          text-align: left;
        }
      `}</style>

      <div className="post-container">
        {/* Breadcrumb — left-aligned in a single row */}
        <nav aria-label="Breadcrumb" className="post-breadcrumb-row" style={styles.breadcrumbRow}>
          <div className="post-breadcrumb-trail" style={styles.breadcrumbTrail}>
            <Link to="/" className="breadcrumb-link">Home</Link>
            <ChevronRight size={12} aria-hidden="true" style={{ color: '#CBD5E1' }} />
            <Link to="/blog" className="breadcrumb-link">Guides</Link>
            <ChevronRight size={12} aria-hidden="true" style={{ color: '#CBD5E1' }} />
            <span style={{ color: '#64748B', fontWeight: 600 }}>{categoryLabel}</span>
          </div>
        </nav>

        <header style={{ marginBottom: '32px' }}>
          <div className="category-badge">
            {getCategoryIcon(post.category, 12)}
            <span>{categoryLabel}</span>
          </div>

          <h1 style={styles.title}>{post.title}</h1>

          {/* Grouped Author Section */}
          <div className="post-meta-row" style={styles.metaRow}>
            <div style={styles.avatar} aria-hidden="true">
              {getAuthorInitials(post.author)}
            </div>
            <div style={styles.metaInfo}>
              <div style={styles.metaAuthorRow}>
                <span style={styles.metaAuthor}>{post.author}</span>
                <span style={styles.metaDivider}>•</span>
                <span style={styles.metaRole}>{post.authorRole}</span>
              </div>
              <div style={styles.metaStatsRow}>
                <span style={styles.metaStat}><Calendar size={13} aria-hidden="true" /> {post.date}</span>
                <span style={styles.metaDivider}>•</span>
                <span style={styles.metaStat}><Clock size={13} aria-hidden="true" /> {post.readTime}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Elevated Hero Image */}
        <div className="post-hero-img" style={styles.heroImgWrap}>
          <img
            src={post.image}
            alt={post.title}
            style={styles.heroImg}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <article
          className="blog-content-body"
          style={styles.articleBody}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Book Service CTA Banner */}
        <div style={{ margin: 'clamp(28px, 6vw, 44px) 0' }}>
          <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563EB' }} aria-hidden="true" />
            <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
              Having the Same Issue?
            </h3>
          </div>
          <CtaBanner
            title={`Need Help with ${getCategoryTitle(post.category)}?`}
            description="Book one of our verified experts today. Professional tools, transparent pricing, and quality guarantee."
            showShell={false}
          />
        </div>

        <section style={{ borderTop: '1px solid #E2E8F0', paddingTop: '60px' }} aria-labelledby="related-guides-heading">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            <Sparkles size={18} color="#2563EB" aria-hidden="true" />
            <h2 id="related-guides-heading" style={styles.relatedHeading}>
              Related Guides
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {relatedPosts.map((relPost) => (
              <BlogCard
                key={relPost.id}
                post={relPost}
                onOpen={(p) => {
                  window.scrollTo(0, 0);
                  navigate(`/blog/${p.slug}`);
                }}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Sticky Scrolling Booking CTA */}
      <AnimatePresence>
        {showStickyCta && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="sticky-cta-bar"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', flex: 1, minWidth: 0 }}>
              <div style={{
                background: 'rgba(37, 99, 235, 0.08)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Sparkles size={15} color="#2563EB" />
              </div>
              <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
                <div className="sticky-cta-title" style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Need {getCategoryTitle(post.category)}?
                </div>
                <div className="sticky-cta-subtext" style={{ fontSize: '11px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Book a verified expert and get quality service.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '99px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                  transition: 'background-color 0.2s',
                }}
                className="sticky-btn-hover sticky-cta-btn"
              >
                Book Now
              </button>
              <button
                onClick={() => setShowStickyCta(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label="Dismiss booking prompt"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#F8FAFC',
    color: '#1E293B',
    minHeight: '100vh',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    overflowX: 'hidden',
    width: '100%',
    paddingTop: 'clamp(32px, 6vw, 64px)',
    paddingBottom: 'clamp(60px, 10vw, 100px)',
  },
  container: { maxWidth: '800px', margin: '0 auto', padding: '0 clamp(16px, 5vw, 40px)' },
  notFoundWrap: {
    minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#F8FAFC', padding: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  notFoundTitle: { fontSize: '28px', fontWeight: 900, color: '#0F172A', marginBottom: '12px' },
  notFoundText: { color: '#64748B', marginBottom: '24px', textAlign: 'center', maxWidth: '400px' },
  notFoundLink: {
    display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#2563EB', color: '#fff',
    padding: '12px 24px', borderRadius: '9999px', fontWeight: 700, textDecoration: 'none',
  },
  breadcrumbRow: { marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' },
  breadcrumbTrail: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#94A3B8' },
  title: {
    fontSize: 'clamp(28px, 4.5vw, 40px)', fontWeight: 800, color: '#0F172A',
    letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: '20px',
  },
  metaRow: {
    display: 'flex', alignItems: 'center', gap: '12px',
    borderBottom: '1px solid #E2E8F0', paddingBottom: '20px',
    marginBottom: '32px',
  },
  metaInfo: {
    display: 'flex', flexDirection: 'column', gap: '4px',
  },
  metaAuthorRow: {
    display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap',
  },
  metaAuthor: {
    fontSize: '14.5px', fontWeight: 700, color: '#0F172A',
  },
  metaRole: {
    fontSize: '12px', color: '#64748B', fontWeight: 500,
  },
  metaStatsRow: {
    display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '12px', fontWeight: 500,
  },
  metaStat: {
    display: 'flex', alignItems: 'center', gap: '4px',
  },
  metaDivider: {
    color: '#CBD5E1', fontSize: '10px',
  },
  avatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: '13px', color: '#FFF', flexShrink: 0,
    boxShadow: '0 4px 10px rgba(37,99,235,0.15)',
  },
  heroImgWrap: {
    width: '100%', height: 'clamp(240px, 45vw, 400px)', borderRadius: '20px', overflow: 'hidden',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.02)',
    marginBottom: '36px', position: 'relative',
  },
  heroImg: { width: '100%', height: '100%', objectFit: 'cover' },
  articleBody: { maxWidth: '100%', margin: '0 auto clamp(32px, 6vw, 64px)', position: 'relative' },
  relatedHeading: { fontSize: '22px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 },
};

export default BlogPost;