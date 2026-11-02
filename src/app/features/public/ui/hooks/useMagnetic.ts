import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface MagneticOptions {
  strength?: number;
  duration?: number;
}

export const useMagnetic = <T extends HTMLElement = HTMLButtonElement>(options: MagneticOptions = {}) => {
  const elementRef = useRef<T | null>(null);
  const { strength = 0.35, duration = 0.6 } = options;

  useEffect(() => {
    const el = elementRef.current;
    if (!el || typeof window === 'undefined') return;

    // Skip on touch devices or reduced motion
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(el, {
        x: deltaX,
        y: deltaY,
        duration,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: duration * 1.2,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(el);
    };
  }, [strength, duration]);

  return elementRef;
};

