import { Search } from 'lucide-react';

export default function BlogSearch({ value, onChange, resultCount }) {
  return (
    <div className="articles-toolbar">
      <div className="blog-search">
        <Search className="blog-search__icon" size={18} aria-hidden="true" />
        <input
          type="search"
          className="blog-search__input"
          placeholder="Search guides by topic or keyword..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search blog guides"
        />
      </div>
      <p className="blog-results-count" aria-live="polite">
        {resultCount} {resultCount === 1 ? 'guide' : 'guides'} found
      </p>
    </div>
  );
}
