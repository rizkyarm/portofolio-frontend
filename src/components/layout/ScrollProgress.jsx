import { useState, useEffect } from 'react';
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = (window.scrollY / totalHeight) * 100;
      setProgress(Math.min(scrolled, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (progress <= 0) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[2px] z-50">
      
      <div className="absolute inset-0 bg-white/[0.03]" />

      {/* Progress bar */}
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 transition-[width] duration-100 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-4 bg-emerald-400/50 blur-md rounded-full" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" />
      </div>
    </div>
  );
}
