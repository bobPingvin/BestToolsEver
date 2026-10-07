import React, { useState, useEffect, useRef } from 'react';
import { BlessingTemplate } from '../types/blessed';
import { CurseTemplate } from '../types/curse';
import { BLESSINGS_CATALOG } from '../data/blessingsData';
import { CURSES_CATALOG } from '../data/cursesData';
import { occultAudio } from '../utils/audio';
import {
  Scale,
  Sparkles,
  Flame,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
  ShieldAlert,
  Sun,
  Scroll,
  PenTool,
  Award,
  Share2,
} from 'lucide-react';

interface DilemmaCard {
  id: number;
  blessing: BlessingTemplate;
  curse: CurseTemplate;
}

interface KarmicPactGameProps {
  onBackToHome: () => void;
  onOpenCursedTools?: () => void;
  onOpenBlessedTools?: () => void;
}

type GameStage = 'contract' | 'playing' | 'results';

export const KarmicPactGame: React.FC<KarmicPactGameProps> = ({
  onBackToHome,
  onOpenCursedTools,
  onOpenBlessedTools,
}) => {
  const [stage, setStage] = useState<GameStage>('contract');

  // Contract form state
  const [fullName, setFullName] = useState('');
  const [contractAgreed, setContractAgreed] = useState(false);

  // Game state
  const [deck, setDeck] = useState<DilemmaCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [acceptedDeals, setAcceptedDeals] = useState<DilemmaCard[]>([]);
  const [rejectedDeals, setRejectedDeals] = useState<DilemmaCard[]>([]);
  const [cardTransition, setCardTransition] = useState<'idle' | 'accepting' | 'rejecting'>('idle');
  const [cardAnimPhase, setCardAnimPhase] = useState<'rising' | 'paused' | 'revealed'>('rising');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAnimTimers = () => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  };

  const handleSkipToRevealed = () => {
    if (cardAnimPhase === 'revealed') return;
    clearAnimTimers();
    setCardAnimPhase('revealed');
    occultAudio.playDemonBell();
  };

  // Card sequence:
  // 1. 'rising': 2.6s smooth single-motion continuous rise and 360deg rotation directly to center
  // 2. 'paused': card sits motionless in center for exactly 2 seconds
  // 3. 'revealed': deal window appears over the card
  useEffect(() => {
    if (stage === 'playing') {
      clearAnimTimers();
      setCardAnimPhase('rising');
      occultAudio.playHarpShimmer();

      pauseTimerRef.current = setTimeout(() => {
        setCardAnimPhase('paused');
      }, 2600);

      revealTimerRef.current = setTimeout(() => {
        setCardAnimPhase('revealed');
        occultAudio.playDemonBell();
      }, 4600);

      return () => {
        clearAnimTimers();
      };
    }
  }, [currentIndex, stage]);

  const NAME_PRESETS = [
    'Иванов Иван Иванович',
    'Смирнова Анна Михайловна',
    'Васильев Максим Игоревич',
    'Петров Александр Сергеевич',
  ];

  // Helper to generate 10 unique non-repeating dilemma cards
  const generateNewDeck = (): DilemmaCard[] => {
    // Shuffle blessings
    const shuffledBlessings = [...BLESSINGS_CATALOG].sort(() => Math.random() - 0.5);
    // Shuffle curses
    const shuffledCurses = [...CURSES_CATALOG].sort(() => Math.random() - 0.5);

    const cards: DilemmaCard[] = [];
    for (let i = 0; i < 10; i++) {
      cards.push({
        id: i + 1,
        blessing: shuffledBlessings[i % shuffledBlessings.length],
        curse: shuffledCurses[i % shuffledCurses.length],
      });
    }
    return cards;
  };

  // Start new game
  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !contractAgreed) return;

    occultAudio.playHolyBells();
    occultAudio.playDemonBell();
    const newDeck = generateNewDeck();
    setDeck(newDeck);
    setCurrentIndex(0);
    setAcceptedDeals([]);
    setRejectedDeals([]);
    setStage('playing');
  };

  // Handle card choice
  const handleDecision = (decision: 'accept' | 'reject') => {
    if (cardTransition !== 'idle') return;
    clearAnimTimers();

    const currentCard = deck[currentIndex];

    if (decision === 'accept') {
      setCardTransition('accepting');
      occultAudio.playHolyBells();
      occultAudio.playBloodSizzle();
      setAcceptedDeals((prev) => [...prev, currentCard]);
    } else {
      setCardTransition('rejecting');
      occultAudio.playDoomHit();
      setRejectedDeals((prev) => [...prev, currentCard]);
    }

    setTimeout(() => {
      setCardTransition('idle');
      if (currentIndex + 1 < deck.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Game finished
        setStage('results');
        occultAudio.playAngelicChant();
      }
    }, 450);
  };

  // Restart game
  const handleRestart = () => {
    clearAnimTimers();
    const newDeck = generateNewDeck();
    setDeck(newDeck);
    setCurrentIndex(0);
    setAcceptedDeals([]);
    setRejectedDeals([]);
    setStage('playing');
    occultAudio.playHarpShimmer();
  };

  // Determine Title based on accepted deals
  const getKarmicTitle = (acceptedCount: number) => {
    if (acceptedCount >= 9) {
      return {
        title: 'Владыка Вселенского Хаоса и Мученик',
        subtitle: 'Ты жадно поглотил почти все дары, наплевав на самые жуткие кары Бафомета!',
        badgeColor: 'bg-purple-950 text-purple-300 border-purple-600',
      };
    }
    if (acceptedCount >= 6) {
      return {
        title: 'Азартный Фаталист Света и Тьмы',
        subtitle: 'Выгода перевесила страх. Твоя аура пылает благодатью вперемешку с поносом и ударами мизинцем.',
        badgeColor: 'bg-amber-950 text-amber-300 border-amber-600',
      };
    }
    if (acceptedCount >= 4) {
      return {
        title: 'Хранитель Истинного Равновесия Кармы',
        subtitle: 'Идеальный баланс прагматика. Ты отмерил ровно столько боли, сколько готов был терпеть ради даров.',
        badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-600',
      };
    }
    if (acceptedCount >= 1) {
      return {
        title: 'Осторожный Праведник',
        subtitle: 'Ты пренебрег большинством искушений, забрав лишь самое ценное и избежав бездны.',
        badgeColor: 'bg-blue-950 text-blue-300 border-blue-600',
      };
    }
    return {
      title: 'Неприкасаемый Скептик Судьбы',
      subtitle: 'Ты отверг все сделки! Ни один дар не освятил тебя, но и ни одна порча не коснулась твоих штанов.',
      badgeColor: 'bg-neutral-800 text-neutral-300 border-neutral-600',
    };
  };

  // Copy results summary
  const handleCopyResults = () => {
    const titleInfo = getKarmicTitle(acceptedDeals.length);
    const text = [
      `📜 КАРМИЧЕСКИЙ ПАКТ: СДЕЛКА С БОГОМ И БАФОМЕТОМ`,
      `Подписант: ${fullName}`,
      `Статус: ${titleInfo.title}`,
      `Принято сделок: ${acceptedDeals.length} из 10 | Отклонено: ${rejectedDeals.length}`,
      ``,
      `🕊️ ПОЛУЧЕННЫЕ ДАРЫ (${acceptedDeals.length}):`,
      ...acceptedDeals.map((d, i) => ` ${i + 1}. ${d.blessing.icon} ${d.blessing.title}`),
      ``,
      `😈 ПРИОБРЕТЕННЫЕ ПОРЧИ (${acceptedDeals.length}):`,
      ...acceptedDeals.map((d, i) => ` ${i + 1}. ${d.curse.icon} ${d.curse.title}`),
      ``,
      `BestToolsEver! • CursedTools & BlessedTools`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative z-20">
      {/* Top Header / Nav back */}
      <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-800/80">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-semibold transition cursor-pointer shadow-sm"
        >
          <span>← На Главную BestToolsEver!</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl">⚖️</span>
          <span className="font-cinzel font-bold text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-red-500">
            ДВОЙНОЙ КАРМИЧЕСКИЙ ПАКТ
          </span>
        </div>
      </div>

      {/* ================= STAGE 1: THE ANCIENT SCROLL / GAMBLER'S CHEAT MAP CONTRACT ================= */}
      {stage === 'contract' && (
        <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
          {/* Header Intro */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-xs font-semibold text-amber-200">
              <Sun className="w-3.5 h-3.5 text-yellow-400" />
              <span>Шулерская Грамота Судьбы • 10 Тайных Дилемм</span>
              <Flame className="w-3.5 h-3.5 text-red-500" />
            </div>

            <h1 className="text-2xl md:text-4xl font-vyaz font-extrabold tracking-wider text-amber-200 drop-shadow-[0_2px_15px_rgba(245,158,11,0.5)]">
              СВИТОКЪ КАРМИЧЕСКАГО ПАКТА
            </h1>
            <p className="text-neutral-400 max-w-lg mx-auto text-xs md:text-sm font-serif">
              Древняя шулерская карта, скрепленная Небесной Благодатью и Адским Пламенем.
            </p>
          </div>

          {/* ================= THE ANCIENT PARCHMENT SCROLL ARTIFACT ================= */}
          <div className="relative pt-6 pb-8 select-none">
            {/* TOP WOODEN SCROLL ROLLER SPINDLE */}
            <div className="relative z-20 flex items-center justify-center -mb-3 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]">
              {/* Left Brass Finial Knob */}
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-amber-900 via-yellow-500 to-amber-700 border-2 border-yellow-300 shadow-xl flex items-center justify-center text-amber-950 font-bold text-xs shrink-0">
                ❖
              </div>
              {/* Main Mahogany Wooden Cylinder Bar */}
              <div className="flex-1 h-7 md:h-8 rounded-full bg-gradient-to-b from-[#4a2612] via-[#241108] to-[#140803] border-y-2 border-amber-600/70 shadow-inner flex items-center justify-between px-6">
                <div className="w-12 h-1 bg-amber-500/40 rounded-full" />
                <div className="text-[10px] font-mono tracking-widest text-amber-400/80 uppercase">
                  ✠ PACTUM DIE & DIABOLI ✠
                </div>
                <div className="w-12 h-1 bg-amber-500/40 rounded-full" />
              </div>
              {/* Right Brass Finial Knob */}
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tl from-amber-900 via-yellow-500 to-amber-700 border-2 border-yellow-300 shadow-xl flex items-center justify-center text-amber-950 font-bold text-xs shrink-0">
                ❖
              </div>
            </div>

            {/* MAIN PARCHMENT BODY (AGED, CREASED, GAMBLER'S CHEAT MAP TEXTURE) */}
            <div
              className="relative mx-3 md:mx-6 px-6 sm:px-10 py-10 md:py-12 shadow-[0_25px_60px_rgba(0,0,0,0.9)] border-x-4 border-amber-900/80 rounded-sm text-[#2a1306] overflow-hidden"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 45%, #fff6e0 0%, #f7e6c4 40%, #e8cca0 70%, #c49d63 92%, #5e3914 100%)',
                boxShadow:
                  'inset 0 0 50px rgba(92, 45, 12, 0.4), inset 0 0 100px rgba(45, 18, 5, 0.25), 0 20px 40px rgba(0,0,0,0.8)',
              }}
            >
              {/* BACKGROUND GAMBLER'S MAP OVERLAYS: Wind Rose, Compass, Grid, Creases & Tarot glyphs */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                {/* Wind Rose / Astrolabe Compass centered */}
                <svg
                  viewBox="0 0 400 400"
                  className="w-full h-full text-amber-950 fill-none stroke-current"
                >
                  <circle cx="200" cy="200" r="170" strokeWidth="1" strokeDasharray="3 4" />
                  <circle cx="200" cy="200" r="140" strokeWidth="1" />
                  <circle cx="200" cy="200" r="90" strokeWidth="1.5" strokeDasharray="6 4" />
                  {/* 8-pointed star compass */}
                  <polygon
                    points="200,30 208,180 370,200 208,220 200,370 192,220 30,200 192,180"
                    fill="currentColor"
                    opacity="0.15"
                  />
                  {/* Navigational Rhumb lines */}
                  <line x1="30" y1="30" x2="370" y2="370" strokeWidth="0.8" strokeDasharray="2 3" />
                  <line x1="370" y1="30" x2="30" y2="370" strokeWidth="0.8" strokeDasharray="2 3" />
                </svg>
              </div>

              {/* Faint Card Suits & Gambler Watermarks in corners */}
              <div className="absolute top-4 left-6 text-amber-950/20 text-4xl font-serif select-none pointer-events-none">
                ♠
              </div>
              <div className="absolute top-4 right-6 text-red-950/20 text-4xl font-serif select-none pointer-events-none">
                ♥
              </div>
              <div className="absolute bottom-6 left-6 text-amber-950/20 text-4xl font-serif select-none pointer-events-none">
                ♣
              </div>
              <div className="absolute bottom-6 right-6 text-red-950/20 text-4xl font-serif select-none pointer-events-none">
                ♦
              </div>

              {/* Faded Coffee / Wine Stain on side */}
              <div
                className="absolute top-16 right-10 w-28 h-28 rounded-full border-4 border-[#7a4820]/15 pointer-events-none"
                style={{ filter: 'blur(1px)' }}
              />

              {/* Secret Gambler's Cheat Notes scribbled in margins */}
              <div className="absolute top-8 left-8 hidden sm:block -rotate-6 text-[10px] font-swirl text-[#733612] opacity-80 pointer-events-none max-w-[130px]">
                ☞ Шулерская уловка: кости Бафомета всегда краплёные...
              </div>
              <div className="absolute top-10 right-8 hidden sm:block rotate-6 text-[10px] font-swirl text-[#822416] opacity-85 pointer-events-none max-w-[130px] text-right">
                ☞ Козырной крестъ Небесъ бьетъ любую черную масть!
              </div>
              <div className="absolute bottom-28 left-8 hidden md:block rotate-3 text-[10px] font-swirl text-[#6e3518] opacity-75 pointer-events-none max-w-[140px]">
                ☞ Ставка — душа. Выигрышъ — 10 священныхъ даровъ!
              </div>

              {/* Faded Paper Fold / Crease Lines */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-amber-950/15 pointer-events-none shadow-[0_1px_2px_rgba(255,255,255,0.4)]" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-amber-950/15 pointer-events-none shadow-[1px_0_2px_rgba(255,255,255,0.4)]" />

              {/* SCROLL HEADER WITH CALLIGRAPHIC ORNAMENTS */}
              <div className="relative z-10 text-center space-y-2 border-b-2 border-amber-950/30 pb-5">
                <div className="flex items-center justify-center gap-3 text-amber-900">
                  <span className="text-xl">🂡</span>
                  <span className="text-xs uppercase tracking-widest font-mono text-amber-950 font-bold">
                    ШУЛЕРСКАЯ ГРАМОТА СУДЬБЫ • КОНЪ № 777-666
                  </span>
                  <span className="text-xl">🂮</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-vyaz font-extrabold text-[#3d1a06] tracking-wide leading-tight">
                  Тайноe Соглашеніе съ Небесами и Бездной
                </h2>

                <p className="font-swirl text-lg sm:text-xl text-[#52290d] leading-snug">
                  Писано древнею вязью во свидѣтельство баланса свѣта и тьмы
                </p>
              </div>

              {/* SWIRLING CALLIGRAPHIC CLAUSES ("ЗАВИХРЁННЫЙ ТЕКСТ") */}
              <div className="relative z-10 py-6 space-y-4 font-swirl text-base sm:text-xl text-[#2b1305] font-bold leading-relaxed">
                <p className="indent-4 sm:indent-8">
                  Симъ стариннымъ шулерскимъ свиткомъ объявляется: всякій входящій въ игру смертный получаетъ{' '}
                  <span className="text-[#872018] underline decoration-amber-900/40">ровно 10 недѣлимыхъ карточекъ жребія</span>.
                  Ни одна масть и ни одинъ грѣхъ не повторятся въ колодѣ дважды.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 border-y border-amber-950/20 my-2">
                  <div className="p-3 bg-amber-800/10 rounded border border-amber-900/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-sm font-vyaz text-amber-950">
                      <span>🕊️</span>
                      <span>Лицевая сторона (Даръ Небесъ):</span>
                    </div>
                    <p className="text-sm sm:text-base font-swirl text-[#3b1c09]">
                      Ниспосылаетъ благодать, спасаетъ душу, даруетъ чистый кайфъ и защиту Вышняго.
                    </p>
                  </div>

                  <div className="p-3 bg-red-900/10 rounded border border-red-950/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-sm font-vyaz text-red-950">
                      <span>😈</span>
                      <span>Исподняя сторона (Кара Бафомета):</span>
                    </div>
                    <p className="text-sm sm:text-base font-swirl text-[#45120d]">
                      Обрушиваетъ порчу, поносъ, удары мизинцемъ и бытовыя муки преисподней.
                    </p>
                  </div>
                </div>

                <p className="indent-4 sm:indent-8">
                  <b>Правило кона:</b> Принявъ карту — срываешь кушъ благодати, но терпишь и лихую бѣду.
                  Отвергнувъ — сжигаешь карту во прахъ. По 10 дилеммамъ шулерская карта вынесетъ окончательный судъ твоей кармѣ!
                </p>
              </div>

              {/* ================= SIGNATURE & CONTRACT FORM ================= */}
              <form onSubmit={handleStartGame} className="relative z-10 pt-4 border-t-2 border-amber-950/30 space-y-6">
                {/* Full Name Input Styled as Authentic Calligraphic Quill Blank */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-vyaz text-sm sm:text-base font-bold text-[#3d1905] flex items-center gap-2">
                      <span className="text-xl">🪶</span>
                      <span>Роспись смертнаго игрока (полное Ф.И.О.):</span>
                    </label>
                    <span className="text-[11px] font-mono text-amber-900/80">Чернила & Кровь</span>
                  </div>

                  {/* Calligraphic Handwriting Line with Quill */}
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Впиши имя: напримѣръ, Ивановъ Иванъ Ивановичъ"
                      className="w-full px-4 py-3 bg-[#f5e5c2]/80 border-b-2 border-dashed border-[#5e290e] rounded-t text-xl md:text-2xl font-swirl font-bold text-[#691717] placeholder-[#8c6747]/70 focus:outline-none focus:bg-[#fff9ea] focus:border-solid focus:border-red-900 transition shadow-inner"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none opacity-60">
                      ✒️
                    </span>
                  </div>

                  {/* Preset Wax Seals for fast picking */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-serif text-[#69391b]">Шулерскіе псевдонимы:</span>
                    {NAME_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setFullName(preset);
                          occultAudio.playHarpShimmer();
                        }}
                        className="text-xs font-serif px-2.5 py-1 rounded bg-[#ebd7b0] hover:bg-[#dfc597] text-[#3d1c09] border border-amber-900/40 transition cursor-pointer shadow-sm active:scale-95"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Archaic Checkbox with Wax Stamp Look */}
                <div className="p-3.5 rounded-lg bg-[#eddabb]/90 border border-amber-950/30 flex items-start gap-3 shadow-inner">
                  <input
                    type="checkbox"
                    id="contractConsent"
                    checked={contractAgreed}
                    onChange={(e) => {
                      setContractAgreed(e.target.checked);
                      if (e.target.checked) occultAudio.playBloodSizzle();
                    }}
                    className="w-5 h-5 mt-1 rounded border-amber-950 text-red-900 focus:ring-0 bg-[#fff5db] cursor-pointer accent-red-900"
                  />
                  <label
                    htmlFor="contractConsent"
                    className="font-swirl text-base sm:text-lg text-[#2f1406] select-none cursor-pointer leading-snug font-bold"
                  >
                    «Клянусь душою и тѣломъ честно отыграть всѣ 10 дилеммъ между Небесами (Богомъ) и Преисподней (Бафометомъ),
                    не роптать на порчи и принять итоговый вѣсъ моей кармы!»
                  </label>
                </div>

                {/* DUAL WAX SEALS DISPLAY AT BOTTOM OF SCROLL */}
                <div className="flex items-center justify-between pt-2 px-2">
                  {/* Left Golden Angelic Wax Seal */}
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 border-2 border-yellow-200 shadow-md flex items-center justify-center text-amber-950 font-bold text-sm">
                      †
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="font-vyaz text-xs font-bold text-amber-950">Печать Рая</div>
                      <div className="text-[10px] font-mono text-amber-900">№ 777-СВѢТЪ</div>
                    </div>
                  </div>

                  {/* Stamp & Start Button */}
                  <button
                    type="submit"
                    disabled={!fullName.trim() || !contractAgreed}
                    className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#941b1b] via-[#661010] to-[#360808] hover:from-[#b91c1c] hover:to-[#500a0a] text-yellow-200 font-vyaz font-bold text-sm sm:text-base tracking-wider shadow-[0_10px_25px_rgba(148,27,27,0.5)] border-2 border-amber-500/60 transition transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-2"
                  >
                    <span>🪶 ПРИПЕЧАТАТЬ СВИТОКЪ КРОВЬЮ ✍️</span>
                  </button>

                  {/* Right Blood Red Baphomet Wax Seal */}
                  <div className="flex items-center gap-2 flex-row-reverse sm:flex-row">
                    <div className="hidden sm:block text-right">
                      <div className="font-vyaz text-xs font-bold text-red-950">Печать Бездны</div>
                      <div className="text-[10px] font-mono text-red-900">№ 666-ПЕКЛО</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-950 via-red-600 to-red-900 border-2 border-red-400 shadow-md flex items-center justify-center text-yellow-300 font-bold text-sm">
                      ⛧
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* BOTTOM WOODEN SCROLL ROLLER SPINDLE */}
            <div className="relative z-20 flex items-center justify-center -mt-3 drop-shadow-[0_15px_20px_rgba(0,0,0,0.9)]">
              {/* Left Brass Knob */}
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-amber-900 via-yellow-500 to-amber-700 border-2 border-yellow-300 shadow-xl flex items-center justify-center text-amber-950 font-bold text-xs shrink-0">
                ❖
              </div>
              {/* Bottom Mahogany Bar */}
              <div className="flex-1 h-7 md:h-8 rounded-full bg-gradient-to-b from-[#4a2612] via-[#241108] to-[#140803] border-y-2 border-amber-600/70 shadow-inner flex items-center justify-center">
                <div className="text-[10px] font-mono tracking-widest text-amber-500/70 uppercase">
                  ✦ FINIS CORONAT OPUS ✦
                </div>
              </div>
              {/* Right Brass Knob */}
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tl from-amber-900 via-yellow-500 to-amber-700 border-2 border-yellow-300 shadow-xl flex items-center justify-center text-amber-950 font-bold text-xs shrink-0">
                ❖
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STAGE 2: PLAYING THE 10 DILEMMA CARDS ================= */}
      {stage === 'playing' && deck.length > 0 && (
        <div className="space-y-6 animate-fade-in font-sans">
          {/* Top Progress & Stats Bar */}
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md">
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-neutral-400">
                Кармический Пакт • {fullName}
              </div>
              <div className="text-lg font-sans font-bold text-white flex items-center gap-2">
                <span>КАРТОЧКА</span>
                <span className="text-yellow-400 font-mono text-xl">{currentIndex + 1}</span>
                <span className="text-neutral-500">из 10</span>
              </div>
            </div>

            {/* Current accepted / rejected counters */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Принято: {acceptedDeals.length}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-700/60 text-red-300 text-xs font-mono">
                <XCircle className="w-4 h-4 text-red-400" />
                <span>Отклонено: {rejectedDeals.length}</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-neutral-900 rounded-full h-2.5 overflow-hidden border border-neutral-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-red-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / 10) * 100}%` }}
            />
          </div>

          {/* ================= CARD DRAW AREA (3D PERSPECTIVE WRAPPER) ================= */}
          <div
            onClick={() => {
              if (cardAnimPhase !== 'revealed') {
                handleSkipToRevealed();
              }
            }}
            className={`relative min-h-[580px] flex items-center justify-center py-4 overflow-hidden ${
              cardAnimPhase !== 'revealed' ? 'cursor-pointer' : ''
            }`}
            style={{ perspective: 1400 }}
          >
            {deck[currentIndex] && (cardAnimPhase === 'rising' || cardAnimPhase === 'paused') && (
              /* ================= PHASE 1 & 2: TAROT CARD OF GOD & DEVIL (NO TEXT, 1 CONTINUOUS MOTION + 2S PAUSE) ================= */
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkipToRevealed();
                }}
                className={`${
                  cardAnimPhase === 'rising' ? 'animate-single-card-rise-spin' : ''
                } cursor-pointer select-none flex flex-col items-center transition-transform hover:scale-[1.01]`}
                title="Нажмите для мгновенного вскрытия"
              >
                {/* MYSTICAL TAROT CARD (SYMBOLS & ORNAMENTS OF GOD & DEVIL - ZERO TEXT) */}
                <div className="relative w-[300px] sm:w-[350px] h-[480px] sm:h-[540px] rounded-3xl p-2 bg-gradient-to-b from-[#eab308] via-[#78350f] to-[#dc2626] shadow-[0_25px_60px_rgba(0,0,0,0.95)] border border-yellow-400/80 flex flex-col justify-between overflow-hidden">
                  
                  {/* Outer Gilded Card Frame */}
                  <div className="relative w-full h-full rounded-2xl bg-[#090b14] p-3 sm:p-4 border-2 border-yellow-500/60 overflow-hidden flex flex-col justify-between">
                    
                    {/* Corner Tarot Filigree Glyphs (Zero letters) */}
                    <div className="absolute top-2 left-2 text-yellow-400 text-sm opacity-80 pointer-events-none select-none">
                      ⚜
                    </div>
                    <div className="absolute top-2 right-2 text-yellow-400 text-sm opacity-80 pointer-events-none select-none">
                      ✦
                    </div>
                    <div className="absolute bottom-2 left-2 text-red-500 text-sm opacity-80 pointer-events-none select-none">
                      ❖
                    </div>
                    <div className="absolute bottom-2 right-2 text-red-500 text-sm opacity-80 pointer-events-none select-none">
                      ⛧
                    </div>

                    {/* ================= UPPER SECTION: HEAVEN & GOD (РАЙ И БОГ) ================= */}
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-2 rounded-t-xl bg-gradient-to-b from-[#111e3b]/90 via-[#18284e]/70 to-transparent border-b border-yellow-500/40">
                      
                      {/* Radiating Sun of Tabor & Seraph Wings SVG Artwork */}
                      <svg viewBox="0 0 240 180" className="w-full h-36 sm:h-40 drop-shadow-[0_0_15px_rgba(234,179,8,0.7)]">
                        {/* Golden Tabor Sunburst Beams */}
                        <g stroke="#facc15" strokeWidth="1.5" opacity="0.6">
                          <line x1="120" y1="80" x2="120" y2="15" strokeDasharray="3 2" />
                          <line x1="120" y1="80" x2="170" y2="30" />
                          <line x1="120" y1="80" x2="195" y2="70" />
                          <line x1="120" y1="80" x2="70" y2="30" />
                          <line x1="120" y1="80" x2="45" y2="70" />
                        </g>

                        {/* Seraphim Angel Wings (Left & Right) */}
                        <path
                          d="M 120,80 C 95,45 50,35 25,60 C 15,70 20,95 45,95 C 75,95 105,85 120,80 Z"
                          fill="url(#goldWingGrad)"
                          stroke="#fef08a"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M 120,80 C 145,45 190,35 215,60 C 225,70 220,95 195,95 C 165,95 135,85 120,80 Z"
                          fill="url(#goldWingGrad)"
                          stroke="#fef08a"
                          strokeWidth="1.2"
                        />

                        {/* Sacred Radiant Halo Rings */}
                        <circle cx="120" cy="75" r="28" fill="none" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="4 2" />
                        <circle cx="120" cy="75" r="22" fill="#1c2d54" stroke="#eab308" strokeWidth="2" />

                        {/* Holy Cross of Light */}
                        <path
                          d="M 117,58 L 123,58 L 123,68 L 133,68 L 133,74 L 123,74 L 123,92 L 117,92 L 117,74 L 107,74 L 107,68 L 117,68 Z"
                          fill="#fef08a"
                          stroke="#ca8a04"
                          strokeWidth="0.8"
                        />

                        {/* Descending Holy Dove Silhouette */}
                        <path
                          d="M 120,110 C 114,106 102,112 106,120 C 112,122 118,118 120,122 C 122,118 128,122 134,120 C 138,112 126,106 120,110 Z"
                          fill="#ffffff"
                          opacity="0.9"
                        />

                        {/* Gradients */}
                        <defs>
                          <linearGradient id="goldWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fef08a" />
                            <stop offset="50%" stopColor="#eab308" />
                            <stop offset="100%" stopColor="#854d0e" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    {/* ================= CENTER: SCALES OF KARMIC DESTINY (ВЕСЫ КАРМЫ) ================= */}
                    <div className="relative py-2.5 flex items-center justify-center my-auto">
                      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-red-600" />
                      
                      {/* Sacred Balance Medallion */}
                      <div className="relative z-10 w-14 h-14 rounded-full bg-[#0e1220] border-2 border-amber-400/90 shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center justify-center">
                        {/* Dual Scales Icon with Sun & Moon */}
                        <svg viewBox="0 0 40 40" className="w-8 h-8 text-amber-300">
                          {/* Balance Beam */}
                          <line x1="8" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <line x1="20" y1="8" x2="20" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          {/* Left Pan (Heaven) */}
                          <line x1="10" y1="16" x2="6" y2="24" stroke="currentColor" strokeWidth="1" />
                          <line x1="10" y1="16" x2="14" y2="24" stroke="currentColor" strokeWidth="1" />
                          <path d="M 5,24 Q 10,27 15,24 Z" fill="currentColor" opacity="0.8" />
                          {/* Right Pan (Hell) */}
                          <line x1="30" y1="16" x2="26" y2="24" stroke="#ef4444" strokeWidth="1" />
                          <line x1="30" y1="16" x2="34" y2="24" stroke="#ef4444" strokeWidth="1" />
                          <path d="M 25,24 Q 30,27 35,24 Z" fill="#ef4444" opacity="0.8" />
                          {/* Central fulcrum eye */}
                          <circle cx="20" cy="16" r="3" fill="#facc15" />
                        </svg>
                      </div>
                    </div>

                    {/* ================= LOWER SECTION: HELL & BAPHOMET (АД И ДЬЯВОЛ) ================= */}
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-2 rounded-b-xl bg-gradient-to-t from-[#2a060a]/95 via-[#1a0407]/75 to-transparent border-t border-red-600/40">
                      
                      {/* Baphomet Ram Horns & Inverted Pentagram SVG Artwork */}
                      <svg viewBox="0 0 240 180" className="w-full h-36 sm:h-40 drop-shadow-[0_0_15px_rgba(220,38,38,0.7)]">
                        {/* Hellfire tongues rising */}
                        <g fill="#dc2626" opacity="0.35">
                          <path d="M 60,170 Q 70,125 80,145 Q 90,165 100,170 Z" />
                          <path d="M 140,170 Q 150,125 160,145 Q 170,165 180,170 Z" />
                          <path d="M 105,175 Q 120,130 135,175 Z" fill="#ef4444" opacity="0.5" />
                        </g>

                        {/* Curled Baphomet Ram Horns (Left & Right) */}
                        <path
                          d="M 120,95 C 100,70 60,60 40,85 C 25,105 45,135 65,120 C 85,105 105,98 120,95 Z"
                          fill="url(#hornGrad)"
                          stroke="#f87171"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M 120,95 C 140,70 180,60 200,85 C 215,105 195,135 175,120 C 155,105 135,98 120,95 Z"
                          fill="url(#hornGrad)"
                          stroke="#f87171"
                          strokeWidth="1.2"
                        />

                        {/* Inverted Fiery Pentagram Circle */}
                        <circle cx="120" cy="105" r="28" fill="#180407" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 2" />
                        
                        {/* Inverted Five-Pointed Star (Pentagram) */}
                        <polygon
                          points="120,130 126,112 144,112 130,101 135,83 120,94 105,83 110,101 96,112 114,112"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                        />

                        {/* Demonic Glowing Goat Eyes */}
                        <ellipse cx="112" cy="106" rx="3" ry="1.5" fill="#facc15" />
                        <ellipse cx="128" cy="106" rx="3" ry="1.5" fill="#facc15" />

                        {/* Sulfur Alchemy Sigil (Cross over Infinity) */}
                        <path
                          d="M 120,145 L 120,165 M 112,152 L 128,152 M 112,157 L 128,157"
                          stroke="#b91c1c"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />

                        {/* Gradients */}
                        <defs>
                          <linearGradient id="hornGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#450a0a" />
                            <stop offset="50%" stopColor="#991b1b" />
                            <stop offset="100%" stopColor="#ef4444" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* ================= PHASE 3: SETTLED CARD & UNFURLED SCRIPTURAL TABLET ================= */}
            {deck[currentIndex] && cardAnimPhase === 'revealed' && (
              <div className="animate-tablet-unfurl w-full space-y-6">
                
                {/* THE PHYSICAL SCRIPTURAL TABLET / SCROLL OF FATE */}
                <div
                  className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 shadow-2xl backdrop-blur-md ${
                    cardTransition === 'accepting'
                      ? 'border-emerald-400 ring-4 ring-emerald-500/40 scale-102 bg-[#0c1914]'
                      : cardTransition === 'rejecting'
                      ? 'border-red-600 ring-4 ring-red-600/40 opacity-50 scale-98 bg-[#180a0d]'
                      : 'border-amber-500/60 bg-[#0c0e17]'
                  }`}
                >
                  {/* Top Half: THE BLESSED GIFT (ДАР НЕБЕС 🕊️) */}
                  <div className="p-6 md:p-8 bg-gradient-to-b from-[#141b2c] to-[#0c121f] border-b-2 border-amber-600/50 relative overflow-hidden">
                    {/* Angelic background glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-bold font-sans">
                            <span>🕊️ ДАР НЕБЕС</span>
                            <span className="text-white/60">• BlessedTools</span>
                          </span>

                          {/* Hardcore blessing badge */}
                          {deck[currentIndex].blessing.gracePower >= 120 && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[11px] font-extrabold uppercase animate-pulse shadow-md font-sans">
                              <span>⚡ СУПЕР ЖЁСТКИЙ ДАР ⚡</span>
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-mono text-amber-300 font-bold bg-amber-950/80 px-2.5 py-1 rounded border border-amber-700">
                          Сила: +{deck[currentIndex].blessing.gracePower} ед.
                        </span>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="text-4xl md:text-5xl p-3 rounded-2xl bg-black/40 border border-amber-500/40 shadow-inner shrink-0">
                          {deck[currentIndex].blessing.icon}
                        </div>

                        <div className="space-y-1.5 flex-1">
                          <h3 className="text-xl md:text-2xl font-bold font-sans text-yellow-300 leading-snug">
                            {deck[currentIndex].blessing.title}
                          </h3>
                          <p className="text-xs md:text-sm text-neutral-200 font-sans leading-relaxed">
                            {deck[currentIndex].blessing.description}
                          </p>
                        </div>
                      </div>

                      {/* Effects List */}
                      <div className="pt-2 flex flex-wrap gap-2">
                        {deck[currentIndex].blessing.effects.map((eff, i) => (
                          <span
                            key={i}
                            className="text-xs px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 flex items-center gap-1.5 font-sans"
                          >
                            <span className="text-yellow-400">✦</span>
                            <span>{eff}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CENTER DIVIDER OF DESTINY: THE SCALE & LINE */}
                  <div className="relative py-2.5 bg-[#090b12] border-y border-amber-500/40 flex items-center justify-center">
                    <div className="absolute inset-x-0 h-px bg-gradient-to-r from-yellow-500 via-amber-400 to-red-600" />
                    <div className="relative z-10 px-4 py-1 rounded-full bg-[#121624] border border-amber-500/60 text-xs font-sans font-bold text-amber-200 flex items-center gap-2 shadow-lg">
                      <Scale className="w-3.5 h-3.5 text-yellow-400" />
                      <span>ДИЛЕММА СУДЬБЫ • ВЫБОР ЗА ТОБОЙ</span>
                      <Flame className="w-3.5 h-3.5 text-red-500" />
                    </div>
                  </div>

                  {/* Bottom Half: THE INFERNAL CURSE (ПОРЧА БАФОМЕТА 🔥) */}
                  <div className="p-6 md:p-8 bg-gradient-to-b from-[#18080b] to-[#100406] relative overflow-hidden">
                    {/* Demonic background glow */}
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-bold font-sans">
                            <span>😈 ПОРЧА БАФОМЕТА</span>
                            <span className="text-white/60">• CursedTools</span>
                          </span>

                          {/* Hardcore curse badge */}
                          {deck[currentIndex].curse.severity === 'apocalyptic' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-red-900 text-white text-[11px] font-extrabold uppercase animate-pulse shadow-md border border-red-400/50 font-sans">
                              <span>🔥 СУПЕР ЖЁСТКАЯ КАРА 🔥</span>
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-mono text-red-400 font-bold bg-red-950/80 px-2.5 py-1 rounded border border-red-800 uppercase">
                          Тяжесть: {deck[currentIndex].curse.severity}
                        </span>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="text-4xl md:text-5xl p-3 rounded-2xl bg-black/40 border border-red-500/40 shadow-inner shrink-0">
                          {deck[currentIndex].curse.icon}
                        </div>

                        <div className="space-y-1.5 flex-1">
                          <h3 className="text-xl md:text-2xl font-bold font-sans text-red-400 leading-snug">
                            {deck[currentIndex].curse.title}
                          </h3>
                          <p className="text-xs md:text-sm text-neutral-300 font-sans leading-relaxed">
                            {deck[currentIndex].curse.description}
                          </p>
                        </div>
                      </div>

                      {/* Symptoms List */}
                      <div className="pt-2 flex flex-wrap gap-2">
                        {deck[currentIndex].curse.symptoms.map((symp, i) => (
                          <span
                            key={i}
                            className="text-xs px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-800/60 text-red-200 flex items-center gap-1.5 font-sans"
                          >
                            <span className="text-red-500">⛧</span>
                            <span>{symp}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Choice Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={() => handleDecision('reject')}
                    disabled={cardTransition !== 'idle'}
                    className="py-4 px-6 rounded-2xl bg-[#1b1013] hover:bg-red-950/80 border-2 border-red-700/60 hover:border-red-500 text-red-300 hover:text-white font-sans font-bold text-sm md:text-base tracking-wider transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span>ОТКЛОНИТЬ КАРТОЧКУ (СЖЕЧЬ) ❌</span>
                  </button>

                  <button
                    onClick={() => handleDecision('accept')}
                    disabled={cardTransition !== 'idle'}
                    className="py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-sans font-bold text-sm md:text-base tracking-wider transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.5)] disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-5 h-5 text-black" />
                    <span>ПРИНЯТЬ СДЕЛКУ ЦЕЛИКОМ 🤝</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================= PHYSICAL DECK OF CARDS AT THE BOTTOM ================= */}
          <div className="pt-2 flex flex-col items-center justify-center gap-2 select-none pointer-events-none">
            {/* Layered stack of cards with gilded foil edges */}
            <div className="relative w-44 h-12 flex items-center justify-center">
              {/* Card 4 (lowest layer) */}
              <div className="absolute inset-0 bg-[#291307] rounded-xl border border-yellow-700/30 transform translate-y-3 scale-90 opacity-40 shadow-sm" />
              {/* Card 3 */}
              <div className="absolute inset-0 bg-[#3d1c0b] rounded-xl border border-yellow-600/40 transform translate-y-2 scale-94 opacity-60 shadow-sm" />
              {/* Card 2 */}
              <div className="absolute inset-0 bg-[#4a240e] rounded-xl border border-yellow-500/50 transform translate-y-1 scale-97 opacity-80 shadow-md" />
              {/* Card 1 (top of deck) */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1c2c4d] via-[#121626] to-[#2c080d] rounded-xl border-2 border-yellow-400/80 shadow-lg flex items-center justify-between px-3">
                <span className="text-xs text-yellow-300">🕊️ †</span>
                <span className="text-[10px] font-mono tracking-widest text-amber-200 font-bold uppercase">
                  КОЛОДА СУДЬБЫ
                </span>
                <span className="text-xs text-red-400">⛧ 😈</span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-neutral-400">
              Осталось в колоде: <span className="text-yellow-400 font-bold">{10 - currentIndex}</span> из 10 карт
            </div>
          </div>
        </div>
      )}

      {/* ================= STAGE 3: RESULTS OF THE PACT ================= */}
      {stage === 'results' && (
        <div className="space-y-8 animate-fade-in font-sans">
          {/* Final Archetype Verdict */}
          {(() => {
            const verdict = getKarmicTitle(acceptedDeals.length);
            return (
              <div className="text-center space-y-4 bg-[#0d101a] border-2 border-yellow-500/60 rounded-3xl p-6 md:p-10 shadow-[0_0_40px_rgba(245,158,11,0.3)] relative overflow-hidden font-sans">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-4xl shadow-xl">
                  ⚖️
                </div>

                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-widest text-amber-300 font-mono">
                    СУДЕБНЫЙ ВЕРДИКТ КАРМЫ ДЛЯ: <span className="text-white font-bold">{fullName}</span>
                  </div>

                  <h2 className="text-2xl md:text-4xl font-sans font-extrabold text-yellow-300">
                    {verdict.title}
                  </h2>

                  <p className="text-neutral-300 max-w-lg mx-auto text-sm md:text-base font-sans">
                    {verdict.subtitle}
                  </p>
                </div>

                {/* Score Pills */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <span className="px-4 py-2 rounded-xl bg-emerald-950/70 border border-emerald-600 text-emerald-300 text-sm font-bold font-mono">
                    Принято сделок: {acceptedDeals.length} из 10
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-red-950/70 border border-red-700 text-red-300 text-sm font-bold font-mono">
                    Отклонено: {rejectedDeals.length}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* TWO COLUMNS: ACCEPTED BLESSINGS & ACCEPTED CURSES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Accepted Blessings */}
            <div className="bg-[#0b1220]/90 border border-amber-600/50 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-900/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🕊️</span>
                  <h3 className="font-sans font-bold text-lg text-yellow-300">
                    Твои Благословения ({acceptedDeals.length})
                  </h3>
                </div>
                <span className="text-xs text-amber-400 font-mono">БАФФЫ</span>
              </div>

              {acceptedDeals.length === 0 ? (
                <div className="text-center py-8 text-neutral-400 text-xs italic font-sans">
                  Ни один дар не был принят. Твоя судьба осталась без благодати.
                </div>
              ) : (
                <div className="space-y-3">
                  {acceptedDeals.map((deal, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#070b14] border border-amber-800/40 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{deal.blessing.icon}</span>
                        <h4 className="font-bold text-sm text-yellow-200 font-sans">{deal.blessing.title}</h4>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                        {deal.blessing.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Accepted Curses */}
            <div className="bg-[#190a0d]/90 border border-red-700/50 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-red-950/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">😈</span>
                  <h3 className="font-sans font-bold text-lg text-red-400">
                    Твои Проклятия ({acceptedDeals.length})
                  </h3>
                </div>
                <span className="text-xs text-red-400 font-mono">ДЕБАФФЫ</span>
              </div>

              {acceptedDeals.length === 0 ? (
                <div className="text-center py-8 text-neutral-400 text-xs italic font-sans">
                  Ни одна порча не поразила тебя. Ты абсолютно чист от инфернальных кар.
                </div>
              ) : (
                <div className="space-y-3">
                  {acceptedDeals.map((deal, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#0e0406] border border-red-900/40 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{deal.curse.icon}</span>
                        <h4 className="font-bold text-sm text-red-300 font-sans">{deal.curse.title}</h4>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                        {deal.curse.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-black font-sans font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Сыграть Снова (Новые 10 Дилемм)</span>
            </button>

            <button
              onClick={handleCopyResults}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-semibold text-sm transition cursor-pointer flex items-center justify-center gap-2"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Скопировано в буфер!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>Скопировать Итоги Кармы</span>
                </>
              )}
            </button>

            <button
              onClick={onBackToHome}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-black/60 hover:bg-black/90 border border-neutral-800 text-neutral-300 hover:text-white text-sm transition cursor-pointer"
            >
              На Главную
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
