import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageSlider({ images, singleImage, title, containerStyle, imgStyle, className = '' }) {
  const imageList = images && images.length > 0 ? images : (singleImage ? [singleImage] : []);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (imageList.length <= 1) return;
    const timer = setInterval(() => {
      setActiveImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [imageList.length]);

  if (imageList.length === 0) return null;

  if (imageList.length === 1) {
    return (
      <img
        src={imageList[0]}
        alt={title || ''}
        className={className}
        style={{ width: '100%', height: '100%', objectFit: 'cover', ...imgStyle }}
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
    );
  }

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...containerStyle }}>
      <AnimatePresence initial={false}>
        <motion.img
          key={activeImageIndex}
          src={imageList[activeImageIndex]}
          alt={`${title || 'Slide'} - Slide ${activeImageIndex + 1}`}
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
            objectFit: 'cover',
            ...imgStyle
          }}
        />
      </AnimatePresence>

      {/* Slider dots overlay */}
      <div className="featured-card-dots" onClick={(e) => e.stopPropagation()}>
        {imageList.map((_, idx) => (
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
    </div>
  );
}
