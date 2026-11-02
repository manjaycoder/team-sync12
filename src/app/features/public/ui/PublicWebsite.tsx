import { useState } from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BenefitsGrid } from './components/BenefitsGrid';
import { InteractiveShowcase } from './components/InteractiveShowcase';
import { BentoFeatures } from './components/BentoFeatures';
import { WorkflowTimeline } from './components/WorkflowTimeline';
import { TestimonialDeck } from './components/TestimonialDeck';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';

const PublicWebsite = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Initialize Lenis smooth scroll engine
  useSmoothScroll(preloaderDone);

  return (
    <div className="relative min-h-screen bg-[#090d16] text-white selection:bg-indigo-500/30 selection:text-indigo-200 antialiased overflow-x-hidden">
      {/* Branded Preloader */}
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

      {/* Desktop Custom Magnetic Cursor */}
      <CustomCursor />

      {/* Adaptive Floating Glass Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection />

        {/* The Value / Platform Section */}
        <BenefitsGrid />

        {/* Live Interactive Product Simulator */}
        <InteractiveShowcase />

        {/* Features Bento Grid */}
        <BentoFeatures />

        {/* Workflow / How It Works */}
        <WorkflowTimeline />

        {/* Testimonials Deck */}
        <TestimonialDeck />

        {/* High-Impact Closing CTA */}
        <CTASection />
      </main>

      {/* Architectural Mega-Footer */}
      <Footer />
    </div>
  );
};

export default PublicWebsite;
