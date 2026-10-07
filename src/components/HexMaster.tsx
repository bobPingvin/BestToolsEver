import React, { useState, useMemo } from 'react';
import { CurseTemplate, CurseCategory, CurseSeverity, CursedVictim } from '../types/curse';
import { CURSES_CATALOG, CATEGORY_LABELS, SACRIFICE_ITEMS, DEMONS_LIST } from '../data/cursesData';
import { occultAudio } from '../utils/audio';
import { RitualModal } from './RitualModal';
import { CreatorProtectionModal } from './CreatorProtectionModal';
import {
  Flame,
  Search,
  Sparkles,
  Skull,
  Crosshair,
  Filter,
  Check,
  AlertOctagon,
  Info,
  Dices,
  ShieldAlert,
} from 'lucide-react';

interface HexMasterProps {
  onCurseApplied: (victim: CursedVictim) => void;
  onGoToRegistry: () => void;
}

export const HexMaster: React.FC<HexMasterProps> = ({ onCurseApplied, onGoToRegistry }) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [selectedCurseIds, setSelectedCurseIds] = useState<string[]>(['diarrhea-metro']);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [severity, setSeverity] = useState<CurseSeverity>('apocalyptic');
  const [selectedSacrifice, setSelectedSacrifice] = useState<string>(SACRIFICE_ITEMS[0].name);
  const [showRitualModal, setShowRitualModal] = useState(false);
  const [showCreatorShield, setShowCreatorShield] = useState(false);
  const [currentDemon, setCurrentDemon] = useState(DEMONS_LIST[0]);
  const [lastCreatedVictim, setLastCreatedVictim] = useState<CursedVictim | null>(null);

  // Easter egg: check if victim is the creator of the app
  const isCreatorName = (name: string): boolean => {
    const normalized = name
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/\s+/g, ' ')
      .trim();
    return normalized === 'журавлев максим вячеславович';
  };

  // Quick full name presets (real Russian ФИО)
  const NAME_PRESETS = [
    'Иванов Иван Иванович',
    'Смирнов Артем Сергеевич',
    'Петров Сидор Алексеевич',
    'Кузнецов Дмитрий Павлович',
    'Васильев Максим Игоревич',
  ];

  // Filtered Curses Catalog
  const filteredCurses = useMemo(() => {
    return CURSES_CATALOG.filter((curse) => {
      const matchCat = selectedCategory === 'all' || curse.category === selectedCategory;
      const matchQuery =
        curse.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        curse.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        curse.symptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const selectedCurseObjects = useMemo(() => {
    return CURSES_CATALOG.filter((c) => selectedCurseIds.includes(c.id));
  }, [selectedCurseIds]);

  const handleToggleCurse = (id: string) => {
    occultAudio.playBloodSizzle();
    setSelectedCurseIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleRandomize = () => {
    occultAudio.playRitualPulse();
    const randomCurse = CURSES_CATALOG[Math.floor(Math.random() * CURSES_CATALOG.length)];
    setSelectedCurseIds([randomCurse.id]);
    setSelectedSacrifice(SACRIFICE_ITEMS[Math.floor(Math.random() * SACRIFICE_ITEMS.length)].name);
  };

  const handleExecuteRitual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    // Easter egg check: Creator immunity
    if (isCreatorName(fullName)) {
      setShowCreatorShield(true);
      return;
    }

    const chosenDemon = DEMONS_LIST[Math.floor(Math.random() * DEMONS_LIST.length)];
    setCurrentDemon(chosenDemon);

    // Calculate baseline agony based on severity and number of curses
    const baseAgony = severity === 'mild' ? 45 : severity === 'severe' ? 75 : 95;
    const curseBonus = Math.min(selectedCurseObjects.length * 5, 25);
    const agonyLevel = Math.min(baseAgony + curseBonus, 100);

    const newVictim: CursedVictim = {
      id: Math.random().toString(36).substring(2, 11),
      fullName: fullName.trim(),
      curses: selectedCurseObjects,
      severityLevel: severity,
      sacrificeItem: selectedSacrifice,
      createdAt: new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'infiltrating',
      agonyLevel,
      sealedBy: chosenDemon,
      logs: [
        {
          id: 'log-1',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: `Инфернальный канал пробит. Скверна высвобождена в ауру через Базу Corrupter. Наложено проклятий: ${selectedCurseObjects.length}.`,
          severity: 'high',
        },
      ],
    };

    setLastCreatedVictim(newVictim);
    onCurseApplied(newVictim);
    setShowRitualModal(true);
  };

  return (
    <div className="relative z-10 max-w-6xl mx-auto space-y-8 pb-16">
      {/* Intro Banner */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 text-xs tracking-widest uppercase font-mono shadow-[0_0_15px_rgba(220,38,38,0.5)]">
          <Flame className="w-3.5 h-3.5 text-red-500 animate-flame" />
          <span>Орудие Высшего Астрального Наказания</span>
          <Flame className="w-3.5 h-3.5 text-red-500 animate-flame" />
        </div>

        <h1 className="text-4xl md:text-6xl font-gothic tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-red-400 via-red-600 to-red-900 drop-shadow-[0_4px_25px_rgba(220,38,38,0.9)]">
          ПОРЧЕГЕНЕРАТОР 3000
        </h1>

        <p className="text-neutral-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Введи ФИО своего недруга, выбери одну или целый букет изощренных проклятий из гигантского каталога и нажми на кнопку вызова инфернального возмездия.
        </p>
      </div>

      {/* Main Casting Console */}
      <form onSubmit={handleExecuteRitual} className="space-y-8">
        {/* Victim Input & Occult Target Card */}
        <div className="bg-[#100a0d]/90 border-2 border-red-900/70 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_40px_rgba(153,27,27,0.3)] relative overflow-hidden">
          {/* Subtle pentagram corner decoration */}
          <div className="absolute -top-10 -right-10 w-44 h-44 opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-red-500 fill-none">
              <polygon points="50,90 20,25 90,52 10,52 80,25" strokeWidth="2" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Target Input */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest text-red-400 font-bold flex items-center gap-1.5">
                  <Crosshair className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>ФИО Жертвы для наведения порчи:</span>
                </label>
                <span className="text-[11px] text-neutral-500 font-mono">Только полное ФИО (Фамилия Имя Отчество)</span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Например: Иванов Иван Иванович"
                  className="w-full px-5 py-4 bg-[#080507] border-2 border-red-950/80 rounded-xl text-lg md:text-xl text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-600/50 shadow-inner font-semibold transition"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-700 font-mono text-sm pointer-events-none">
                  ⛧ CORRUPTER
                </span>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-neutral-500">Быстрые цели:</span>
                {NAME_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setFullName(preset);
                      occultAudio.playBloodSizzle();
                    }}
                    className="text-xs px-2.5 py-1 rounded-md bg-neutral-900/90 hover:bg-red-950 text-neutral-400 hover:text-red-300 border border-neutral-800 hover:border-red-800 transition cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Level & Sacrifice selector */}
            <div className="lg:col-span-4 bg-[#0a0608] border border-red-950 p-4 rounded-xl space-y-3">
              <div>
                <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-1.5 font-bold">
                  Степень Скверны:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['mild', 'severe', 'apocalyptic'] as CurseSeverity[]).map((lvl) => {
                    const titles: Record<CurseSeverity, string> = {
                      mild: 'Бытовая',
                      severe: 'Ядерная',
                      apocalyptic: 'Геенна',
                    };
                    const isSelected = severity === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => {
                          setSeverity(lvl);
                          occultAudio.playBloodSizzle();
                        }}
                        className={`text-xs py-2 px-1 rounded-lg border font-bold text-center transition cursor-pointer ${
                          isSelected
                            ? 'bg-red-900/80 border-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        {titles[lvl]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-1 font-bold">
                  Катализатор / Жертвоприношение:
                </span>
                <select
                  value={selectedSacrifice}
                  onChange={(e) => setSelectedSacrifice(e.target.value)}
                  className="w-full bg-[#120a0d] border border-red-950 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-red-600"
                >
                  {SACRIFICE_ITEMS.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.icon} {item.name} ({item.power})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* HUGE Curses Catalog Section */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <h2 className="text-2xl font-gothic text-red-500 tracking-wide">
                  ГРИМУАР ПРОКЛЯТИЙ
                </h2>
                <span className="text-xs bg-red-950 text-red-300 px-2 py-0.5 rounded-full border border-red-800">
                  {CURSES_CATALOG.length} видов скверны
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Выбери одно или несколько проклятий для комбо-возмездия (выбрано:{' '}
                <span className="text-red-400 font-bold">{selectedCurseIds.length}</span>)
              </p>
            </div>

            {/* Randomizer & Reset */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRandomize}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-red-950 text-neutral-300 hover:text-red-300 border border-neutral-800 hover:border-red-800 rounded-lg text-xs transition cursor-pointer"
              >
                <Dices className="w-3.5 h-3.5 text-red-400" />
                <span>Случайная кара</span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter Chips */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск проклятия (понос, мизинец, носок, Windows, шаурма, лифт...)"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a0608] border border-red-950 rounded-xl text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-red-600 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-white"
                >
                  Очистить
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {Object.entries(CATEGORY_LABELS).map(([catKey, catData]) => {
                const isActive = selectedCategory === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(catKey);
                      occultAudio.playBloodSizzle();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer border ${
                      isActive
                        ? 'bg-red-900 border-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.5)]'
                        : 'bg-[#110b0d] border-red-950/80 text-neutral-400 hover:text-neutral-200 hover:border-red-900'
                    }`}
                  >
                    <span>{catData.icon}</span>
                    <span>{catData.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid of Curses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCurses.map((curse) => {
              const isSelected = selectedCurseIds.includes(curse.id);
              return (
                <div
                  key={curse.id}
                  onClick={() => handleToggleCurse(curse.id)}
                  className={`group relative rounded-xl p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1f0d11] border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.35)] translate-y-[-2px]'
                      : 'bg-[#0f090b]/80 border-red-950/70 hover:border-red-900 hover:bg-[#150c0f]'
                  }`}
                >
                  <div>
                    {/* Top Row: Icon, Title, Checkbox */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl select-none">{curse.icon}</span>
                        <h3 className="font-bold text-sm text-neutral-100 group-hover:text-red-300 transition leading-snug">
                          {curse.title}
                        </h3>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 ${
                          isSelected
                            ? 'bg-red-600 border-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                            : 'border-neutral-800 bg-neutral-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-neutral-400 leading-relaxed mb-3 line-clamp-3">
                      {curse.description}
                    </p>

                    {/* Latin Chant */}
                    <div className="text-[11px] font-medieval text-red-400/90 italic mb-3 bg-black/40 px-2.5 py-1 rounded border border-red-950/60 truncate">
                      «{curse.latinIncantation}»
                    </div>
                  </div>

                  {/* Symptoms & Footer badges */}
                  <div className="pt-2 border-t border-red-950/60 flex items-center justify-between text-[10px] text-neutral-500">
                    <span className="truncate max-w-[170px] text-neutral-400">
                      ⚡ {curse.symptoms[0]}
                    </span>
                    <span className="font-mono text-red-500 font-bold shrink-0">
                      {curse.castSuccessChance}% шанс
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky/Floating Satanic Action Bar */}
        <div className="sticky bottom-6 z-30 bg-[#0e070a]/95 border-2 border-red-700/80 rounded-2xl p-4 md:p-5 backdrop-blur-lg shadow-[0_0_50px_rgba(220,38,38,0.6)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-950 border border-red-600 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              <Skull className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-red-400 font-bold">
                Готовность ритуала:
              </div>
              <div className="text-sm text-neutral-300">
                Цель: <span className="font-bold text-white">{fullName || 'Не указана'}</span> • Порч:{' '}
                <span className="text-red-400 font-bold">{selectedCurseIds.length}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!fullName.trim()}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-800 via-red-600 to-red-800 hover:from-red-700 hover:via-red-500 hover:to-red-700 text-white font-gothic tracking-widest text-lg md:text-xl rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.8)] border border-red-400 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Flame className="w-6 h-6 animate-flame text-amber-300" />
            <span>🔥 НАВЕСТИ ПОРЧУ ВО ИМЯ ТЬМЫ 🔥</span>
            <Flame className="w-6 h-6 animate-flame text-amber-300" />
          </button>
        </div>
      </form>

      {/* Ritual Cutscene Modal */}
      {showRitualModal && (
        <RitualModal
          victimName={fullName}
          selectedCurses={selectedCurseObjects}
          severity={severity}
          sacrificeName={selectedSacrifice}
          demonName={currentDemon}
          onClose={() => setShowRitualModal(false)}
          onGoToRegistry={() => {
            setShowRitualModal(false);
            onGoToRegistry();
          }}
        />
      )}

      {/* Easter Egg: Creator Immunity Warning Modal */}
      {showCreatorShield && (
        <CreatorProtectionModal
          onClose={() => {
            setShowCreatorShield(false);
            setFullName('');
          }}
        />
      )}
    </div>
  );
};
