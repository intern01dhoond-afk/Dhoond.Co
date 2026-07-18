import { Search } from 'lucide-react';
import BlogCard from './BlogCard';

export default function BlogGrid({ posts, onOpen }) {
  if (posts.length === 0) {
    return (
      <div className="blog-empty">
        <Search size={48} color="#3B82F6" style={{ margin: '0 auto 16px', opacity: 0.5 }} aria-hidden="true" />
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: '#0F172A' }}>No guides found</h3>
        <p style={{ color: '#64748B', fontSize: '14.5px' }}>
          Try adjusting your keyword search or category filters.
        </p>
      </div>
    );
  }

  return (
    <div className="blog-cards-grid">
      {posts.map((post, index) => (
        <BlogCard
          key={post.id}
          post={post}
          animationDelay={index * 0.05}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

