import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CurseTemplate, CurseSeverity } from '../types/curse';
import { occultAudio } from '../utils/audio';
import { Skull, Flame, Sparkles, CheckCircle2, ShieldAlert, Copy, ExternalLink, X } from 'lucide-react';

interface RitualModalProps {
  victimName: string;
  selectedCurses: CurseTemplate[];
  severity: CurseSeverity;
  sacrificeName: string;
  demonName: string;
  onClose: () => void;
  onGoToRegistry: () => void;
}

export const RitualModal: React.FC<RitualModalProps> = ({
  victimName,
  selectedCurses,
  severity,
  sacrificeName,
  demonName,
  onClose,
  onGoToRegistry,
}) => {
  const [phase, setPhase] = useState<'summoning' | 'chanting' | 'striking' | 'completed'>('summoning');
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // Trigger sounds and phased cutscene
  useEffect(() => {
    occultAudio.playDemonBell();
    occultAudio.playRitualPulse();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    const timer1 = setTimeout(() => {
      setPhase('chanting');
      occultAudio.playBloodSizzle();
    }, 1600);

    const timer2 = setTimeout(() => {
      setPhase('striking');
      occultAudio.playDoomHit();

      // Blood splatter confetti blast
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#7f1d1d', '#991b1b', '#ef4444', '#450a0a', '#000000'],
          ticks: 300,
        });
      } catch {
        // ignore
      }
    }, 3600);

    const timer3 = setTimeout(() => {
      setPhase('completed');
      occultAudio.playDemonBell();
    }, 4800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const copyDecree = () => {
    const text = `⛧ ОФИЦИАЛЬНЫЙ АКТ НАВЕДЕНИЯ ПОРЧИ ⛧
Жертва: ${victimName}
Проклятия: ${selectedCurses.map((c) => c.title).join(', ')}
Катализатор: ${sacrificeName}
Куратор из Преисподней: ${demonName}
Статус: Внедрено в ауру, карма обнулена.
Печать Люцифера: VERITAS MALEFICUM #${Math.floor(100000 + Math.random() * 900000)}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      {/* Container with demonic glowing borders and trembling screen on strike */}
      <div
        className={`relative w-full max-w-2xl bg-[#0e090b] border-2 border-red-800 rounded-2xl p-6 md:p-8 text-neutral-100 shadow-[0_0_60px_rgba(220,38,38,0.5)] overflow-hidden transition-all ${
          phase === 'striking' ? 'satanic-shake border-red-500 shadow-[0_0_90px_rgba(239,68,68,0.9)]' : ''
        }`}
      >
        {/* Close button if completed */}
        {phase === 'completed' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 rounded-full hover:bg-red-950/50 transition-colors z-20"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {/* Pulsing center pentagram in modal */}
        <div className="absolute -top-24 -right-24 w-80 h-80 opacity-15 pointer-events-none animate-spin-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-red-600 fill-none">
            <circle cx="50" cy="50" r="45" strokeWidth="1" strokeDasharray="3 3" />
            <polygon points="50,92 20,25 90,52 10,52 80,25" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Phase 1 & 2 & 3: Summoning sequence */}
        {phase !== 'completed' && (
          <div className="py-8 text-center flex flex-col items-center">
            {/* Spinning Occult Seal */}
            <div className="relative mb-6">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-red-700/60 flex items-center justify-center relative shadow-[0_0_35px_rgba(185,28,28,0.6)]">
                {/* Rotating ring */}
                <div className="absolute inset-1 rounded-full border border-dashed border-red-500 animate-spin-slow" />
                <div className="absolute inset-3 rounded-full border border-red-900 animate-spin-reverse-slow" />
                
                {/* Center Icon */}
                {phase === 'summoning' && <Flame className="w-16 h-16 text-red-500 animate-flame" />}
                {phase === 'chanting' && <Skull className="w-16 h-16 text-red-400 animate-pulse" />}
                {phase === 'striking' && <Sparkles className="w-16 h-16 text-yellow-400 animate-spin" />}
              </div>
              <div className="absolute -bottom-2 bg-red-950 text-red-300 text-xs px-3 py-1 rounded-full border border-red-700 font-mono">
                {demonName}
              </div>
            </div>

            {/* Phased Headlines */}
            <h2 className="text-2xl md:text-3xl font-gothic tracking-wider text-red-500 drop-shadow-[0_0_12px_rgba(220,38,38,0.8)] mb-2">
              {phase === 'summoning' && 'Взывание к Темным Силам...'}
              {phase === 'chanting' && 'Начертание Рун Скверны...'}
              {phase === 'striking' && '⚡ УДАР В АСТРАЛЬНУЮ ОБОЛОЧКУ! ⚡'}
            </h2>

            <p className="text-neutral-400 text-sm md:text-base max-w-md mx-auto mb-6">
              {phase === 'summoning' && `Привязка кармического канала к ауре: «${victimName}»`}
              {phase === 'chanting' && (
                <span className="font-medieval text-red-300 italic text-base">
                  «{selectedCurses[0]?.latinIncantation || 'Sanguis et tenebrae crucient animam!'}»
                </span>
              )}
              {phase === 'striking' && `Инъекция скверны в бытовую линию судьбы! Жертва обречена.`}
            </p>

            {/* Sacrifice item tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900/60 text-xs text-neutral-300 mb-6">
              <span>Использован катализатор:</span>
              <span className="font-bold text-red-400">{sacrificeName}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-md bg-neutral-900/80 rounded-full h-3 border border-red-950 p-0.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-800 via-red-600 to-amber-500 rounded-full transition-all duration-150 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs font-mono text-red-400/80 mt-2">
              Конденсация проклятия: {progress}%
            </div>
          </div>
        )}

        {/* Phase 4: Completed / Decree Screen */}
        {phase === 'completed' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-950/80 border-2 border-red-600 text-red-500 shadow-[0_0_25px_rgba(220,38,38,0.7)] mb-3">
                <Skull className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-4xl font-gothic text-red-500 tracking-wide">
                ПОРЧА УСПЕШНО НАВЕДЕНА!
              </h2>
              <p className="text-neutral-400 text-sm mt-1">
                Кармический удар достиг цели. Жертва уже обречена на страдания.
              </p>
            </div>

            {/* Victim & Hex Card */}
            <div className="bg-[#150d10] border border-red-900/60 rounded-xl p-5 space-y-4 relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-red-950 pb-3 gap-2">
                <div>
                  <span className="text-xs uppercase tracking-widest text-neutral-500">Жертва инквизиции:</span>
                  <div className="text-xl font-bold text-white flex items-center gap-2">
                    <span>{victimName}</span>
                    <span className="text-xs bg-red-900/50 text-red-300 px-2 py-0.5 rounded border border-red-700">
                      Внедрено в ауру
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-neutral-500 block">Бес-исполнитель:</span>
                  <span className="text-sm font-medieval text-red-400 font-semibold">{demonName}</span>
                </div>
              </div>

              {/* List of applied curses */}
              <div>
                <span className="text-xs text-neutral-400 font-semibold block mb-2">Наложенные проклятия ({selectedCurses.length}):</span>
                <div className="space-y-2">
                  {selectedCurses.map((curse) => (
                    <div
                      key={curse.id}
                      className="flex items-start gap-3 p-2.5 rounded-lg bg-red-950/30 border border-red-900/40 text-sm"
                    >
                      <span className="text-xl">{curse.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-red-200">{curse.title}</div>
                        <div className="text-xs text-neutral-400 line-clamp-1">{curse.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Incantation Quote */}
              <div className="p-3 bg-black/60 rounded-lg border border-red-950/80 text-center font-medieval text-red-300/90 text-sm italic">
                «{selectedCurses[0]?.latinIncantation || 'Maledictum aeternum in carne tua!'}»
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={copyDecree}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-medium text-sm transition-all shadow-sm cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-red-400" />}
                <span>{copied ? 'Акт скопирован в буфер!' : 'Скопировать Акт Порчи'}</span>
              </button>

              <button
                onClick={onGoToRegistry}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Открыть в Реестре Возмездия</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
