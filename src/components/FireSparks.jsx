import React, { useEffect, useRef } from 'react';

export default function FireSparks() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;

    // Canvas resolution matched to viewport
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // ==========================================
    // REALISTIC FIRE SPARKS & EMBERS
    // ==========================================
    class Spark {
      constructor(isInitial = false) {
        this.reset(isInitial);
      }

      reset(isInitial = false) {
        // Emerge from the live coals and hot grill grates (24% to 76% screen width)
        this.x = width * (0.24 + Math.random() * 0.52);

        // Stagger initial sparks so they are visibly drifting from the start
        this.y = isInitial
          ? height * (0.25 + Math.random() * 0.65)
          : height * (0.68 + Math.random() * 0.20);

        // Buoyant convective upward drift
        this.vy = -(1.0 + Math.random() * 1.8);
        this.vx = (Math.random() - 0.5) * 0.75;

        // Thermal draft turbulence
        this.wobblePhase = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.018 + Math.random() * 0.032;
        this.wobbleAmp = 0.6 + Math.random() * 0.9;

        // Spark Size: Clear glowing sparks (1.6px to 3.2px, occasional 4.2px bright cinder)
        this.baseSize = 1.6 + Math.random() * 1.6;
        if (Math.random() < 0.12) this.baseSize = 3.8;
        this.size = this.baseSize;

        // Colors: Golden yellow, fiery orange, glowing amber red
        const colors = [
          { r: 255, g: 228, b: 60,  glow: '#FFD700' }, // Brilliant Gold
          { r: 255, g: 145, b: 15,  glow: '#FF8C00' }, // Fiery Amber
          { r: 255, g: 85,  b: 10,  glow: '#FF4500' }, // Vivid Red-Orange
          { r: 220, g: 30,  b: 35,  glow: '#C1121F' }, // Deep Ember Ruby
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        this.maxLife = 140 + Math.random() * 200;
        this.life = isInitial ? Math.random() * this.maxLife : this.maxLife;
        this.maxAlpha = 0.75 + Math.random() * 0.25;
        this.alpha = this.maxAlpha * 0.9;
      }

      update() {
        this.life--;
        if (this.life <= 0 || this.y < height * 0.05) {
          this.reset(false);
          return;
        }

        this.wobblePhase += this.wobbleSpeed;
        this.x += this.vx + Math.sin(this.wobblePhase) * this.wobbleAmp;
        this.y += this.vy;

        const progress = 1 - this.life / this.maxLife;

        if (progress < 0.10) {
          this.alpha = (progress / 0.10) * this.maxAlpha;
        } else {
          this.alpha = Math.max(0, (1 - progress) * this.maxAlpha);
        }

        this.size = Math.max(0.6, this.baseSize * (1 - progress * 0.28));
      }

      draw() {
        if (this.alpha <= 0.02) return;

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.shadowBlur = 8 + this.size * 3;
        ctx.shadowColor = this.color.glow;
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
        ctx.fill();
        ctx.restore();
      }
    }

    const sparks = Array.from({ length: 48 }, () => new Spark(true));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < sparks.length; i++) {
        sparks[i].update();
        sparks[i].draw();
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[3] overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
