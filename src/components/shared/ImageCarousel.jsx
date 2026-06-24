import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Horizontal swipeable image carousel with mouse drag support
 * @param {string[]} images - array of image URLs
 * @param {string} alt - alt text for images
 * @param {string} [className] - additional classes for the container
 * @param {boolean} [alwaysShowArrows] - force arrows visible on all devices
 * @param {Function} [onImageClick] - callback when an image is clicked (receives index)
 */
export default function ImageCarousel({
  images,
  alt,
  className = '',
  alwaysShowArrows = false,
  onImageClick,
}) {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const dragOffset = useRef(0);
  const containerRef = useRef(null);

  if (!images || images.length === 0) return null;

  const hasMultiple = images.length > 1;

  const goTo = useCallback((index) => {
    setCurrent(((index % images.length) + images.length) % images.length);
  }, [images.length]);

  const next = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    goTo(current + 1);
  };

  const prev = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    goTo(current - 1);
  };

  // ── Touch handlers ──
  const onTouchStart = (e) => {
    dragStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  };
  const onTouchMove = (e) => {
    if (!isDragging) return;
    dragCurrentX.current = e.touches[0].clientX;
    dragOffset.current = dragStartX.current - dragCurrentX.current;
  };
  const onTouchEnd = () => {
    setIsDragging(false);
    const diff = dragOffset.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
    }
    dragOffset.current = 0;
  };

  // ── Mouse drag handlers ──
  const onMouseDown = (e) => {
    e.preventDefault();
    dragStartX.current = e.clientX;
    setIsDragging(true);
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    dragCurrentX.current = e.clientX;
    dragOffset.current = dragStartX.current - dragCurrentX.current;
  };
  const onMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = dragOffset.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
    }
    dragOffset.current = 0;
  };
  const onMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      dragOffset.current = 0;
    }
  };

  // ── Keyboard ──
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prev(e);
      else if (e.key === 'ArrowRight') next(e);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [current]);

  const arrowBase = `absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 z-10 ${
    alwaysShowArrows
      ? 'bg-black/40 hover:bg-black/60 text-white opacity-70 hover:opacity-100'
      : 'bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 md:opacity-0'
  }`;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden group ${className}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {/* Images */}
      <div
        className="flex transition-transform duration-300 ease-out h-full select-none"
        style={{
          transform: `translateX(-${current * 100}%)`,
          cursor: isDragging ? 'grabbing' : hasMultiple ? 'grab' : 'default',
        }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="w-full flex-shrink-0"
            onClick={() => onImageClick?.(i)}
          >
            <img
              src={src}
              alt={`${alt} ${i + 1}`}
              className="w-full h-full object-cover pointer-events-none"
              loading={i === 0 ? 'eager' : 'lazy'}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={prev}
            className={`left-2 ${arrowBase}`}
            aria-label="Previous image"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className={`right-2 ${arrowBase}`}
            aria-label="Next image"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(i); }}
                className={`rounded-full transition-all duration-200 ${
                  i === current
                    ? 'bg-white w-4 h-2 scale-100'
                    : 'bg-white/50 hover:bg-white/70 w-2 h-2'
                }`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Image counter */}
      {hasMultiple && (
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full z-10 font-medium">
          {current + 1}/{images.length}
        </div>
      )}

      {/* Swipe hint for mobile — fades after first interaction */}
      {hasMultiple && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 text-[10px] font-medium tracking-wide md:hidden animate-pulse">
          ← swipe →
        </div>
      )}
    </div>
  );
}
