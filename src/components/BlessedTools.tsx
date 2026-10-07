import React, { useState } from 'react';
import {
  BlessingCategory,
  BlessingRank,
  BlessingTemplate,
  BlessedSoul,
  BlessingHistoryItem,
} from '../types/blessed';
import {
  BLESSINGS_CATALOG,
  PATRON_SAINTS,
  HOLY_RELICS,
  PatronSaint,
  HolyRelic,
} from '../data/blessingsData';
import {
  Sparkles,
  Search,
  Check,
  Shield,
  Heart,
  Droplets,
  Flame,
  UserCheck,
  Award,
  Scroll,
  History,
  BookOpen,
  ArrowRight,
  Sun,
  Smile,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { occultAudio } from '../utils/audio';

interface BlessedToolsProps {
  blessedSouls: BlessedSoul[];
  blessingHistory: BlessingHistoryItem[];
  onSaveSoul: (soul: BlessedSoul) => Promise<void>;
  onDeleteSoul: (soulId: string) => Promise<void>;
  onSaveHistory: (item: BlessingHistoryItem) => Promise<void>;
  isDbConnected: boolean;
}

type BlessedTab = 'bestow' | 'sanctuary' | 'chronicle' | 'confessional';

export const BlessedTools: React.FC<BlessedToolsProps> = ({
  blessedSouls,
  blessingHistory,
  onSaveSoul,
  onDeleteSoul,
  onSaveHistory,
  isDbConnected,
}) => {
  const [activeTab, setActiveTab] = useState<BlessedTab>('bestow');

  // Bestow Form State
  const [fullName, setFullName] = useState('');
  const [selectedPatron, setSelectedPatron] = useState<PatronSaint>(PATRON_SAINTS[0]);
  const [selectedRelic, setSelectedRelic] = useState<HolyRelic>(HOLY_RELICS[0]);
  const [selectedBlessingIds, setSelectedBlessingIds] = useState<string[]>([
    'green-wave',
    'instant-deep-sleep',
    'adamantine-spine',
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BlessingCategory | 'all'>('all');
  const [isBestowing, setIsBestowing] = useState(false);
  const [showCeremonyModal, setShowCeremonyModal] = useState(false);
  const [lastBestowedSoul, setLastBestowedSoul] = useState<BlessedSoul | null>(null);

  // Confessional State
  const [confessionText, setConfessionText] = useState('');
  const [absolutionResult, setAbsolutionResult] = useState<string | null>(null);

  const NAME_PRESETS = [
    'Иванов Иван Иванович',
    'Смирнова Анна Михайловна',
    'Васильев Максим Игоревич',
    'Кузнецова Елена Петровна',
    'Попов Дмитрий Сергеевич',
  ];

  // Filtering blessings
  const filteredBlessings = BLESSINGS_CATALOG.filter((blessing) => {
    const matchesSearch =
      blessing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blessing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blessing.effects.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || blessing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleBlessing = (id: string) => {
    occultAudio.playHarpShimmer();
    setSelectedBlessingIds((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    occultAudio.playHolyBells();
    setSelectedBlessingIds(BLESSINGS_CATALOG.map((b) => b.id));
  };

  const handleClearSelection = () => {
    setSelectedBlessingIds([]);
  };

  // Perform Divine Bestowal Ceremony
  const handleBestowBlessings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || selectedBlessingIds.length === 0) return;

    setIsBestowing(true);
    occultAudio.playHolyBells();
    occultAudio.playAngelicChant();

    const chosenBlessings = BLESSINGS_CATALOG.filter((b) => selectedBlessingIds.includes(b.id));
    const totalPower = chosenBlessings.reduce((acc, curr) => acc + curr.gracePower, 0);
    const calculatedGrace = Math.min(60 + Math.floor(totalPower / 10), 100);

    const newSoul: BlessedSoul = {
      id: Math.random().toString(36).substring(2, 11),
      fullName: fullName.trim(),
      blessings: chosenBlessings,
      rank: calculatedGrace > 85 ? 'archangelic' : calculatedGrace > 70 ? 'saintly' : 'light',
      patronSaint: selectedPatron.name,
      holyRelic: selectedRelic.name,
      createdAt: new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sanctified',
      graceLevel: calculatedGrace,
      intercessor: selectedPatron.name,
      logs: [
        {
          id: Math.random().toString(36).substring(2, 8),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: `Небесный покров ниспослан. Защитник: ${selectedPatron.name}. Святыня: ${selectedRelic.name}. Ниспослано даров: ${chosenBlessings.length}.`,
          type: 'blessing',
        },
      ],
    };

    const historyItem: BlessingHistoryItem = {
      id: Math.random().toString(36).substring(2, 11),
      soulName: fullName.trim(),
      blessingTitle: chosenBlessings.map((b) => b.title).slice(0, 3).join(', ') + (chosenBlessings.length > 3 ? ' и др.' : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      patronSaint: selectedPatron.name,
      statusText: `Осенён благодатью ${calculatedGrace}% под покровом ${selectedPatron.name}`,
      graceGained: calculatedGrace,
    };

    try {
      await onSaveSoul(newSoul);
      await onSaveHistory(historyItem);
      setLastBestowedSoul(newSoul);
      setShowCeremonyModal(true);
    } finally {
      setIsBestowing(false);
    }
  };

  // Quick Anoint with Holy Water in Sanctuary
  const handleSprinkleHolyWater = async (soul: BlessedSoul) => {
    occultAudio.playHarpShimmer();
    const updated: BlessedSoul = {
      ...soul,
      graceLevel: Math.min(soul.graceLevel + 15, 100),
      status: soul.graceLevel + 15 >= 100 ? 'canonized' : 'protected',
      logs: [
        {
          id: Math.random().toString(36).substring(2, 8),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: `Окропление святой иорданской водой. Благодать усилена до ${Math.min(soul.graceLevel + 15, 100)}%.`,
          type: 'miracle',
        },
        ...soul.logs,
      ],
    };
    await onSaveSoul(updated);
  };

  // Handle Confession
  const handleCleanseSin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confessionText.trim()) return;
    occultAudio.playAngelicChant();
    const absolutions = [
      'Грех ночного похода к холодильнику отпущен! Все калории растворены в небесном сиянии.',
      'Грех пятикратного откладывания будильника прощен! С этого мига даруется утренняя бодрость.',
      'Грех ворчания на прохожих рассеян! В сердце вливается мир и вселенская кротость.',
      'Грех забытого полива комнатного цветка отпущен! Растение воспрянет и зацветет как в Эдеме.',
      'Грех покупки ненужной вещи на распродаже списан! Финансовая благодать возвращена в кошелек.',
    ];
    setAbsolutionResult(absolutions[Math.floor(Math.random() * absolutions.length)]);
  };

  return (
    <div className="space-y-8 relative z-10 pb-16">
      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-amber-900/40 pb-4">
        {[
          { id: 'bestow', label: 'Храм Благодати ✨', icon: Sun },
          { id: 'sanctuary', label: `Обитель Спасённых (${blessedSouls.length}) 🕊️`, icon: UserCheck },
          { id: 'chronicle', label: `Летопись Чудес (${blessingHistory.length}) 📜`, icon: BookOpen },
          { id: 'confessional', label: 'Исповедальня грехов 🕯️', icon: Heart },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as BlessedTab);
                occultAudio.playHarpShimmer();
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-yellow-300/60'
                  : 'bg-black/50 text-neutral-300 hover:text-white border border-amber-950/60 hover:border-amber-700/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BESTOW DIVINE GIFTS (ХРАМ БЛАГОДАТИ) */}
      {activeTab === 'bestow' && (
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
              <Sun className="w-3.5 h-3.5 text-yellow-400 animate-spin-slow" />
              <span>Храм Высшего Небесного Покрова и Благословения</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            </div>

            <h1 className="text-4xl md:text-6xl font-cinzel tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-yellow-600 drop-shadow-[0_4px_25px_rgba(245,158,11,0.8)]">
              BLESSEDTOOLS 🕊️
            </h1>

            <p className="text-neutral-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-serif">
              Введи ФИО человека, избери Небесного Покровителя и наполни жизнь праведника изощренными бытовыми и духовными чудесами из Книги Благословений.
            </p>
          </div>

          {/* Console Form */}
          <form onSubmit={handleBestowBlessings} className="space-y-8">
            {/* Person Card & Catalysts */}
            <div className="bg-[#0b101c]/90 border-2 border-amber-600/50 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_40px_rgba(217,119,6,0.25)] relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Target Full Name */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-widest text-amber-300 font-bold flex items-center gap-1.5 font-cinzel">
                      <Sun className="w-4 h-4 text-yellow-400 animate-pulse" />
                      <span>ФИО Человека для ниспослания благодати:</span>
                    </label>
                    <span className="text-[11px] text-amber-200/60 font-mono">Только полное ФИО</span>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Например: Смирнов Артем Сергеевич"
                      className="w-full px-5 py-4 bg-[#060913] border-2 border-amber-600/60 rounded-xl text-lg md:text-xl text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40 shadow-inner font-semibold transition"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 font-serif text-sm pointer-events-none">
                      🕊️ SANCTUARY
                    </span>
                  </div>

                  {/* Quick Presets */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs text-amber-200/60">Быстрые имена:</span>
                    {NAME_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setFullName(preset);
                          occultAudio.playHarpShimmer();
                        }}
                        className="text-xs px-2.5 py-1 rounded-md bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 hover:text-white border border-amber-800/60 hover:border-yellow-500 transition cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patron Saint & Relic Selectors */}
                <div className="lg:col-span-4 bg-[#070b14] border border-amber-800/40 p-4 rounded-xl space-y-3">
                  <div>
                    <span className="text-xs text-amber-300 uppercase tracking-wider block mb-1.5 font-bold font-cinzel">
                      Небесный Заступник:
                    </span>
                    <select
                      value={selectedPatron.id}
                      onChange={(e) => {
                        const saint = PATRON_SAINTS.find((s) => s.id === e.target.value);
                        if (saint) setSelectedPatron(saint);
                        occultAudio.playHarpShimmer();
                      }}
                      className="w-full bg-[#0d1424] border border-amber-700/60 rounded-lg px-3 py-2 text-xs text-amber-100 focus:outline-none focus:border-yellow-400"
                    >
                      {PATRON_SAINTS.map((saint) => (
                        <option key={saint.id} value={saint.id}>
                          {saint.icon} {saint.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-neutral-400 mt-1 italic">{selectedPatron.specialty}</p>
                  </div>

                  <div>
                    <span className="text-xs text-amber-300 uppercase tracking-wider block mb-1 font-bold font-cinzel">
                      Святыня-Катализатор:
                    </span>
                    <select
                      value={selectedRelic.id}
                      onChange={(e) => {
                        const relic = HOLY_RELICS.find((r) => r.id === e.target.value);
                        if (relic) setSelectedRelic(relic);
                        occultAudio.playHarpShimmer();
                      }}
                      className="w-full bg-[#0d1424] border border-amber-700/60 rounded-lg px-3 py-2 text-xs text-amber-100 focus:outline-none focus:border-yellow-400"
                    >
                      {HOLY_RELICS.map((relic) => (
                        <option key={relic.id} value={relic.id}>
                          {relic.icon} {relic.name} ({relic.power})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* GRIMOIRE OF BLESSINGS (CATALOG) */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🕊️</span>
                    <h2 className="text-2xl font-cinzel text-yellow-400 tracking-wide font-bold">
                      КНИГА БЛАГОСЛОВЕНИЙ И ДАРОВ
                    </h2>
                    <span className="text-xs bg-amber-950 text-amber-300 px-2 py-0.5 rounded-full border border-amber-700">
                      {BLESSINGS_CATALOG.length} видов благодати
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Отметь один или сразу целое созвездие даров для ниспослания человеку
                  </p>
                </div>

                {/* Quick Selection Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-800 transition cursor-pointer"
                  >
                    Выбрать Все ({BLESSINGS_CATALOG.length})
                  </button>
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="text-xs px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800 transition cursor-pointer"
                  >
                    Сбросить
                  </button>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по дарам, исцелению, кофе, котам, светофорам..."
                    className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-amber-900/60 rounded-xl text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {[
                    { id: 'all', label: 'Все' },
                    { id: 'domestic', label: 'Быт 🟢' },
                    { id: 'health', label: 'Здоровье 😴' },
                    { id: 'career', label: 'Карьера 💼' },
                    { id: 'spiritual', label: 'Покой 🕊️' },
                    { id: 'miracle', label: 'Чудеса 🌟' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id as BlessingCategory | 'all')}
                      className={`text-xs px-3 py-2 rounded-lg whitespace-nowrap transition cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-amber-600 text-white font-bold border border-yellow-300'
                          : 'bg-black/40 text-neutral-400 hover:text-white border border-neutral-900'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blessings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredBlessings.map((blessing) => {
                  const isSelected = selectedBlessingIds.includes(blessing.id);
                  return (
                    <div
                      key={blessing.id}
                      onClick={() => toggleBlessing(blessing.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between relative overflow-hidden group ${
                        isSelected
                          ? 'bg-[#10182c] border-yellow-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] scale-[1.01]'
                          : 'bg-[#080d19]/80 border-amber-950/70 hover:border-amber-700/60 hover:bg-[#0c1324]'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl p-1.5 bg-black/40 rounded-lg border border-amber-900/40">
                            {blessing.icon}
                          </span>
                          <div className="flex-1 pr-6">
                            <h3 className="font-bold text-sm text-amber-200 group-hover:text-yellow-300 transition">
                              {blessing.title}
                            </h3>
                            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400/80">
                              Сила: +{blessing.gracePower} ед.
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-neutral-300 leading-relaxed font-serif">
                          {blessing.description}
                        </p>
                      </div>

                      {/* Effects List */}
                      <div className="mt-3 pt-2.5 border-t border-amber-950/50 space-y-1">
                        {blessing.effects.map((eff, i) => (
                          <div key={i} className="text-[11px] text-amber-100/70 flex items-center gap-1.5">
                            <span className="text-yellow-400 text-xs">✦</span>
                            <span>{eff}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Bestowal Button */}
            <div className="sticky bottom-4 z-20">
              <div className="bg-black/90 p-4 rounded-2xl border-2 border-yellow-500 shadow-[0_0_35px_rgba(245,158,11,0.5)] backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-400 flex items-center justify-center text-yellow-400">
                    <Sun className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2 font-cinzel">
                      <span>Выбрано даров:</span>
                      <span className="text-yellow-400 font-mono text-base">
                        {selectedBlessingIds.length} из {BLESSINGS_CATALOG.length}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400">
                      Цель: <span className="text-amber-300 font-semibold">{fullName || 'Не указано'}</span> • База данных:{' '}
                      <span className="text-yellow-400 font-mono font-bold">Sanctuary</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isBestowing || !fullName.trim() || selectedBlessingIds.length === 0}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-cinzel font-bold text-sm tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sun className="w-4 h-4" />
                  <span>ОСЕНИТЬ БЛАГОДАТЬЮ 🕊️</span>
                </button>
              </div>
            </div>
          </form>

          {/* Celebration Ceremony Modal */}
          {showCeremonyModal && lastBestowedSoul && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
              <div className="bg-[#0b101c] border-2 border-yellow-400 rounded-3xl max-w-lg w-full p-6 md:p-8 text-center space-y-5 shadow-[0_0_60px_rgba(245,158,11,0.8)] relative">
                <div className="w-20 h-20 mx-auto rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(245,158,11,0.7)] animate-bounce">
                  🕊️
                </div>

                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-widest text-amber-300 font-mono">
                    СВЯЩЕННЫЙ ОБРЯД ЗАВЕРШЁН
                  </div>
                  <h3 className="text-2xl md:text-3xl font-cinzel font-bold text-yellow-300">
                    Благодать Ниспослана!
                  </h3>
                  <p className="text-neutral-300 text-sm font-serif">
                    Душа раба Божьего <span className="text-yellow-400 font-bold">{lastBestowedSoul.fullName}</span> осенена покровом{' '}
                    <span className="text-amber-300">{lastBestowedSoul.patronSaint}</span> и внесена в Обитель Спасённых.
                  </p>
                </div>

                <div className="p-4 bg-black/50 border border-amber-800/60 rounded-xl space-y-2 text-left">
                  <div className="flex justify-between text-xs text-neutral-400 font-mono">
                    <span>Уровень Благодати:</span>
                    <span className="text-yellow-400 font-bold">{lastBestowedSoul.graceLevel}%</span>
                  </div>
                  <div className="w-full bg-neutral-900 rounded-full h-2.5 overflow-hidden border border-amber-900">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 shadow-[0_0_10px_rgba(245,158,11,1)]"
                      style={{ width: `${lastBestowedSoul.graceLevel}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-amber-200/80 italic text-center pt-1">
                    «Мир входящему, благословение исходящему. Ангелы хранят тебя на всех путях твоих.»
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowCeremonyModal(false);
                    setActiveTab('sanctuary');
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-cinzel font-bold text-sm tracking-wider transition cursor-pointer hover:brightness-110 shadow-lg"
                >
                  Перейти в Обитель Спасённых (Sanctuary)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SANCTUARY REGISTRY (ОБИТЕЛЬ СПАСЁННЫХ) */}
      {activeTab === 'sanctuary' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🕊️</span>
                <h2 className="text-2xl font-cinzel text-yellow-400 font-bold">
                  ОБИТЕЛЬ СПАСЁННЫХ (SANCTUARY)
                </h2>
              </div>
              <p className="text-xs text-neutral-400">
                Реестр праведных душ под нерушимым покровом Небесных Заступников
              </p>
            </div>

            <button
              onClick={() => setActiveTab('bestow')}
              className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition flex items-center gap-2 self-start cursor-pointer"
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Осенить Нового Человека</span>
            </button>
          </div>

          {blessedSouls.length === 0 ? (
            <div className="text-center py-16 bg-[#0b101c]/80 border-2 border-dashed border-amber-900/60 rounded-2xl space-y-4">
              <span className="text-5xl">🕯️</span>
              <h3 className="text-xl font-cinzel text-amber-300">Обитель пока пуста</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Внеси первое имя праведника в Храме Благодати, чтобы наделить его нерушимой защитой и радостью.
              </p>
              <button
                onClick={() => setActiveTab('bestow')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xs cursor-pointer"
              >
                Ниспослать благодать
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blessedSouls.map((soul) => (
                <div
                  key={soul.id}
                  className="bg-[#0b101c]/90 border border-amber-700/60 rounded-2xl p-5 space-y-4 relative overflow-hidden backdrop-blur-md shadow-[0_0_25px_rgba(217,119,6,0.15)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🕊️</span>
                        <h3 className="font-bold text-lg text-white font-serif">{soul.fullName}</h3>
                      </div>
                      <div className="text-xs text-amber-300 font-mono mt-0.5">
                        Покровитель: {soul.patronSaint} • {soul.holyRelic}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${
                        soul.graceLevel >= 90
                          ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40'
                          : 'bg-amber-600/20 text-amber-300 border-amber-600/40'
                      }`}
                    >
                      {soul.status === 'canonized' ? 'Канонизирован 👑' : 'Под покровом 🛡️'}
                    </span>
                  </div>

                  {/* Grace Level Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-neutral-400 font-mono">
                      <span>Сила благодати:</span>
                      <span className="text-yellow-400 font-bold">{soul.graceLevel}%</span>
                    </div>
                    <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-amber-950">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300"
                        style={{ width: `${soul.graceLevel}%` }}
                      />
                    </div>
                  </div>

                  {/* Blessings Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {soul.blessings.slice(0, 4).map((b) => (
                      <span
                        key={b.id}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-800/40 text-amber-200"
                      >
                        {b.icon} {b.title}
                      </span>
                    ))}
                    {soul.blessings.length > 4 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-black/60 border border-neutral-800 text-neutral-400">
                        +{soul.blessings.length - 4} ещё
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-amber-950/60 flex items-center justify-between">
                    <button
                      onClick={() => handleSprinkleHolyWater(soul)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/40 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Droplets className="w-3.5 h-3.5 text-blue-400" />
                      <span>Окропить Святой Водой (+15%)</span>
                    </button>

                    <button
                      onClick={() => onDeleteSoul(soul.id)}
                      className="text-xs p-1.5 rounded-lg text-neutral-500 hover:text-red-400 transition cursor-pointer"
                      title="Отпустить с миром из реестра"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CHRONICLE OF MIRACLES (ЛЕТОПИСЬ ЧУДЕС) */}
      {activeTab === 'chronicle' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📜</span>
              <h2 className="text-2xl font-cinzel text-yellow-400 font-bold">
                ЛЕТОПИСЬ НЕБЕСНЫХ ЧУДЕС
              </h2>
            </div>
            <p className="text-xs text-neutral-400">
              Архив всех свершенных обрядов, заступничеств и ниспосланных даров
            </p>
          </div>

          {blessingHistory.length === 0 ? (
            <div className="text-center py-16 bg-[#0b101c]/80 border border-amber-950 rounded-2xl text-neutral-400 text-sm">
              Летопись пока чиста. Сверши первый обряд в Храме Благодати!
            </div>
          ) : (
            <div className="space-y-3">
              {blessingHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0b101c]/80 border border-amber-900/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">✨</span>
                      <span className="font-bold text-white font-serif">{item.soulName}</span>
                      <span className="text-xs text-amber-400/80 font-mono">({item.timestamp})</span>
                    </div>
                    <div className="text-xs text-neutral-300">{item.statusText}</div>
                    <div className="text-[11px] text-amber-200/60 italic">Дары: {item.blessingTitle}</div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-300 border border-yellow-400/30">
                      +{item.graceGained} Благодати
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CONFESSIONAL OF MINOR SINS (ИСПОВЕДАЛЬНЯ) */}
      {activeTab === 'confessional' && (
        <div className="max-w-2xl mx-auto bg-[#0b101c]/90 border-2 border-amber-600/50 rounded-2xl p-6 md:p-8 space-y-6 text-center backdrop-blur-md shadow-[0_0_35px_rgba(217,119,6,0.25)]">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-yellow-400 flex items-center justify-center text-3xl">
            🕯️
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-cinzel text-yellow-300 font-bold">
              Исповедальня Бытовых Грехов
            </h2>
            <p className="text-xs text-neutral-300 font-serif leading-relaxed">
              Съел ночной бутерброд? Проспал будильник? Мысленно поругал соседа? Покайся здесь и получи мгновенное небесное отпущение без епитимий!
            </p>
          </div>

          <form onSubmit={handleCleanseSin} className="space-y-4">
            <textarea
              required
              rows={3}
              value={confessionText}
              onChange={(e) => setConfessionText(e.target.value)}
              placeholder="В чем твой тайный бытовой грех? (Например: съел всю коробку конфет втайне от домашних...)"
              className="w-full p-4 bg-black/60 border border-amber-800/60 rounded-xl text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-400 font-serif"
            />

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-cinzel font-bold text-sm tracking-wider shadow-lg hover:brightness-110 cursor-pointer transition"
            >
              ПОЛУЧИТЬ ОТПУЩЕНИЕ ГРЕХА 🕊️
            </button>
          </form>

          {absolutionResult && (
            <div className="p-4 bg-yellow-400/10 border border-yellow-400/50 rounded-xl text-left space-y-2 animate-fade-in">
              <div className="text-xs uppercase tracking-wider text-yellow-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>ОТПУЩЕНО ВЫСШИМ ДЕКРЕТОМ:</span>
              </div>
              <p className="text-sm text-amber-100 font-serif leading-relaxed">
                {absolutionResult}
              </p>
              <div className="text-[11px] text-neutral-400 italic">
                Совесть чиста. Ступай с миром и больше не грусти!
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
