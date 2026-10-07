import React, { useEffect, useRef } from 'react';

export const HolyCrossBackground: React.FC = () => {
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

    // Golden divine light particles and celestial sparks rising toward heaven
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.8 + 1,
      speedY: -(Math.random() * 0.9 + 0.3),
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.7 + 0.2,
      flickerSpeed: Math.random() * 0.04 + 0.01,
      color: Math.random() > 0.4 ? '#fbbf24' : Math.random() > 0.3 ? '#fef08a' : '#67e8f9',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += Math.sin(Date.now() * p.flickerSpeed) * 0.015;

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
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Deep Celestial Midnight Azure Background */}
      <div className="absolute inset-0 bg-[#080c16]" />

      {/* Radiant Tabor Light Halo Radial Glow (Фаворский свет) */}
      <div
        className="absolute inset-0 opacity-70 animate-pulse-glow"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(245, 158, 11, 0.32) 0%, rgba(217, 119, 6, 0.18) 35%, rgba(14, 28, 54, 0.65) 65%, rgba(8, 12, 22, 0.98) 90%)',
        }}
      />

      {/* Golden Sparks & Divine Dust Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-75" />

      {/* ================= RADIANT HOLY CHRISTIAN CROSS ASSEMBLY ================= */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] sm:w-[920px] sm:h-[920px] lg:w-[1100px] lg:h-[1100px] opacity-40 transition-opacity duration-1000 pointer-events-none">
        
        {/* Layer 1: Divine Sunburst Rays Emitting from the Cross Center */}
        <div className="absolute inset-0 animate-spin-slow">
          <svg viewBox="0 0 800 800" className="w-full h-full fill-none">
            <defs>
              <radialGradient id="sunburstGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.45" />
                <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
              <path
                id="holyInscriptionPath"
                d="M 400,400 m -320,0 a 320,320 0 1,1 640,0 a 320,320 0 1,1 -640,0"
              />
            </defs>

            {/* Radiant Sunburst Beams (32 rays of heavenly light) */}
            {Array.from({ length: 32 }).map((_, i) => {
              const angle = (i * 11.25 * Math.PI) / 180;
              const r1 = 120;
              const r2 = i % 2 === 0 ? 370 : 330;
              const x1 = 400 + Math.cos(angle) * r1;
              const y1 = 400 + Math.sin(angle) * r1;
              const x2 = 400 + Math.cos(angle) * r2;
              const y2 = 400 + Math.sin(angle) * r2;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#fbbf24"
                  strokeWidth={i % 2 === 0 ? 2 : 1.2}
                  strokeDasharray={i % 2 === 0 ? 'none' : '4 6'}
                  opacity={i % 2 === 0 ? 0.6 : 0.35}
                />
              );
            })}

            {/* Golden Celestial Ring Concentric Borders */}
            <circle cx="400" cy="400" r="340" stroke="#f59e0b" strokeWidth="2.5" />
            <circle cx="400" cy="400" r="334" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 5" />
            <circle cx="400" cy="400" r="300" stroke="#d97706" strokeWidth="1.5" />
            <circle cx="400" cy="400" r="294" stroke="#fbbf24" strokeWidth="2" />

            {/* Sacred Inscription Ring */}
            <text
              fill="#fde047"
              fontSize="12.5"
              fontFamily="Cinzel Decorative, serif"
              letterSpacing="8"
              stroke="none"
              style={{ filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))' }}
            >
              <textPath href="#holyInscriptionPath" startOffset="0%">
                🕊️ СВЯТ, СВЯТ, СВЯТ ГОСПОДЬ САВАОФ 🕊️ IN HOC SIGNO VINCES 🕊️ ИС ХС НИКА 🕊️ ФΩС • ZΩH 🕊️
              </textPath>
            </text>

            {/* 12 Apostles Stars along the outer rim */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const cx = 400 + Math.cos(angle) * 294;
              const cy = 400 + Math.sin(angle) * 294;
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx={cx} cy={cy} r="2" fill="#ffffff" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Layer 2: Counter-Rotating Angelic Halo of Seraphim */}
        <div className="absolute inset-0 animate-spin-reverse-slow">
          <svg viewBox="0 0 800 800" className="w-full h-full fill-none">
            <circle cx="400" cy="400" r="260" stroke="#fef08a" strokeWidth="1" strokeDasharray="6 8" />
            <circle cx="400" cy="400" r="220" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="400" cy="400" r="180" stroke="#d97706" strokeWidth="1" strokeDasharray="3 5" />

            {/* 8 Golden Crosses in the Halo */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const cx = 400 + Math.cos(angle) * 240;
              const cy = 400 + Math.sin(angle) * 240;
              return (
                <g key={i} stroke="#fde047" strokeWidth="2">
                  <line x1={cx} y1={cy - 9} x2={cx} y2={cy + 9} />
                  <line x1={cx - 7} y1={cy - 2} x2={cx + 7} y2={cy - 2} />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Layer 3: Central Majestic Golden Christian Cross (Steady, Radiant & Powerful) */}
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 800 800"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 0 25px rgba(251, 191, 36, 0.85)) drop-shadow(0 0 50px rgba(217, 119, 6, 0.5))' }}
          >
            <defs>
              {/* Rich Golden Metal Gradients */}
              <linearGradient id="goldGradientVertical" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="35%" stopColor="#fde047" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="65%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              <linearGradient id="goldGradientHorizontal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="35%" stopColor="#fde047" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="65%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              <radialGradient id="crossCenterBurst" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="30%" stopColor="#fef08a" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Central Glorious Radiant Core Glow */}
            <circle cx="400" cy="380" r="160" fill="url(#crossCenterBurst)" />

            {/* Cross Halo Rings (Centered at intersection y=380) */}
            <circle cx="400" cy="380" r="110" stroke="#fde047" strokeWidth="2.5" fill="none" />
            <circle cx="400" cy="380" r="102" stroke="#d97706" strokeWidth="1" strokeDasharray="4 4" fill="none" />

            {/* ================= THE CHRISTIAN CROSS =================
                Center intersection at: (400, 380)
                Vertical beam: width 48px (x: 376..424), height from y=120 to y=660
                Horizontal crossbeam: height 48px (y: 356..404), width from x=210 to x=590
                Trefoil flared endpoints on each of the 4 ends!
            */}

            {/* Vertical Beam Body */}
            <rect
              x="376"
              y="130"
              width="48"
              height="520"
              rx="4"
              fill="url(#goldGradientVertical)"
              stroke="#fbbf24"
              strokeWidth="2"
            />

            {/* Horizontal Crossbeam Body */}
            <rect
              x="220"
              y="356"
              width="360"
              height="48"
              rx="4"
              fill="url(#goldGradientHorizontal)"
              stroke="#fbbf24"
              strokeWidth="2"
            />

            {/* Inner Golden Inlay Lines */}
            <line x1="400" y1="140" x2="400" y2="640" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
            <line x1="230" y1="380" x2="570" y2="380" stroke="#ffffff" strokeWidth="2" opacity="0.8" />

            {/* 4 Flared Trefoil Finials (Концы Креста с трилистниками) */}
            {/* Top Finial (y ≈ 120) */}
            <g transform="translate(400, 130)">
              <circle cx="-20" cy="-6" r="13" fill="#fde047" stroke="#b45309" strokeWidth="2" />
              <circle cx="20" cy="-6" r="13" fill="#fde047" stroke="#b45309" strokeWidth="2" />
              <circle cx="0" cy="-22" r="16" fill="#fef08a" stroke="#b45309" strokeWidth="2" />
              <circle cx="0" cy="-22" r="5" fill="#ffffff" />
            </g>

            {/* Bottom Finial (y ≈ 650) */}
            <g transform="translate(400, 650)">
              <circle cx="-20" cy="6" r="13" fill="#fde047" stroke="#b45309" strokeWidth="2" />
              <circle cx="20" cy="6" r="13" fill="#fde047" stroke="#b45309" strokeWidth="2" />
              <circle cx="0" cy="22" r="16" fill="#fef08a" stroke="#b45309" strokeWidth="2" />
              <circle cx="0" cy="22" r="5" fill="#ffffff" />
            </g>

            {/* Left Finial (x ≈ 220) */}
            <g transform="translate(220, 380)">
              <circle cx="-6" cy="-20" r="13" fill="#fde047" stroke="#b45309" strokeWidth="2" />
              <circle cx="-6" cy="20" r="13" fill="#fde047" stroke="#b45309" strokeWidth="2" />
              <circle cx="-22" cy="0" r="16" fill="#fef08a" stroke="#b45309" strokeWidth="2" />
              <circle cx="-22" cy="0" r="5" fill="#ffffff" />
            </g>

            {/* Right Finial (x ≈ 580) */}
            <g transform="translate(580, 380)">
              <circle cx="6" cy="-20" r="13" fill="#fde047" stroke="#b45309" strokeWidth="2" />
              <circle cx="6" cy="20" r="13" fill="#fde047" stroke="#b45309" strokeWidth="2" />
              <circle cx="22" cy="0" r="16" fill="#fef08a" stroke="#b45309" strokeWidth="2" />
              <circle cx="22" cy="0" r="5" fill="#ffffff" />
            </g>

            {/* Eastern Orthodox Titulus / Upper Tablet (INRI / ИС ХС Царь Славы) */}
            <rect
              x="365"
              y="185"
              width="70"
              height="28"
              rx="4"
              fill="#78350f"
              stroke="#fde047"
              strokeWidth="2"
            />
            <text
              x="400"
              y="204"
              fill="#fef08a"
              fontSize="12"
              fontFamily="Cinzel Decorative, serif"
              fontWeight="bold"
              textAnchor="middle"
              stroke="none"
              letterSpacing="2"
            >
              INRI
            </text>

            {/* Lower Footrest Footstool (Подножие Креста) */}
            <polygon
              points="355,595 445,565 445,580 355,610"
              fill="url(#goldGradientHorizontal)"
              stroke="#fbbf24"
              strokeWidth="1.8"
            />

            {/* Sacred Monogram Inscription on crossbeams (IC XC NIKA) */}
            <text x="320" y="386" fill="#78350f" fontSize="16" fontFamily="Cinzel Decorative, serif" fontWeight="bold" textAnchor="middle">
              IC
            </text>
            <text x="480" y="386" fill="#78350f" fontSize="16" fontFamily="Cinzel Decorative, serif" fontWeight="bold" textAnchor="middle">
              XC
            </text>
            <text x="400" y="445" fill="#78350f" fontSize="15" fontFamily="Cinzel Decorative, serif" fontWeight="bold" textAnchor="middle">
              NIKA
            </text>

            {/* Central Pure Diamond Jewel on Cross Center */}
            <polygon
              points="400,360 420,380 400,400 380,380"
              fill="#ffffff"
              stroke="#d97706"
              strokeWidth="2"
              style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 1))' }}
            />
            <circle cx="400" cy="380" r="5" fill="#f59e0b" />

            {/* Dove of the Holy Spirit (Голубь Мира) at Top */}
            <g transform="translate(400, 75) scale(0.85)">
              <path
                d="M 0,-15 C -8,-25 -25,-25 -35,-15 C -45,-5 -35,10 -15,12 C -20,25 -5,30 0,38 C 5,30 20,25 15,12 C 35,10 45,-5 35,-15 C 25,-25 8,-25 0,-15 Z"
                fill="#ffffff"
                stroke="#f59e0b"
                strokeWidth="1.8"
                style={{ filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.9))' }}
              />
              <circle cx="0" cy="0" r="3" fill="#f59e0b" />
            </g>
          </svg>
        </div>

      </div>

      {/* Atmospheric Vignette Gradients for Golden Celestial Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-[#060913] opacity-85" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#060913] via-transparent to-[#060913] opacity-70" />
    </div>
  );
};
