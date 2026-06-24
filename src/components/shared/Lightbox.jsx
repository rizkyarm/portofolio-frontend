import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

/**
 * Fullscreen lightbox with swipe, keyboard nav, and zoom.
 * Content is strictly constrained within the viewport — no overflow, no scroll leaks.
 */
export default function Lightbox({ images, initialIndex = 0, isOpen, onClose }) {
  const [current, setCurrent] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const dragStartX = useRef(0);
  const dragMoved = useRef(false);
  const stageRef = useRef(null);

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

  const close = useCallback(() => {
    setZoomed(false);
    onClose();
  }, [onClose]);

  // ── Keyboard ──
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      switch (e.key) {
        case 'Escape':  close(); break;
        case 'ArrowLeft':  prev(e); break;
        case 'ArrowRight': next(e); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, current, hasMultiple, close]);

  // ── Lock body scroll & position ──
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // ── Pointer-event-based drag (unified touch + mouse) ──
  const onPointerDown = (e) => {
    dragStartX.current = e.clientX;
    dragMoved.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    if (Math.abs(dragStartX.current - e.clientX) > 5) {
      dragMoved.current = true;
    }
  };

  const onPointerUp = (e) => {
    const el = e.currentTarget;
    if (!el.hasPointerCapture(e.pointerId)) return;
    el.releasePointerCapture(e.pointerId);

    if (!dragMoved.current) return;
    const dx = dragStartX.current - e.clientX;
    if (Math.abs(dx) > 40) {
      dx > 0 ? goTo(current + 1) : goTo(current - 1);
    }
  };

  // Click the dark area around the image → close
  const onStageClick = (e) => {
    if (dragMoved.current) return;
    if (e.target === stageRef.current) close();
  };

  // Double-click / double-tap image → toggle zoom
  const onImageDoubleClick = (e) => {
    e.stopPropagation();
    setZoomed((z) => !z);
  };

  if (!isOpen || total === 0) return null;

  const TOP_H = 52;       // top bar height
  const BOTTOM_H = hasMultiple ? 44 : 0; // bottom dots height

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden bg-black/95 backdrop-blur-sm"
      style={{ animation: 'lbFadeIn 0.2s ease-out' }}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* ═══════════════ Top bar ═══════════════ */}
      <div
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4"
        style={{
          height: TOP_H,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)',
        }}
      >
        <span className="text-white/80 text-sm font-medium select-none tabular-nums">
          {current + 1}&nbsp;<span className="text-white/40">/</span>&nbsp;{total}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomed((z) => !z)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors active:scale-90"
            aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
          >
            {zoomed ? <ZoomOut size={17} /> : <ZoomIn size={17} />}
          </button>
          <button
            onClick={close}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors active:scale-90"
            aria-label="Close lightbox"
          >
            <X size={19} />
          </button>
        </div>
      </div>

      {/* ═══════════════ Image stage ═══════════════ */}
      <div
        ref={stageRef}
        className="absolute z-10"
        style={{
          top: TOP_H,
          bottom: BOTTOM_H,
          left: 0,
          right: 0,
          overflow: zoomed ? 'auto' : 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}
        onClick={onStageClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Centering flex wrapper */}
        <div
          className="flex items-center justify-center p-4 md:p-6"
          style={zoomed ? { minHeight: '100%', minWidth: '100%' } : { height: '100%', width: '100%' }}
        >
          <img
            src={images[current]}
            alt={`Image ${current + 1} of ${total}`}
            className={`select-none transition-transform duration-300 ease-out ${
              zoomed
                ? 'cursor-zoom-out scale-[2] origin-center'
                : 'cursor-zoom-in max-w-full max-h-full object-contain'
            }`}
            onDoubleClick={onImageDoubleClick}
            draggable={false}
          />
        </div>
      </div>

      {/* ═══════════════ Nav arrows ═══════════════ */}
      {hasMultiple && (
        <>
          <button
            onClick={prev}
            className="absolute z-30 left-2 md:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-sm transition-all active:scale-90"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={next}
            className="absolute z-30 right-2 md:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-sm transition-all active:scale-90"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* ═══════════════ Bottom dots ═══════════════ */}
      {hasMultiple && (
        <div
          className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-center gap-2"
          style={{ height: BOTTOM_H }}
        >
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

      {/* ═══════════════ Inline keyframes ═══════════════ */}
      <style>{`
        @keyframes lbFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
