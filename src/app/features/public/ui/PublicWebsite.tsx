import { useState } from 'react';
import { TSNavbar } from './components/TSNavbar';
import { TSHero } from './components/TSHero';
import { TSFeatures } from './components/TSFeatures';
import { TSWorkflowDiagram } from './components/TSWorkflowDiagram';
import { TSInteractiveDemo } from './components/TSInteractiveDemo';
import { TSAnalytics } from './components/TSAnalytics';
import { TSCTA } from './components/TSCTA';
import { TSFooter } from './components/TSFooter';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { useSmoothScroll } from './hooks/useSmoothScroll';

const PublicWebsite = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Initialize smooth scroll engine
  useSmoothScroll(preloaderDone);

  return (
    <div className="relative min-h-screen text-white selection:bg-white selection:text-black antialiased overflow-x-hidden font-sans bg-black">
      {/* Branded Preloader */}
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

      {/* Desktop Custom Magnetic Cursor */}
      <CustomCursor />

      {/* Floating Monochromatic Awwwards Navigation */}
      <TSNavbar />

      {/* Main Experience Flow */}
      <main className="relative z-10">
        {/* 1. Hero Section with 3D Card + Collaboration Network (#1) */}
        <TSHero />

        {/* 2. Visual Features Grid with Monochromatic 3D Tilt Cards */}
        <TSFeatures />

        {/* 3. Interactive Workflow Architecture (React Flow) */}
        <TSWorkflowDiagram />

        {/* 4. Live Visual Feature & Product Demo (Interactive Kanban Simulator, Gemini Copilot, & 3D Spatial Canvas #2) */}
        <TSInteractiveDemo />

        {/* 5. 3D Telemetry Matrix (#3) + Predictive Recharts */}
        <TSAnalytics />

        {/* 6. Closing High-Impact Call to Action (100% Free / No Payment Required) */}
        <TSCTA />
      </main>

      {/* Architectural Mega-Footer */}
      <TSFooter />
    </div>
  );
};

export default PublicWebsite;
