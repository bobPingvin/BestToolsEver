import React, { useEffect, useState } from 'react';

interface CelestialSparkle {
  id: number;
  leftPercent: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
}

export const AngelicRays: React.FC = () => {
  const [sparkles, setSparkles] = useState<CelestialSparkle[]>([]);

  useEffect(() => {
    // Falling divine blessings/sparkles descending gently from the rays of light
    const items: CelestialSparkle[] = [
      { id: 1, leftPercent: 12, delay: 0.2, duration: 3.5, size: 3, color: '#fef08a' },
      { id: 2, leftPercent: 25, delay: 1.5, duration: 4.2, size: 4, color: '#ffffff' },
      { id: 3, leftPercent: 38, delay: 0.8, duration: 3.8, size: 2.5, color: '#fbbf24' },
      { id: 4, leftPercent: 50, delay: 2.1, duration: 4.5, size: 4.5, color: '#ffffff' },
      { id: 5, leftPercent: 62, delay: 1.1, duration: 3.6, size: 3, color: '#fef08a' },
      { id: 6, leftPercent: 74, delay: 2.7, duration: 4.0, size: 3.8, color: '#fbbf24' },
      { id: 7, leftPercent: 88, delay: 0.5, duration: 3.4, size: 3.2, color: '#ffffff' },
    ];
    setSparkles(items);
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 pointer-events-none z-30 select-none overflow-hidden h-28 sm:h-36 lg:h-44">
      {/* Top radiant divine golden glow (Ambient bloom across the entire ceiling) */}
      <div
        className="absolute inset-x-0 top-0 h-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(254, 240, 138, 0.7) 0%, rgba(245, 158, 11, 0.4) 35%, rgba(217, 119, 6, 0.15) 65%, transparent 100%)',
          filter: 'blur(12px)',
        }}
      />

      {/* Primary Radiant God Rays (Лучи Бога) Fan SVG */}
      <div className="absolute inset-0 w-full h-full animate-divine-beams origin-top">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          style={{
            filter:
              'drop-shadow(0 6px 16px rgba(251, 191, 36, 0.6)) drop-shadow(0 12px 30px rgba(245, 158, 11, 0.4))',
          }}
        >
          <defs>
            {/* Primary Heavenly Beam Gradient: Bright white to transparent golden fade */}
            <linearGradient id="godRayBeamCenter" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#fef08a" stopOpacity="0.65" />
              <stop offset="65%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </linearGradient>

            {/* Lateral Soft God Ray Gradient */}
            <linearGradient id="godRayBeamLateral" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.75" />
              <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="75%" stopColor="#b45309" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
            </linearGradient>

            {/* Outer Subtle Golden Mist Beam */}
            <linearGradient id="godRayBeamOuter" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#d97706" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>

            {/* Center Golden Source Sunburst Halo */}
            <radialGradient id="heavenSourceSun" cx="50%" cy="0%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#fef08a" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central God Beams (14 sweeping conical shafts from x=720, y=-10) */}
          {/* Broad central vertical pillar of light */}
          <polygon points="695,-10 745,-10 820,160 620,160" fill="url(#godRayBeamCenter)" />

          {/* Mid Rays radiating left & right */}
          <polygon points="705,-10 735,-10 930,160 840,160" fill="url(#godRayBeamLateral)" />
          <polygon points="705,-10 735,-10 600,160 510,160" fill="url(#godRayBeamLateral)" />

          <polygon points="710,-10 730,-10 1060,160 960,160" fill="url(#godRayBeamLateral)" opacity="0.85" />
          <polygon points="710,-10 730,-10 480,160 380,160" fill="url(#godRayBeamLateral)" opacity="0.85" />

          {/* Wide angle beams */}
          <polygon points="715,-10 725,-10 1200,160 1080,160" fill="url(#godRayBeamOuter)" />
          <polygon points="715,-10 725,-10 360,160 240,160" fill="url(#godRayBeamOuter)" />

          <polygon points="718,-10 722,-10 1340,160 1220,160" fill="url(#godRayBeamOuter)" opacity="0.6" />
          <polygon points="718,-10 722,-10 220,160 100,160" fill="url(#godRayBeamOuter)" opacity="0.6" />

          <polygon points="719,-10 721,-10 1440,140 1350,160" fill="url(#godRayBeamOuter)" opacity="0.4" />
          <polygon points="719,-10 721,-10 90,160 0,140" fill="url(#godRayBeamOuter)" opacity="0.4" />

          {/* Golden Heaven Source Disc at the Center Top */}
          <ellipse cx="720" cy="0" rx="220" ry="40" fill="url(#heavenSourceSun)" />
        </svg>
      </div>

      {/* Decorative Golden Filigree / Celestial Scalloped Canopy at the very top edge */}
      <div className="absolute top-0 inset-x-0 h-4 pointer-events-none flex items-center justify-center">
        <svg className="w-full h-4" viewBox="0 0 1440 16" preserveAspectRatio="none">
          <path
            d="
              M 0,0 L 1440,0 L 1440,5
              C 1360,12 1280,2 1200,8
              C 1120,14 1040,4 960,10
              C 880,16 800,6 720,12
              C 640,6 560,16 480,10
              C 400,4 320,14 240,8
              C 160,2 80,12 0,5
              Z
            "
            fill="url(#scallopGold)"
          />
          <defs>
            <linearGradient id="scallopGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="25%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#fde047" />
              <stop offset="75%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Center Top Emblem: Holy Dove of Peace & Radiant Flare */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none animate-divine-flare">
        {/* Diamond Star Flare */}
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-yellow-300/30 blur-md absolute" />
          <svg viewBox="0 0 60 60" className="w-10 h-10 text-yellow-300 drop-shadow-[0_0_12px_rgba(255,255,255,1)]">
            {/* 8-pointed golden Bethlehem star */}
            <polygon
              points="30,2 35,24 57,30 35,36 30,58 25,36 3,30 25,24"
              fill="#ffffff"
              stroke="#f59e0b"
              strokeWidth="1"
            />
            <circle cx="30" cy="30" r="4" fill="#fde047" />
          </svg>
        </div>
      </div>

      {/* Descending Divine Sparkles (Floating holy motes of light) */}
      {sparkles.map((sp) => (
        <div
          key={sp.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${sp.leftPercent}%`,
            top: '0px',
            width: `${sp.size}px`,
            height: `${sp.size}px`,
            backgroundColor: sp.color,
            boxShadow: `0 0 ${sp.size * 3}px ${sp.color}`,
            animation: `divineSparkleDrop ${sp.duration}s cubic-bezier(0.25, 1, 0.5, 1) infinite`,
            animationDelay: `${sp.delay}s`,
          }}
        />
      ))}

      {/* Inline Keyframes for descending sparkles */}
      <style>{`
        @keyframes divineSparkleDrop {
          0% {
            transform: translateY(0px) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
            transform: translateY(20px) scale(1.3);
          }
          70% {
            opacity: 0.8;
            transform: translateY(70px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(110px) scale(0.3);
          }
        }
      `}</style>
    </div>
  );
};
