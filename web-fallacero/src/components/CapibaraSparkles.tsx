import React, { useRef, useEffect } from 'react';

type Aura = { x:number; y:number; baseR:number; phase:number; hue:number };
type Spark = { cx:number; cy:number; orbit:number; angle:number; speed:number; size:number; hue:number };

export default function CapibaraSparkles({ count = 8 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    const DPR = Math.max(1, window.devicePixelRatio || 1);
    let auras: Aura[] = [];
    let sparks: Spark[] = [];

    const resize = () => {
      const parentRect = canvas.parentElement?.getBoundingClientRect();
      const w = parentRect?.width || 420;
      const h = parentRect?.height || 420;
      // add extra padding so aura can extend beyond image without clipping
      const padRatio = 0.44; // matches CSS expansion
      const padX = w * padRatio;
      const padY = h * padRatio;
      const totalW = w + padX;
      const totalH = h + padY;
      // set element size and position so canvas origin is offset left/top by half padding
      canvas.width = Math.max(1, Math.floor(totalW * DPR));
      canvas.height = Math.max(1, Math.floor(totalH * DPR));
      canvas.style.width = `${totalW}px`;
      canvas.style.height = `${totalH}px`;
      canvas.style.left = `-${padX / 2}px`;
      canvas.style.top = `-${padY / 2}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      // try to position aura around the actual capibara image if present
      const img = canvas.parentElement?.querySelector('img') as HTMLImageElement | null;
      let cx: number, cy: number;
      if (img) {
        const imgRect = img.getBoundingClientRect();
        // image center relative to parent top-left
        const imgCenterXRel = (imgRect.left - (parentRect?.left || 0)) + imgRect.width * 0.5;
        const imgCenterYRel = (imgRect.top - (parentRect?.top || 0)) + imgRect.height * 0.5;
        // because canvas was expanded by padX/padY and shifted left/top by half padding,
        // map image center into canvas coordinates by adding half padding
        cx = imgCenterXRel + (padX / 2);
        cy = imgCenterYRel + (padY / 2);
      } else {
        // fallback: center of parent
        cx = (parentRect?.width || 420) * 0.5 + (padX / 2);
        cy = (parentRect?.height || 420) * 0.46 + (padY / 2);
      }

      auras = [];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
        const r = 36 + Math.random() * 56;
        auras.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * (r * 0.7), baseR: 72 + Math.random() * 96, phase: Math.random() * Math.PI * 2, hue: 22 + Math.random() * 20 });
      }

      // sparks orbiting the capibara aura
      sparks = [];
      const sparkCount = Math.max(8, count * 5);
      for (let i = 0; i < sparkCount; i++) {
        const a = Math.random() * Math.PI * 2;
        const orbit = 48 + Math.random() * 120;
        const speed = (0.15 + Math.random() * 0.8) * (Math.random() > 0.5 ? 1 : -1);
        const size = 1.5 + Math.random() * 4;
        const hue = 28 + Math.random() * 22;
        sparks.push({ cx, cy, orbit, angle: a, speed, size, hue });
      }
    };

    let last = performance.now();
    const step = (nowT: number) => {
      const dt = Math.min(0.033, (nowT - last) / 1000);
      last = nowT;
      const w = canvas.width / DPR;
      const h = canvas.height / DPR;
      ctx.clearRect(0, 0, w, h);

      // additive blending for richer glow
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      const t = nowT / 1000;

      // large layered central glow
      if (auras.length > 0) {
        const mid = auras[0];
        const outerR = 120 + 24 * Math.sin(t * 1.1);
        const g = ctx.createRadialGradient(mid.x, mid.y + 10, 0, mid.x, mid.y + 10, outerR);
        g.addColorStop(0, `hsla(32,90%,62%,0.26)`);
        g.addColorStop(0.5, `hsla(32,85%,60%,0.08)`);
        g.addColorStop(1, `hsla(32,85%,60%,0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mid.x, mid.y + 10, outerR, 0, Math.PI * 2); ctx.fill();
      }

      // draw layered auras with smooth pulsing
      for (let a of auras) {
        const pulse = Math.pow(1 + 0.45 * Math.sin(t * 1.6 + a.phase), 2);
        const rMain = a.baseR * pulse;

        // three concentric soft gradients for depth
        const layers = [0.62, 0.28, 0.12];
        for (let i = 0; i < layers.length; i++) {
          const frac = layers[i];
          const r = rMain * (1 + i * 0.5);
          const grd = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, r);
          grd.addColorStop(0, `hsla(${a.hue},95%,60%,${0.26 * frac})`);
          grd.addColorStop(0.6, `hsla(${a.hue},85%,55%,${0.06 * frac})`);
          grd.addColorStop(1, `hsla(${a.hue},85%,55%,0)`);
          ctx.fillStyle = grd;
          ctx.beginPath(); ctx.arc(a.x, a.y, r, 0, Math.PI * 2); ctx.fill();
        }
      }

      // small orbiting sparkles
      for (let s of sparks) {
        s.angle += s.speed * dt;
        const x = s.cx + Math.cos(s.angle) * s.orbit;
        const y = s.cy + Math.sin(s.angle) * (s.orbit * 0.6);
        const glowR = s.size * 5;
        const g = ctx.createRadialGradient(x, y, 0, x, y, glowR);
        g.addColorStop(0, `hsla(${s.hue},100%,72%,0.95)`);
        g.addColorStop(0.4, `hsla(${s.hue},95%,65%,0.35)`);
        g.addColorStop(1, `hsla(${s.hue},90%,55%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, glowR, 0, Math.PI * 2); ctx.fill();
      }

      ctx.restore();

      raf = requestAnimationFrame(step);
    };

    if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      resize();
      raf = requestAnimationFrame(step);
      window.addEventListener('resize', resize);
    }

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [count]);

  return <canvas ref={ref} className="capibara-sparkles" aria-hidden />;
}
