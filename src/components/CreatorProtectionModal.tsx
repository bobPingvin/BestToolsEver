import React, { useEffect } from 'react';
import { occultAudio } from '../utils/audio';
import { ShieldAlert, AlertTriangle, Eye, Flame, Crown, Skull } from 'lucide-react';

interface CreatorProtectionModalProps {
  onClose: () => void;
}

export const CreatorProtectionModal: React.FC<CreatorProtectionModalProps> = ({ onClose }) => {
  useEffect(() => {
    // Terrifying audio sequence
    occultAudio.playDoomHit();
    occultAudio.playDemonBell();
    const t = setTimeout(() => {
      occultAudio.playRitualPulse();
    }, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl overflow-y-auto">
      {/* Glitching/Trembling Dark Container */}
      <div className="relative w-full max-w-xl bg-[#090204] border-2 border-red-600 rounded-2xl p-6 md:p-8 text-neutral-100 shadow-[0_0_90px_rgba(239,68,68,0.9)] overflow-hidden satanic-shake">
        
        {/* Pulsing Red Fog & Inverted Seal */}
        <div className="absolute inset-0 bg-radial from-red-950/60 via-black to-black opacity-80 pointer-events-none" />
        
        {/* Giant Demonic Eye / Star in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-10 pointer-events-none animate-spin-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-red-500 fill-none">
            <circle cx="50" cy="50" r="45" strokeWidth="1.5" strokeDasharray="4 4" />
            <polygon points="50,92 20,25 90,52 10,52 80,25" strokeWidth="2" />
          </svg>
        </div>

        <div className="relative z-10 text-center space-y-6">
          {/* Header Icon with Crown of the Demiurge */}
          <div className="relative inline-flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-red-950/90 border-2 border-red-500 flex items-center justify-center text-red-500 shadow-[0_0_35px_rgba(239,68,68,0.9)] animate-pulse">
              <Eye className="w-10 h-10 animate-ping text-red-400" />
            </div>
            <div className="absolute -top-3 -right-2 bg-amber-500/20 text-amber-400 p-1.5 rounded-full border border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]">
              <Crown className="w-5 h-5 animate-bounce" />
            </div>
          </div>

          {/* Ominous warning tags */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 border border-red-600 text-red-400 text-xs tracking-widest uppercase font-mono shadow-[0_0_15px_rgba(220,38,38,0.8)]">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <span>АНУЛИРОВАНИЕ РИТУАЛА • КРИТИЧЕСКИЙ ОТКАЗ</span>
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            </div>

            <h2 className="text-2xl md:text-4xl font-gothic tracking-wider text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,1)] uppercase pt-2">
              ТЫ ПОСМЕЛ ПОДНЯТЬ РУКУ НА СОЗДАТЕЛЯ?!
            </h2>
          </div>

          {/* Creepy Lore message */}
          <div className="bg-black/80 border border-red-900/90 rounded-xl p-5 space-y-3 font-serif text-sm md:text-base leading-relaxed text-neutral-300 text-left border-l-4 border-l-red-600 shadow-inner">
            <p className="font-bold text-red-400 text-base">
              ⛧ НА ЭТУ ДУШУ НЕЛЬЗЯ НАЛОЖИТЬ ПОРЧУ! ⛧
            </p>
            <p>
              Лицо, чье имя ты ввел — <span className="text-white font-bold underline decoration-red-500">Журавлев Максим Вячеславович</span> — является <span className="text-amber-400 font-bold">Архитектором, Демиургом и Создателем</span> этого веб-приложения и всей окружающей тебя инфернальной реальности.
            </p>
            <p className="text-xs md:text-sm text-neutral-400 italic font-medieval border-t border-red-950/80 pt-2">
              «Ни демоны нижних кругов, ни Люцифер, ни Бафомет не смеют коснуться своего Создателя. Проклятие мгновенно распалось на атомы и отрикошетило в Бездну. Твой ритуал обращен в пепел.»
            </p>
          </div>

          <div className="text-xs text-red-400/90 font-mono tracking-tight animate-pulse">
            ⚠️ Ошибка астрального ядра: ERR_CREATOR_IMMUNITY_ABSOLUTE_SHIELD
          </div>

          {/* Repent button */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-900 via-red-700 to-red-900 hover:from-red-800 hover:to-red-600 text-white font-bold font-medieval text-sm md:text-base tracking-wider transition-all shadow-[0_0_25px_rgba(239,68,68,0.7)] cursor-pointer hover:scale-[1.01] active:scale-[0.98]"
            >
              Склонить голову, покаяться и стереть имя Создателя 🙇
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
