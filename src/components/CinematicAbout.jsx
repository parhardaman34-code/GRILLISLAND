import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame, Sparkles, Utensils, Compass, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 195;

const getFramePath = (index) => {
  const padded = String(index).padStart(3, '0');
  return `/images/grill-sequence/ezgif-frame-${padded}.jpg`;
};

export default function CinematicAbout() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  // Scene Card Refs
  const scene1Ref = useRef(null);
  const scene2Ref = useRef(null);
  const scene3Ref = useRef(null);
  const scene4Ref = useRef(null);

  // Preloader state
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId;
    const images = [];
    let currentFrameIndex = 0;
    let targetFrameIndex = 0;

    // Handle responsive high-DPI canvas sizing
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.scale(dpr, dpr);
      renderFrame(Math.round(currentFrameIndex));
    };

    // Draw frame with 'object-fit: cover' mathematics
    const renderFrame = (index) => {
      const img = images[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      const hRatio = w / img.naturalWidth;
      const vRatio = h / img.naturalHeight;
      const ratio = Math.max(hRatio, vRatio);

      const renderW = img.naturalWidth * ratio;
      const renderH = img.naturalHeight * ratio;
      const offsetX = (w - renderW) / 2;
      const offsetY = (h - renderH) / 2;

      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    };

    // Preload image sequence progressively
    let loaded = 0;
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === 1) {
          // Render first frame immediately
          renderFrame(0);
        }
        if (loaded >= 15) {
          setIsReady(true);
        }
      };
      images.push(img);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Smooth render loop using requestAnimationFrame
    const tick = () => {
      // Lerp frame index for cinematic butter-smooth scrubbing
      const diff = targetFrameIndex - currentFrameIndex;
      if (Math.abs(diff) > 0.01) {
        currentFrameIndex += diff * 0.18;
        const frameToDraw = THREE_CLAMP(Math.round(currentFrameIndex), 0, TOTAL_FRAMES - 1);
        renderFrame(frameToDraw);
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    const THREE_CLAMP = (val, min, max) => Math.max(min, Math.min(max, val));
    tick();

    // ==========================================
    // GSAP SCROLLTRIGGER PINNED SEQUENCE
    // ==========================================
    const masterTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        // Map 0 -> 1 progress to 0 -> 194 frame index
        targetFrameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, p * (TOTAL_FRAMES - 1)));
      },
    });

    // ==========================================
    // SYNCHRONIZED 4-SCENE TEXT TIMELINE
    // ==========================================
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
      },
    });

    // SCENE 1: 0% TO 25% SCROLL PROGRESS
    // "THE ART OF FIRE"
    textTl
      .fromTo(
        scene1Ref.current,
        { opacity: 0, y: 35, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.12, ease: 'power2.out' },
        0.02
      )
      .to(
        scene1Ref.current,
        { opacity: 0, y: -25, filter: 'blur(6px)', duration: 0.08, ease: 'power2.in' },
        0.22
      )

      // SCENE 2: 25% TO 50% SCROLL PROGRESS
      // "CRAFTED BY FLAME"
      .fromTo(
        scene2Ref.current,
        { opacity: 0, y: 35, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.12, ease: 'power2.out' },
        0.28
      )
      .to(
        scene2Ref.current,
        { opacity: 0, y: -25, filter: 'blur(6px)', duration: 0.08, ease: 'power2.in' },
        0.48
      )

      // SCENE 3: 50% TO 75% SCROLL PROGRESS
      // "EVERY FLAME TELLS A STORY"
      .fromTo(
        scene3Ref.current,
        { opacity: 0, y: 35, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.12, ease: 'power2.out' },
        0.54
      )
      .to(
        scene3Ref.current,
        { opacity: 0, y: -25, filter: 'blur(6px)', duration: 0.08, ease: 'power2.in' },
        0.72
      )

      // SCENE 4: 75% TO 100% SCROLL PROGRESS
      // "THE STORY BEHIND THE FLAME"
      .fromTo(
        scene4Ref.current,
        { opacity: 0, y: 40, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.14, ease: 'power2.out' },
        0.78
      );

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      masterTrigger.kill();
      textTl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full h-[450vh] bg-[#080808] text-white selection:bg-[#C1121F] selection:text-white"
    >
      {/* ========================================================
          PINNED CINEMATIC VIEWPORT (Sticky 100vh)
          ======================================================== */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Canvas for High-Performance Image Sequence */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 block pointer-events-none"
        />

        {/* Ambient Luxury Dark Vignettes (Guarantees text pops with crystal contrast) */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,rgba(8,8,8,0.15)_0%,rgba(8,8,8,0.65)_75%,#080808_100%)]" />
        <div className="absolute top-0 inset-x-0 h-44 pointer-events-none z-10 bg-gradient-to-b from-[#080808] via-[#080808]/70 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-44 pointer-events-none z-10 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent" />

        {/* Directional side gradients for scene narrative cards */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-2/5 pointer-events-none z-10 bg-gradient-to-r from-[#080808]/85 via-[#080808]/40 to-transparent" />
        <div className="hidden lg:block absolute inset-y-0 right-0 w-2/5 pointer-events-none z-10 bg-gradient-to-l from-[#080808]/85 via-[#080808]/40 to-transparent" />

        {/* Loading Progress Indicator (Subtle & Luxury) */}
        {!isReady && (
          <div className="absolute bottom-8 right-8 z-30 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4500] animate-pulse" />
            <span>Loading Sequence {Math.round((loadedCount / TOTAL_FRAMES) * 100)}%</span>
          </div>
        )}

        {/* ========================================================
            SCENE 1: 0% TO 25% SCROLL PROGRESS
            "THE ART OF FIRE"
            Camera approaches the flaming vegetarian grill
            ======================================================== */}
        <div
          ref={scene1Ref}
          className="absolute z-20 w-[92vw] max-w-xl left-4 sm:left-10 md:left-20 lg:left-28 top-1/2 -translate-y-1/2 pointer-events-none opacity-0"
        >
          <div className="p-7 sm:p-9 md:p-11 rounded-2xl bg-[#09090b]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#C1121F]/15 border border-[#C1121F]/30 text-[#FF4500] text-[10px] font-sans uppercase tracking-[0.3em] font-semibold mb-4 sm:mb-5">
              <Flame className="w-3.5 h-3.5 text-[#FF4500]" />
              <span>Haute Vegetarian Hearth</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.04em] text-white uppercase leading-[1.12] mb-4">
              THE ART OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-[#FF4500]">FIRE</span>
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light mb-6">
              Where fresh ingredients meet the magic of open flames. Every flavour is crafted with passion, precision, and a touch of fire.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.08]">
              <div>
                <span className="block text-xl sm:text-2xl font-serif font-bold text-white tracking-wider">
                  100%
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
                  Pure Vegetarian
                </span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-serif font-bold text-white tracking-wider">
                  Live Fire
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
                  Oak Wood Ember
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            SCENE 2: 25% TO 50% SCROLL PROGRESS
            "CRAFTED BY FLAME"
            Camera travels closer to the grill and charcoal
            ======================================================== */}
        <div
          ref={scene2Ref}
          className="absolute z-20 w-[92vw] max-w-xl right-4 sm:right-10 md:right-20 lg:right-28 top-1/2 -translate-y-1/2 pointer-events-none opacity-0"
        >
          <div className="p-7 sm:p-9 md:p-11 rounded-2xl bg-[#09090b]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#FF4500]/15 border border-[#FF4500]/30 text-[#FF8C00] text-[10px] font-sans uppercase tracking-[0.3em] font-semibold mb-4 sm:mb-5">
              <Utensils className="w-3.5 h-3.5 text-[#FF8C00]" />
              <span>Plant-Based Excellence</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.04em] text-white uppercase leading-[1.12] mb-4">
              CRAFTED BY <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-[#C1121F]">FLAME</span>
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light mb-6">
              From perfectly grilled paneer to smoky vegetables, every creation celebrates the beauty of vegetarian grilling.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-4 border-t border-white/[0.08]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] text-neutral-300 font-medium">
                <Sparkles className="w-3 h-3 text-[#FFD700]" />
                Charcoal-Charred Paneer
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] text-neutral-300 font-medium">
                <Flame className="w-3 h-3 text-[#FF4500]" />
                Smoky Sweet Peppers
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] text-neutral-300 font-medium">
                <Compass className="w-3 h-3 text-[#C1121F]" />
                Forest Mushrooms
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            SCENE 3: 50% TO 75% SCROLL PROGRESS
            "EVERY FLAME TELLS A STORY"
            Camera approaches the glowing cracks in the charcoal
            ======================================================== */}
        <div
          ref={scene3Ref}
          className="absolute z-20 w-[92vw] max-w-xl left-4 sm:left-10 md:left-20 lg:left-28 top-1/2 -translate-y-1/2 pointer-events-none opacity-0"
        >
          <div className="p-7 sm:p-9 md:p-11 rounded-2xl bg-[#09090b]/90 backdrop-blur-xl border border-[#FF4500]/25 shadow-[0_25px_60px_rgba(255,69,0,0.15)]">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#FF4500]/15 border border-[#FF4500]/30 text-[#FFD700] text-[10px] font-sans uppercase tracking-[0.3em] font-semibold mb-4 sm:mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>The Memory</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.04em] text-white uppercase leading-[1.12] mb-4">
              EVERY FLAME <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-[#FFD700]">TELLS A STORY</span>
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light mb-6">
              More than a meal, it's a memory shaped by warmth, flavour, and unforgettable moments.
            </p>

            <div className="pt-4 border-t border-white/[0.08] flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF4500] shadow-[0_0_12px_#FFD700]" />
              <span className="text-xs uppercase tracking-[0.25em] text-neutral-300 font-medium">
                Haute Fire Gastronomy
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            SCENE 4: 75% TO 100% SCROLL PROGRESS
            "THE STORY BEHIND THE FLAME"
            Camera enters crack into darkness with central golden ember
            ======================================================== */}
        <div
          ref={scene4Ref}
          className="absolute z-20 w-[92vw] max-w-2xl text-center px-4 top-1/2 -translate-y-1/2 pointer-events-auto opacity-0 flex flex-col items-center"
        >
          <div className="p-8 sm:p-12 md:p-14 rounded-2xl bg-[#080808]/92 backdrop-blur-2xl border border-white/[0.08] shadow-[0_30px_70px_rgba(0,0,0,0.95)] max-w-2xl w-full">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-neutral-300 text-[10px] sm:text-xs font-sans uppercase tracking-[0.3em] font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C1121F] shadow-[0_0_8px_#FF4500]" />
              <span>GRILL ISLAND HERITAGE</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.04em] text-white uppercase leading-[1.1] mb-5">
              THE STORY BEHIND <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-[#FF8C00]">THE FLAME</span>
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base md:text-lg leading-relaxed font-light max-w-xl mx-auto mb-8">
              Discover a world where fresh ingredients, bold flavours, and the warmth of fire come together.
            </p>

            {/* Two Premium Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href="#menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-sm bg-gradient-to-r from-[#C1121F] to-[#a30f1a] text-white text-xs sm:text-sm font-sans uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:shadow-[0_0_25px_rgba(193,18,31,0.5)] hover:scale-[1.02]"
              >
                <span>EXPLORE OUR MENU</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#story"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-sm bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] hover:border-white/[0.25] text-white text-xs sm:text-sm font-sans uppercase tracking-[0.2em] font-semibold transition-all duration-300"
              >
                <span>DISCOVER OUR STORY</span>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Helper Cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2 opacity-50">
          <span className="text-[10px] tracking-[0.3em] text-neutral-400 uppercase font-light">
            Scroll to explore
          </span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-[#C1121F] to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
