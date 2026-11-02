import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  metric: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      'Team-Sync replaced four separate disconnected project apps. The Executive AI Briefing every morning highlights bottlenecks before our standup even starts.',
    author: 'Devon Vance',
    role: 'VP of Product Engineering',
    company: 'HyperScale Cloud',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
    metric: '+35% Engineering Throughput',
  },
  {
    quote:
      'Having task boards, department owners, and Gemini contextual intelligence unified in one interface changed how our entire organization collaborates.',
    author: 'Sophia Sterling',
    role: 'Head of Technical Operations',
    company: 'Fintech Nexus',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
    metric: 'Zero Unassigned Deliverables',
  },
  {
    quote:
      'The speed and clarity of Team-Sync is unmatched. Handoffs between our Design system team and Core Engineers are finally synchronized without endless status chasing.',
    author: 'Julian Thorne',
    role: 'Principal Design Technologist',
    company: 'Aura Studio',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
    metric: '4.2x Faster Handoffs',
  },
];

export const TestimonialDeck = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, [currentIndex]);

  const current = testimonials[currentIndex];

  return (
    <section className="relative py-24 sm:py-36 bg-[#070a12] text-white overflow-hidden border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <p className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-400">
              TRUSTED BY ENGINEERING &amp; PRODUCT LEADERS
            </p>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Built for teams who ship.
            </h2>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              data-cursor="pointer"
              aria-label="Previous Testimonial"
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white hover:bg-white/15 hover:border-white/30 transition-all"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              data-cursor="pointer"
              aria-label="Next Testimonial"
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white hover:bg-white/15 hover:border-white/30 transition-all"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Testimonial Stage Card */}
        <div className="mt-12">
          <div
            ref={cardRef}
            className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 sm:p-12 lg:p-16 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
          >
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

            <div className="flex items-center gap-1 text-amber-400 mb-6">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="fill-current text-sm" />
              ))}
            </div>

            <p className="font-display text-xl sm:text-3xl lg:text-4xl font-bold leading-relaxed text-slate-100 max-w-4xl">
              &ldquo;{current.quote}&rdquo;
            </p>

            <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={current.avatar}
                  alt={current.author}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-indigo-500/40"
                />
                <div>
                  <h4 className="font-display text-base font-bold text-white">{current.author}</h4>
                  <p className="text-xs text-slate-400 font-sans">
                    {current.role} • <span className="text-slate-300">{current.company}</span>
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 font-mono text-xs text-indigo-300 self-start sm:self-center">
                {current.metric}
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                data-cursor="pointer"
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === i ? 'w-8 bg-indigo-500' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

