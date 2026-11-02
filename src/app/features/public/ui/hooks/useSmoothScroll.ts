import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useSmoothScroll = (enabled = true) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Check if user prefers reduced motion or is on mobile
    const isMobile = window.innerWidth < 768;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !isMobile,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    const handleScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on('scroll', handleScroll);

    // Synchronize GSAP Ticker with Lenis RAF loop
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Intercept internal hash anchor link clicks to smooth scroll with Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          lenis.scrollTo(element as HTMLElement, { offset: -80, duration: 1.4 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.off('scroll', handleScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  const scrollTo = (target: string | HTMLElement, offset = -80) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset, duration: 1.3 });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return { lenis: lenisRef.current, scrollTo };
};

