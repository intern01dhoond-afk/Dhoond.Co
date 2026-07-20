import { getCategoryIcon } from '../../utils/blogUtils';

export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div
      className="category-bar blog-container"
      role="toolbar"
      aria-label="Filter guides by category"
    >
      {categories.map((cat) => {
        const isActive = selected === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className={`blog-pill ${isActive ? 'active' : ''}`}
            aria-pressed={isActive}
          >
            {getCategoryIcon(cat)}
            <span>{cat}</span>
          </button>
        );
      })}
    </div>
  );
}
