import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar, Compass } from 'lucide-react';
import CinematicSmoke from './CinematicSmoke';
import FireSparks from './FireSparks';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const compRef = useRef(null);
  const introOverlayRef = useRef(null);
  const introTextRef = useRef(null);
  const introSubRef = useRef(null);
  const heroVisualRef = useRef(null);
  const videoRef = useRef(null);
  const heroContentRef = useRef(null);
  const mainHeadingRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  // Temporary debug mode for verification (toggleable via query ?debug=smoke or internal state)
  const [debugSmoke, setDebugSmoke] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('debug=smoke')) {
      setDebugSmoke(true);
    }
  }, []);

  // 1. Video Autoplay & Inline Playback Handling
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Handled gracefully if browser strictly pauses video
        });
      }
    }
  }, []);

  // 2. GSAP Master Cinematic Entrance Timeline & Scroll Parallax
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        if (introOverlayRef.current) introOverlayRef.current.style.display = 'none';
        gsap.set([heroVisualRef.current, heroContentRef.current], {
          opacity: 1,
          visibility: 'visible',
        });
        return;
      }

      // Initial States
      gsap.set(introOverlayRef.current, { opacity: 1, visibility: 'visible', display: 'flex' });
      gsap.set(introTextRef.current, { opacity: 0, y: 18, letterSpacing: '0.2em' });
      gsap.set(introSubRef.current, { opacity: 0, y: 10 });
      gsap.set(heroVisualRef.current, { opacity: 0, scale: 1.04 });
      gsap.set(mainHeadingRef.current, { opacity: 0, y: 40 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 20 });
      gsap.set(buttonsRef.current?.children || [], { opacity: 0, y: 18 });
      gsap.set(scrollIndicatorRef.current, { opacity: 0 });

      // Master Timeline:
      // 0.0s: Black background visible
      // 0.2s: Restaurant name begins revealing
      // 1.5s: Intro transitions into the ultra-realistic grilling scene
      // 1.8s: Main heading begins revealing
      // 2.2s: Subtitle appears
      // 2.5s: Buttons appear with subtle stagger
      const masterTl = gsap.timeline();

      // 0.2s: Intro text reveal
      masterTl.to(
        introTextRef.current,
        {
          opacity: 1,
          y: 0,
          letterSpacing: '0.3em',
          duration: 0.9,
          ease: 'power3.out',
        },
        0.2
      );

      masterTl.to(
        introSubRef.current,
        {
          opacity: 0.8,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
        0.5
      );

      // 1.5s: Intro transitions smoothly into the cinematic grilling visual
      masterTl.to(
        introOverlayRef.current,
        {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            // Completely hide intro overlay so normal scrolling NEVER restarts or triggers it
            if (introOverlayRef.current) {
              introOverlayRef.current.style.pointerEvents = 'none';
              introOverlayRef.current.style.display = 'none';
            }
          },
        },
        1.5
      );

      // Reveal Cinematic Video & Atmospheric Scene smoothly
      masterTl.to(
        heroVisualRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: 'power3.out',
        },
        1.5
      );

      // 1.8s: Main heading reveals smoothly from below
      masterTl.to(
        mainHeadingRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power3.out',
        },
        1.8
      );

      // 2.2s: Subtitle appears
      masterTl.to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        2.2
      );

      // 2.5s: Buttons appear with subtle stagger
      masterTl.to(
        buttonsRef.current?.children || [],
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.14,
          ease: 'power3.out',
        },
        2.5
      );

      // 2.8s: Subtle scroll hint reveal
      masterTl.to(
        scrollIndicatorRef.current,
        {
          opacity: 0.7,
          duration: 0.8,
          ease: 'power2.out',
        },
        2.8
      );

      // Scroll Interaction via ScrollTrigger:
      // Subtle parallax movement to hero background grilling scene while scrolling
      // Heading moves slightly upward and fades naturally
      ScrollTrigger.create({
        trigger: compRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        animation: gsap
          .timeline()
          .to(
            heroVisualRef.current,
            {
              yPercent: 16,
              ease: 'none',
            },
            0
          )
          .to(
            heroContentRef.current,
            {
              y: -50,
              opacity: 0.15,
              ease: 'none',
            },
            0
          ),
      });
    }, compRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={compRef}
      id="home"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#080808]"
    >
      {/* ========================================================
          INITIAL INTRO OVERLAY (0.0s - 1.5s brand intro)
          Hidden completely on completion to prevent restart on scroll.
          ======================================================== */}
      <div
        ref={introOverlayRef}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080808] pointer-events-auto"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <div className="w-10 h-10 mb-2 rounded-sm border border-[#C1121F]/40 bg-gradient-to-br from-[#1a0607] to-[#080808] flex items-center justify-center shadow-[0_0_25px_rgba(193,18,31,0.25)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C1121F] shadow-[0_0_12px_#FF4500]"></span>
          </div>

          <h2
            ref={introTextRef}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.25em] text-white uppercase"
          >
            GRILL ISLAND
          </h2>

          <p
            ref={introSubRef}
            className="text-[11px] sm:text-xs font-sans tracking-[0.4em] text-neutral-400 uppercase font-medium"
          >
            HAUTE CUISINE SUR FEU DE BOIS
          </p>

          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C1121F]/60 to-transparent mt-4"></div>
        </div>
      </div>

      {/* ========================================================
          STRICT LAYER STACKING:
          Layer 1: Background grilling video
          Layer 2: Cinematic smoke overlay (CinematicSmoke)
          Layer 3: Fire sparks (FireSparks)
          Layer 4: Dark gradient for readability
          Layer 5: Heading, buttons, and navigation
          ======================================================== */}
      <div
        ref={heroVisualRef}
        className="absolute inset-0 w-full h-full will-change-transform pointer-events-none overflow-hidden"
      >
        {/* ----------------------------------------------------
            LAYER 1: Background grilling video
            ---------------------------------------------------- */}
        <div className="absolute inset-0 w-full h-full z-[1]">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            preload="auto"
            poster="/hero-grill-poster.jpg"
            className="w-full h-full object-cover object-center transform-gpu scale-105"
          >
            <source src="/hero-grill.webm" type="video/webm" />
            <source src="/hero-grill.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Optical heat shimmer band directly above grill grates */}
          <div className="absolute inset-x-0 bottom-[18%] h-[32%] pointer-events-none heat-distortion-band"></div>

          {/* Natural hearth firelight flicker aura */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,87,34,0.16)_0%,rgba(193,18,31,0.06)_45%,transparent_70%)] animate-hearth-flicker pointer-events-none"></div>
        </div>

        {/* ----------------------------------------------------
            LAYER 2: Cinematic smoke overlay (Clearly visible, dense, illuminated)
            ---------------------------------------------------- */}
        <CinematicSmoke debug={debugSmoke} />

        {/* ----------------------------------------------------
            LAYER 3: Fire sparks (Glow orange & gold, drift upward)
            ---------------------------------------------------- */}
        <FireSparks />

        {/* ----------------------------------------------------
            LAYER 4: Dark gradient for readability (Balanced luxury contrast)
            Allows dense smoke, fire embers, and video to shine through with full vibrancy
            ---------------------------------------------------- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-[4]">
          {/* Vignette focus: clear center (0%-45%), soft cinema edge (80%-100%) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,8,8,0.10)_45%,rgba(8,8,8,0.58)_80%,#080808_100%)]"></div>

          {/* Top navbar contrast darkening */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#080808]/85 via-[#080808]/30 to-transparent"></div>

          {/* Bottom edge transition */}
          <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#080808]/90 via-[#080808]/35 to-transparent"></div>
        </div>
      </div>

      {/* SVG Filters for Optical Heat Shimmer */}
      <svg className="absolute w-0 h-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <defs>
          <filter id="heat-shimmer" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.035"
              numOctaves="2"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="9s"
                values="0.012 0.035; 0.018 0.055; 0.012 0.035"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="3.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* ========================================================
          LAYER 5: Heading, buttons, and navigation (Unchanged Layout & Styling)
          Positioned above all VFX layers (z-[5]) with crisp drop-shadows.
          ======================================================== */}
      <div
        ref={heroContentRef}
        className="relative z-[5] max-w-5xl mx-auto px-6 sm:px-8 text-center pt-28 pb-16 md:pt-32 flex flex-col items-center justify-center will-change-transform"
      >
        {/* Subtle Luxury Eyebrow Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm mb-6 sm:mb-8 transition-colors duration-300 hover:border-[#C1121F]/40">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C1121F] shadow-[0_0_8px_#FF4500]"></span>
          <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.3em] text-neutral-300 font-medium">
            Prime Cuts • Live Fire • Wood Smoked
          </span>
        </div>

        {/* Main Heading: WHERE FIRE MEETS FLAVOUR */}
        <h1
          ref={mainHeadingRef}
          className="font-serif font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.08] tracking-[0.04em] text-white uppercase drop-shadow-[0_4px_28px_rgba(0,0,0,0.9)] max-w-4xl"
        >
          WHERE FIRE MEETS <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400">FLAVOUR</span>
        </h1>

        {/* Elegant Accent Separator Line */}
        <div className="flex items-center gap-3 my-6 sm:my-8 opacity-60">
          <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C1121F]"></span>
          <span className="w-1.5 h-1.5 rotate-45 border border-[#C1121F] bg-[#080808]"></span>
          <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C1121F]"></span>
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-sans text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl font-light leading-relaxed tracking-wide mb-10 sm:mb-12 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
        >
          Experience the Art of Authentic Grilling.
        </p>

        {/* 4. CALL TO ACTION BUTTONS */}
        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md sm:max-w-none"
        >
          {/* Button 1: EXPLORE MENU */}
          <a
            href="#menu"
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-sm bg-[#121316] text-white border border-white/[0.12] hover:border-[#C1121F]/80 hover:bg-[#18191e] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] luxury-btn-primary"
          >
            <Compass size={16} className="text-[#C1121F] transition-transform duration-300 group-hover:rotate-45" />
            <span className="text-xs uppercase font-medium tracking-[0.25em]">
              EXPLORE MENU
            </span>
            <ArrowRight
              size={15}
              className="text-neutral-400 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-white"
            />
          </a>

          {/* Button 2: BOOK A TABLE */}
          <a
            href="#book"
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-sm bg-gradient-to-r from-[#A70F1A] via-[#C1121F] to-[#910D16] text-white border border-[#C1121F]/40 hover:border-[#FF4500]/60 hover:from-[#B8121E] hover:to-[#A70F1A] transition-all duration-300 shadow-[0_6px_25px_rgba(193,18,31,0.32)] luxury-btn-primary"
          >
            <Calendar size={16} className="text-white/90" />
            <span className="text-xs uppercase font-semibold tracking-[0.25em]">
              BOOK A TABLE
            </span>
            <ArrowRight
              size={15}
              className="text-white/90 transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </a>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[5] flex flex-col items-center gap-2 pointer-events-none select-none transition-opacity duration-300"
      >
        <span className="text-[9px] uppercase tracking-[0.35em] text-neutral-400 font-medium">
          SCROLL
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#C1121F] to-transparent animate-pulse"></div>
      </div>
    </section>
  );
}
