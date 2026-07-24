import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { getCategoryTitle } from './CtaBanner';
import { getCategoryIcon } from './categoryIcons';

const CategoryFilterBar = ({ categories, selectedCategory, onSelectCategory }) => {
  const containerRef = useRef(null);
  const activeRef = useRef(null);
  const targetScrollRef = useRef(0);
  const animFrameRef = useRef(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const isDraggingRef = useRef(false);

  const lastPosRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);

  // Measure active pill position and width relative to the scroll container
  const [activeRect, setActiveRect] = useState({ left: 0, width: 0, opacity: 0 });
  const [canScroll, setCanScroll] = useState(false);

  const updateActiveRect = useCallback(() => {
    if (activeRef.current && containerRef.current) {
      const activeEl = activeRef.current;
      const container = containerRef.current;
      setActiveRect({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1,
      });
      // Detect if pills actually overflow the available width (plus a safety threshold of 1px)
      setCanScroll(container.scrollWidth > container.clientWidth + 1);
    }
  }, []);

  useLayoutEffect(() => {
    updateActiveRect();
  }, [selectedCategory, categories, updateActiveRect]);

  useEffect(() => {
    window.addEventListener('resize', updateActiveRect);
    return () => window.removeEventListener('resize', updateActiveRect);
  }, [updateActiveRect]);

  const stopAnimation = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  // Smooth custom cubic ease-out animation controller for container horizontal scroll
  const animateTo = useCallback((targetLeft, duration = 400) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const startLeft = container.scrollLeft;
    const distance = targetLeft - startLeft;

    if (Math.abs(distance) < 0.5) {
      container.scrollLeft = targetLeft;
      return;
    }

    stopAnimation();

    // Temporarily disable scroll-snap to prevent browser fighting programmatic scroll
    const originalScrollSnap = container.style.scrollSnapType;
    container.style.scrollSnapType = 'none';

    let startTime = null;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      if (containerRef.current) {
        containerRef.current.scrollLeft = startLeft + distance * easedProgress;
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        if (containerRef.current) {
          containerRef.current.style.scrollSnapType = originalScrollSnap;
        }
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, [stopAnimation]);

  // Smoothly center the active pill in viewport when selectedCategory changes
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeEl = activeRef.current;
      const containerWidth = container.clientWidth;
      const maxScroll = container.scrollWidth - containerWidth;

      if (maxScroll <= 0) return;

      const activeLeft = activeEl.offsetLeft;
      const activeWidth = activeEl.clientWidth;

      const padding = 24; // Safe zone padding from edges
      let targetLeft = container.scrollLeft;

      if (activeLeft < container.scrollLeft + padding) {
        // Tab is near or off the left edge, scroll left to show it with padding
        targetLeft = activeLeft - padding;
      } else if (activeLeft + activeWidth > container.scrollLeft + containerWidth - padding) {
        // Tab is near or off the right edge, scroll right to show it with padding
        targetLeft = activeLeft + activeWidth - containerWidth + padding;
      } else {
        // Tab is fully visible in the safe zone, no scrolling needed
        return;
      }

      targetLeft = Math.max(0, Math.min(targetLeft, maxScroll));

      if (Math.abs(targetLeft - container.scrollLeft) < 1) {
        return;
      }

      animateTo(targetLeft, 400);
    }
  }, [selectedCategory, animateTo]);

  // Handle smooth horizontal scrolling with mouse wheel / trackpad
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (!canScroll) return; // Only scroll programmatically if layout overflows
      if (Math.abs(e.deltaY) >= Math.abs(e.deltaX) && e.deltaY !== 0) {
        e.preventDefault();

        if (animFrameRef.current === null) {
          targetScrollRef.current = container.scrollLeft;
        }

        targetScrollRef.current += e.deltaY * 0.9;
        const maxScroll = container.scrollWidth - container.clientWidth;
        targetScrollRef.current = Math.max(0, Math.min(targetScrollRef.current, maxScroll));

        const animateWheel = () => {
          if (!containerRef.current) {
            animFrameRef.current = null;
            return;
          }
          const current = containerRef.current.scrollLeft;
          const dist = targetScrollRef.current - current;

          if (Math.abs(dist) > 0.5) {
            containerRef.current.scrollLeft += dist * 0.18;
            animFrameRef.current = requestAnimationFrame(animateWheel);
          } else {
            containerRef.current.scrollLeft = targetScrollRef.current;
            animFrameRef.current = null;
          }
        };

        if (animFrameRef.current === null) {
          animFrameRef.current = requestAnimationFrame(animateWheel);
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      stopAnimation();
    };
  }, [stopAnimation, canScroll]);

  // Desktop mouse drag-to-scroll handlers with momentum/inertia physics
  const handleMouseDown = (e) => {
    if (e.button !== 0 || !containerRef.current || !canScroll) return;
    stopAnimation();
    isMouseDownRef.current = true;
    isDraggingRef.current = false;
    startXRef.current = e.pageX;
    startScrollLeftRef.current = containerRef.current.scrollLeft;

    lastPosRef.current = e.pageX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handleMouseMove = (e) => {
    if (!isMouseDownRef.current || !containerRef.current || !canScroll) return;
    const now = performance.now();
    const dt = Math.max(now - lastTimeRef.current, 1);
    const dxTotal = e.pageX - startXRef.current;
    const dxStep = e.pageX - lastPosRef.current;

    velocityRef.current = dxStep / dt;
    lastPosRef.current = e.pageX;
    lastTimeRef.current = now;

    if (Math.abs(dxTotal) > 4) {
      isDraggingRef.current = true;
    }
    containerRef.current.scrollLeft = startScrollLeftRef.current - dxTotal;
  };

  const handleMouseUpOrLeave = () => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;

    if (isDraggingRef.current && Math.abs(velocityRef.current) > 0.05 && containerRef.current) {
      let vel = velocityRef.current * 16;
      const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;

      const momentumStep = () => {
        if (!containerRef.current || Math.abs(vel) < 0.3) {
          animFrameRef.current = null;
          return;
        }
        const newScroll = containerRef.current.scrollLeft - vel;
        containerRef.current.scrollLeft = Math.max(0, Math.min(newScroll, maxScroll));
        vel *= 0.92;
        animFrameRef.current = requestAnimationFrame(momentumStep);
      };

      stopAnimation();
      animFrameRef.current = requestAnimationFrame(momentumStep);
    }
  };

  const handlePillClick = (e, cat) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      isDraggingRef.current = false;
      return;
    }
    onSelectCategory(cat);
  };

  return (
    <div className="filter-row">
      <div
        ref={containerRef}
        className={`filter-pills blog-container ${canScroll ? 'is-scrollable' : 'no-scroll'}`}
        role="group"
        aria-label="Filter guides by category"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={stopAnimation}
      >
        {/* Single persistent sliding active indicator capsule */}
        <div
          className="blog-pill-bg-floating"
          style={{
            left: activeRect.left,
            width: activeRect.width,
            opacity: activeRect.opacity,
          }}
        />

        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const label = getCategoryTitle(cat);
          return (
            <button
              key={cat}
              ref={isActive ? activeRef : null}
              type="button"
              onClick={(e) => handlePillClick(e, cat)}
              className={`blog-pill${isActive ? ' active' : ''}`}
              aria-pressed={isActive}
            >
              <span className="blog-pill-icon">{getCategoryIcon(cat, 18)}</span>
              <span className="blog-pill-label" data-text={label}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilterBar;
