import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getCategoryTitle } from './CtaBanner';
import { getCategoryIcon } from './categoryIcons';

const CategoryFilterBar = ({ categories, selectedCategory, onSelectCategory }) => {
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedCategory]);

  return (
    <div className="filter-row">
      <div className="filter-pills blog-container" role="group" aria-label="Filter guides by category">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              ref={isActive ? activeRef : null}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`blog-pill${isActive ? ' active' : ''}`}
              aria-pressed={isActive}
              style={{ backgroundColor: isActive ? 'transparent' : undefined }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryBg"
                  className="blog-pill-bg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="blog-pill-icon">{getCategoryIcon(cat, 18)}</span>
              <span className="blog-pill-label">{getCategoryTitle(cat)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilterBar;
