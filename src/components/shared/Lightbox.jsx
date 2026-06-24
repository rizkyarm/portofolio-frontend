import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

/**
 * Fullscreen lightbox with swipe, keyboard nav, and zoom
 * @param {string[]} images - array of image URLs
 * @param {number} initialIndex - starting image index
 * @param {boolean} isOpen - whether lightbox is visible
 * @param {Function} onClose - close callback
 */
export default function Lightbox({ images, initialIndex = 0, isOpen, onClose }) {
  const [current, setCurrent] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragOffset = useRef(0);
  const imageRef = useRef(null);

  const total = images?.length || 0;
  const hasMultiple = total > 1;

  const goTo = useCallback(
    (index) => {
      setCurrent(((index % total) + total) % total);
      setZoomed(false);
    },
    [total],
  );

  const next = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (hasMultiple) goTo(current + 1);
  };

  const prev = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (hasMultiple) goTo(current - 1);
  };

  const close = () => {
    setZoomed(false);
    onClose();
  };

  // ── Keyboard ──
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      switch (e.key) {
        case 'Escape':
          close();
          break;
        case 'ArrowLeft':
          prev(e);
          break;
        case 'ArrowRight':
          next(e);
          break;
        case '+':
        case '=':
          setZoomed(true);
          break;
        case '-':
          setZoomed(false);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, current, hasMultiple]);

  // ── Lock body scroll ──
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ── Touch handlers ──
  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      // pinch — toggle zoom
      setZoomed((z) => !z);
      return;
    }
    dragStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  };
  const onTouchMove = (e) => {
    if (!isDragging) return;
    dragOffset.current = dragStartX.current - e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    setIsDragging(false);
    const diff = dragOffset.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
    }
    dragOffset.current = 0;
  };

  // ── Mouse drag ──
  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    dragStartX.current = e.clientX;
    setIsDragging(true);
    e.preventDefault();
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    dragOffset.current = dragStartX.current - e.clientX;
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

  // ── Double-click to zoom ──
  const onDoubleClick = (e) => {
    e.stopPropagation();
    setZoomed((z) => !z);
  };

  // ── Click backdrop to close ──
  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  if (!isOpen || total === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fadeIn"
      onClick={onBackdropClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
        <div className="text-white/80 text-sm font-medium">
          {current + 1} <span className="text-white/40">/</span> {total}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomed((z) => !z)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
          >
            {zoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
          </button>
          <button
            onClick={close}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close lightbox"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* ── Navigation arrows ── */}
      {hasMultiple && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-sm transition-all active:scale-90"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-sm transition-all active:scale-90"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* ── Image ── */}
      <div className="flex items-center justify-center w-full h-full p-4 md:p-8">
        <img
          ref={imageRef}
          src={images[current]}
          alt={`Image ${current + 1} of ${total}`}
          className={`select-none transition-transform duration-300 ease-out ${
            zoomed
              ? 'cursor-zoom-out scale-150 max-w-none max-h-none'
              : 'cursor-zoom-in max-w-full max-h-full object-contain'
          }`}
          onClick={onDoubleClick}
          onDoubleClick={onDoubleClick}
          draggable={false}
          style={{
            ...(zoomed && imageRef.current
              ? { transformOrigin: 'center center' }
              : {}),
          }}
        />
      </div>

      {/* ── Bottom dots (mobile-optimized) ── */}
      {hasMultiple && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
              className={`rounded-full transition-all duration-200 ${
                i === current
                  ? 'bg-white w-5 h-2'
                  : 'bg-white/40 hover:bg-white/60 w-2 h-2'
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── Inline styles for fadeIn animation ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
