import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState<string>('');
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'view' | 'drag'>('default');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device supports hover
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // quickTo for ultra-smooth 60fps tracking
    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power2.out' });
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power2.out' });
    const setRingX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
    const setRingY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      setDotX(e.clientX);
      setDotY(e.clientY);
      setRingX(e.clientX);
      setRingY(e.clientY);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest<HTMLElement>('a, button, [role="button"], [data-cursor]');

      if (interactiveEl) {
        const customType = interactiveEl.getAttribute('data-cursor');
        const customLabel = interactiveEl.getAttribute('data-cursor-text') || '';

        if (customType === 'view') {
          setCursorState('view');
          setCursorText(customLabel || 'VIEW');
        } else if (customType === 'drag') {
          setCursorState('drag');
          setCursorText(customLabel || 'DRAG');
        } else {
          setCursorState('hover');
          setCursorText('');
        }
      } else {
        setCursorState('default');
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div
      className={`custom-cursor-element pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Precision Center Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-indigo-400 transition-transform duration-150 ${
          cursorState === 'hover' ? 'scale-0' : 'scale-100'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* Fluid Outer Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full border border-indigo-400/40 transition-all duration-300 ${
          cursorState === 'default'
            ? '-ml-5 -mt-5 h-10 w-10 bg-indigo-500/5 backdrop-blur-[1px]'
            : cursorState === 'hover'
            ? '-ml-7 -mt-7 h-14 w-14 border-indigo-300 bg-indigo-500/15 backdrop-blur-[2px]'
            : '-ml-9 -mt-9 h-18 w-18 border-cyan-400 bg-slate-900/80 backdrop-blur-md shadow-lg shadow-cyan-500/20'
        }`}
        style={{ willChange: 'transform' }}
      >
        {cursorText && (
          <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-300 select-none">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};

