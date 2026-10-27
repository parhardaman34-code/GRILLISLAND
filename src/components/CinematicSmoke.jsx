import React, { useEffect, useRef } from 'react';

export default function CinematicSmoke({ debug = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // ==========================================
    // REALISTIC VOLUMETRIC GRILL SMOKE
    // ==========================================
    class SmokeParticle {
      constructor(isInitial = false) {
        this.reset(isInitial);
      }

      reset(isInitial = false) {
        // Plumes rise directly from the sizzling meat and hot coals across the grill
        const anchors = [0.32, 0.38, 0.45, 0.50, 0.55, 0.62, 0.68];
        const anchor = anchors[Math.floor(Math.random() * anchors.length)];
        this.x = width * anchor + (Math.random() - 0.5) * (width * 0.08);

        // Origin at grill grates (62% to 76% height)
        this.y = isInitial
          ? height * (0.15 + Math.random() * 0.62)
          : height * (0.64 + Math.random() * 0.12);

        // Natural convective updraft
        this.vy = -(0.90 + Math.random() * 1.30);
        this.vx = (Math.random() - 0.5) * 0.50;

        // Gentle thermal wobble
        this.wobblePhase = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.012 + Math.random() * 0.018;
        this.wobbleAmp = 0.5 + Math.random() * 0.8;

        // Natural plume expansion: compact near meat, expanding into room
        this.initialRadius = 32 + Math.random() * 32;
        this.maxRadius = this.initialRadius * (2.8 + Math.random() * 1.4);
        this.radius = this.initialRadius;

        this.angle = Math.random() * Math.PI * 2;
        this.angularSpeed = (Math.random() - 0.5) * 0.006;

        this.maxLife = 260 + Math.random() * 240;
        this.life = isInitial ? Math.random() * this.maxLife : this.maxLife;

        // Balanced cinematic opacity: visibly clear smoke without obscuring the steaks
        this.maxAlpha = 0.24 + Math.random() * 0.16;
        this.alpha = this.maxAlpha * 0.85;

        // Natural Wood & Hearth Smoke Palettes
        const styles = [
          {
            // Firelight-kissed amber smoke
            core: { r: 245, g: 195, b: 145 },
            mid: { r: 230, g: 160, b: 105 },
            edge: { r: 180, g: 130, b: 90 },
          },
          {
            // Classic aromatic hickory woodsmoke (grey-white)
            core: { r: 235, g: 232, b: 230 },
            mid: { r: 205, g: 202, b: 202 },
            edge: { r: 160, g: 158, b: 160 },
          },
          {
            // Charcoal hearth mist
            core: { r: 240, g: 220, b: 205 },
            mid: { r: 210, g: 185, b: 172 },
            edge: { r: 155, g: 140, b: 135 },
          },
        ];
        this.palette = styles[Math.floor(Math.random() * styles.length)];
      }

      update() {
        this.life--;
        if (this.life <= 0 || this.y < height * 0.04) {
          this.reset(false);
          return;
        }

        this.wobblePhase += this.wobbleSpeed;
        this.x += this.vx + Math.sin(this.wobblePhase) * this.wobbleAmp;
        this.y += this.vy;
        this.angle += this.angularSpeed;

        const progress = 1 - this.life / this.maxLife;
        this.radius = this.initialRadius + (this.maxRadius - this.initialRadius) * Math.pow(progress, 0.70);

        // Organic smoke fade in and out
        if (progress < 0.15) {
          this.alpha = (progress / 0.15) * this.maxAlpha;
        } else if (progress > 0.60) {
          this.alpha = ((1 - progress) / 0.40) * this.maxAlpha;
        } else {
          this.alpha = this.maxAlpha;
        }
      }

      draw() {
        if (this.alpha <= 0.01) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Multi-stop soft volumetric feathered radial gradient
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
        const { core, mid, edge } = this.palette;

        grad.addColorStop(0, `rgba(${core.r}, ${core.g}, ${core.b}, ${this.alpha * 0.80})`);
        grad.addColorStop(0.30, `rgba(${mid.r}, ${mid.g}, ${mid.b}, ${this.alpha * 0.50})`);
        grad.addColorStop(0.68, `rgba(${edge.r}, ${edge.g}, ${edge.b}, ${this.alpha * 0.18})`);
        grad.addColorStop(1, `rgba(${edge.r}, ${edge.g}, ${edge.b}, 0)`);

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.restore();
      }
    }

    // 58 continuous smoke particles rising organically from the meat
    const smokeParticles = Array.from({ length: 58 }, () => new SmokeParticle(true));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < smokeParticles.length; i++) {
        smokeParticles[i].update();
        smokeParticles[i].draw();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[2] overflow-hidden">
      {/* 1. Procedural Volumetric Canvas Smoke (Soft, authentic plumes rising from meat) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
      />

      {/* 2. Soft Atmospheric Hearth Smoke Haze (Subtle continuous depth & warmth) */}
      <div className="absolute inset-0 pointer-events-none z-[1] smoke-cloud-layer-1"></div>
      <div className="absolute inset-0 pointer-events-none z-[1] smoke-cloud-layer-2"></div>
    </div>
  );
}
