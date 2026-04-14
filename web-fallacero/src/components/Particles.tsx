import React, { useRef, useEffect } from 'react';

type Particle = { x: number; y: number; vx: number; vy: number; r: number; hue: number };

export default function Particles({ density = 60, hueBase = 30, hueVariance = 12, fullScreen = false }: { density?: number, hueBase?: number, hueVariance?: number, fullScreen?: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let particles: Particle[] = [];
    const DPR = window.devicePixelRatio || 1;

    const resize = () => {
      const w = fullScreen ? window.innerWidth : (canvas.clientWidth || window.innerWidth);
      const h = fullScreen ? window.innerHeight : (canvas.clientHeight || window.innerHeight);
      canvas.width = Math.max(1, Math.floor(w * DPR));
      canvas.height = Math.max(1, Math.floor(h * DPR));
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      initParticles();
    };

    const initParticles = () => {
      const w = canvas.width / DPR;
      const h = canvas.height / DPR;
      particles = [];
      for (let i = 0; i < density; i++) {
        const hue = hueBase - hueVariance/2 + Math.random() * hueVariance;
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 0.8 + Math.random() * 3.2,
          hue,
        });
      }
    };

    const step = () => {
      const w = canvas.width / DPR;
      const h = canvas.height / DPR;
      ctx.clearRect(0, 0, w, h);
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        grd.addColorStop(0, `hsla(${p.hue},70%,65%,0.9)`);
        grd.addColorStop(0.6, `hsla(${p.hue},70%,65%,0.12)`);
        grd.addColorStop(1, `hsla(${p.hue},70%,65%,0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(step);
    };

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // don't animate
      resize();
      step();
    } else {
      resize();
      raf = requestAnimationFrame(step);
      window.addEventListener('resize', resize);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [density]);

  return <canvas ref={ref} className={`particles-canvas${fullScreen ? ' fullscreen' : ''}`} aria-hidden />;
}
