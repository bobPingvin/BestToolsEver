import React, { useEffect, useRef } from 'react';
import baphometImage from '../assets/images/baphomet_skull_1790745557013.jpg';

interface PentagramBackgroundProps {
  intensity?: 'normal' | 'ritual';
}

export const PentagramBackground: React.FC<PentagramBackgroundProps> = ({ intensity = 'normal' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle system for burning embers, floating ash & demonic sparks
    const count = intensity === 'ritual' ? 120 : 65;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedY: -(Math.random() * 1.8 + 0.6),
      speedX: (Math.random() - 0.5) * 1.2,
      opacity: Math.random() * 0.7 + 0.25,
      flickerSpeed: Math.random() * 0.05 + 0.015,
      color: Math.random() > 0.4 ? '#ef4444' : Math.random() > 0.5 ? '#f97316' : '#dc2626',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += Math.sin(Date.now() * p.flickerSpeed) * 0.02;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(0.95, p.opacity));
        ctx.shadowBlur = 14;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Deep infernal dark void background */}
      <div className="absolute inset-0 bg-[#070506]" />

      {/* Pulsing Hellfire Radial Core Glow */}
      <div
        className="absolute inset-0 opacity-65 animate-pulse-glow"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(220, 38, 38, 0.45) 0%, rgba(153, 27, 27, 0.25) 38%, rgba(50, 6, 10, 0.65) 65%, rgba(7, 5, 6, 0.98) 90%)',
        }}
      />

      {/* Floating Ash & Burning Sparks Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-75" />

      {/* ================= INFERNAL BAPHOMET & PENTAGRAM COMPOSITION ================= */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[740px] h-[740px] sm:w-[940px] sm:h-[940px] lg:w-[1140px] lg:h-[1140px] transition-opacity duration-1000 pointer-events-none">
        
        {/* ================= BAPHOMET HORNED RAM DEMON VISAGE (PROMINENT & MENACING) ================= */}
        <div
          className="absolute inset-8 sm:inset-12 lg:inset-16 flex items-center justify-center opacity-65 sm:opacity-75 transition-opacity duration-700"
          style={{
            mixBlendMode: 'screen',
            maskImage: 'radial-gradient(circle at 50% 50%, black 50%, rgba(0,0,0,0.85) 65%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 50%, rgba(0,0,0,0.85) 65%, transparent 80%)',
          }}
        >
          <img
            src={baphometImage}
            alt="Baphomet Horned Demon"
            className="w-full h-full object-contain filter contrast-125 brightness-110 drop-shadow-[0_0_35px_rgba(220,38,38,0.8)]"
          />
        </div>

        {/* ================= LAYER 1: SLOW ROTATING OUTER RUNIC PENTAGRAM RING ================= */}
        <div className="absolute inset-0 animate-spin-slow opacity-40">
          <svg viewBox="0 0 800 800" className="w-full h-full text-red-600 fill-none stroke-current">
            <defs>
              {/* Circular Path for Latin Occult Inscription */}
              <path
                id="outerRunesCirclePath"
                d="M 400,400 m -350,0 a 350,350 0 1,1 700,0 a 350,350 0 1,1 -700,0"
              />
            </defs>

            {/* Outer Barbed Sun-Spikes (36 Infernal Teeth) */}
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = (i * 10 * Math.PI) / 180;
              const rInner = i % 2 === 0 ? 372 : 376;
              const rOuter = i % 2 === 0 ? 394 : 386;
              const x1 = 400 + Math.cos(angle - 0.04) * rInner;
              const y1 = 400 + Math.sin(angle - 0.04) * rInner;
              const x2 = 400 + Math.cos(angle) * rOuter;
              const y2 = 400 + Math.sin(angle) * rOuter;
              const x3 = 400 + Math.cos(angle + 0.04) * rInner;
              const y3 = 400 + Math.sin(angle + 0.04) * rInner;
              return (
                <polygon
                  key={i}
                  points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
                  fill="#991b1b"
                  stroke="#ef4444"
                  strokeWidth="0.8"
                />
              );
            })}

            {/* Outer Ring Concentric Borders */}
            <circle cx="400" cy="400" r="372" strokeWidth="2.5" stroke="#ef4444" />
            <circle cx="400" cy="400" r="366" strokeWidth="1" strokeDasharray="3 4" stroke="#dc2626" />
            <circle cx="400" cy="400" r="332" strokeWidth="1.5" stroke="#b91c1c" />
            <circle cx="400" cy="400" r="326" strokeWidth="2" stroke="#dc2626" />

            {/* Demonic Inscription running around the circular track */}
            <text
              fill="#f87171"
              fontSize="13"
              fontFamily="Cinzel Decorative, serif"
              letterSpacing="7.5"
              stroke="none"
              style={{ filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.9))' }}
            >
              <textPath href="#outerRunesCirclePath" startOffset="0%">
                ⛧ BAPHOMET • CORRUPTER ANIMARUM • SOLVE ET COAGULA • IN NOMINE DEI NOSTRI SATANAS LUCIFERI ⛧
              </textPath>
            </text>

            {/* 8 Cardinal Pentagram Seal Nodes on outer rim */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const cx = 400 + Math.cos(angle) * 326;
              const cy = 400 + Math.sin(angle) * 326;
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="6" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
                  <circle cx={cx} cy={cy} r="2.5" fill="#fca5a5" stroke="none" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* ================= LAYER 2: COUNTER-CLOCKWISE ALCHEMICAL WHEEL ================= */}
        <div className="absolute inset-0 animate-spin-reverse-slow opacity-30">
          <svg viewBox="0 0 800 800" className="w-full h-full text-red-500 fill-none stroke-current">
            <circle cx="400" cy="400" r="300" strokeWidth="1.2" strokeDasharray="6 8" stroke="#dc2626" />
            <circle cx="400" cy="400" r="280" strokeWidth="1.5" stroke="#ef4444" />

            {/* 12 Demonic Runes along the ring */}
            {[
              { char: '🜏', a: 15 },
              { char: '☿', a: 45 },
              { char: '🜍', a: 75 },
              { char: '♄', a: 105 },
              { char: '🜔', a: 135 },
              { char: '♃', a: 165 },
              { char: '🜐', a: 195 },
              { char: '☉', a: 225 },
              { char: '🜎', a: 255 },
              { char: '☾', a: 285 },
              { char: '♅', a: 315 },
              { char: '♆', a: 345 },
            ].map((rune, idx) => {
              const rad = (rune.a * Math.PI) / 180;
              const rx = 400 + Math.cos(rad) * 302;
              const ry = 400 + Math.sin(rad) * 302;
              return (
                <text
                  key={idx}
                  x={rx}
                  y={ry + 4}
                  fill="#ef4444"
                  fontSize="14"
                  textAnchor="middle"
                  stroke="none"
                  fontFamily="serif"
                >
                  {rune.char}
                </text>
              );
            })}
          </svg>
        </div>

        {/* ================= LAYER 3: FIXED INVERTED FIVE-POINTED BAPHOMET STAR ================= */}
        <div className="absolute inset-0 opacity-40">
          <svg
            viewBox="0 0 800 800"
            className="w-full h-full text-red-500 fill-none stroke-current"
            style={{ filter: 'drop-shadow(0 0 25px rgba(220, 38, 38, 0.8))' }}
          >
            {/* Star Enclosing Ring */}
            <circle cx="400" cy="400" r="280" strokeWidth="2.5" stroke="#ef4444" />
            <circle cx="400" cy="400" r="272" strokeWidth="1" stroke="#7f1d1d" />

            {/* Inverted Five-Pointed Star (p0 down at 670, p2 & p3 up at 182) */}
            <polygon
              points="400,670 241,182 657,483 143,483 559,182"
              strokeWidth="4"
              stroke="#ef4444"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            <polygon
              points="400,670 241,182 657,483 143,483 559,182"
              strokeWidth="1.8"
              stroke="#fca5a5"
              strokeLinejoin="round"
              strokeDasharray="18 4"
            />

            {/* 5 Inverted Cross Nodes */}
            {[
              { x: 400, y: 670 },
              { x: 143, y: 483 },
              { x: 241, y: 182 },
              { x: 559, y: 182 },
              { x: 657, y: 483 },
            ].map((v, i) => (
              <g key={i}>
                <circle cx={v.x} cy={v.y} r="12" fill="#180102" stroke="#ef4444" strokeWidth="2" />
                <line x1={v.x} y1={v.y - 6} x2={v.x} y2={v.y + 6} stroke="#ffffff" strokeWidth="1.5" />
                <line x1={v.x - 3.5} y1={v.y + 2} x2={v.x + 3.5} y2={v.y + 2} stroke="#ffffff" strokeWidth="1.5" />
              </g>
            ))}
          </svg>
        </div>

      </div>

      {/* Atmospheric Vignette Gradients for Cinematic Horror Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-60" />
    </div>
  );
};
