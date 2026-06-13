import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Horizontal swipeable image carousel
 * @param {string[]} images - array of image URLs
 * @param {string} alt - alt text for images
 * @param {string} [className] - additional classes
 */
export default function ImageCarousel({ images, alt, className = '' }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  if (!images || images.length === 0) return null;

  const hasMultiple = images.length > 1;

  const goTo = (index) => {
    setCurrent((index + images.length) % images.length);
  };

  const next = (e) => {
    e.preventDefault();
    e.stopPropagation();
    goTo(current + 1);
  };

  const prev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    goTo(current - 1);
  };

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchMove = (e) => { touchEndX.current = e.touches[0].clientX; };
  const onTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
    }
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Images */}
      <div
        className="flex transition-transform duration-300 ease-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="w-full flex-shrink-0">
            <img
              src={src}
              alt={`${alt} ${i + 1}`}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRight size={16} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(i); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current
                    ? 'bg-white scale-110'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Image counter */}
      {hasMultiple && (
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
          {current + 1}/{images.length}
        </div>
      )}
    </div>
  );
}
