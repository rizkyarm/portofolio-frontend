import { useRef, useState, useEffect } from 'react';

/**
 * 
 * @param {number} threshold - Visibility threshold (0-1). Default: 0.15
 * @returns {[React.RefObject, boolean]}
 */
export default function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el); // Stop observing once visible
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}
