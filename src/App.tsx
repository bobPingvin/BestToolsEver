import React, { useState, useEffect } from 'react';
import { CursedVictim, RitualHistoryItem } from './types/curse';
import { BlessedSoul, BlessingHistoryItem } from './types/blessed';
import { CURSES_CATALOG } from './data/cursesData';
import { BLESSINGS_CATALOG } from './data/blessingsData';
import { BestToolsHome } from './components/BestToolsHome';
import { HexMaster } from './components/HexMaster';
import { VictimsRegistry } from './components/VictimsRegistry';
import { HistoryLog } from './components/HistoryLog';
import { ExcuseForge } from './components/ExcuseForge';
import { SinOMeter } from './components/SinOMeter';
import { BloodDrips } from './components/BloodDrips';
import { PentagramBackground } from './components/PentagramBackground';
import { BlessedTools } from './components/BlessedTools';
import { HolyCrossBackground } from './components/HolyCrossBackground';
import { AngelicRays } from './components/AngelicRays';
import { KarmicPactGame } from './components/KarmicPactGame';
import { occultAudio } from './utils/audio';
import {
  subscribeToVictims,
  subscribeToHistory,
  saveVictimToFirestore,
  deleteVictimFromFirestore,
  saveHistoryToFirestore,
  subscribeToBlessedSouls,
  subscribeToBlessingHistory,
  saveBlessedSoulToFirestore,
  deleteBlessedSoulFromFirestore,
  saveBlessingHistoryToFirestore,
} from './services/dbService';
import {
  Flame,
  Scroll,
  History,
  Volume2,
  VolumeX,
  ArrowLeft,
  Database,
  Brain,
  Sparkles,
  Sun,
  Scale,
} from 'lucide-react';

// Seed Victims for initial display
const SEED_VICTIMS: CursedVictim[] = [
  {
    id: 'victim-1',
    fullName: 'Иванов Иван Иванович',
    alias: 'Бывший начальник',
    targetGender: 'male',
    curses: [CURSES_CATALOG[0], CURSES_CATALOG[1]],
    severityLevel: 'severe',
    sacrificeItem: 'Черная свеча из овечьего жира',
    createdAt: '28 сентября 2026, 18:40',
    status: 'active',
    agonyLevel: 85,
    sealedBy: 'Магистр Черного Кода Асмодей',
    logs: [
      {
        id: '1',
        timestamp: '18:40',
        event: 'Инфернальный канал пробит. Скверна высвобождена через Базу Corrupter.',
        severity: 'high',
      },
      {
        id: '2',
        timestamp: '19:15',
        event: 'Зафиксирован первый удар мизинцем об угол кровати. Сила вопля: 9.2 балла.',
        severity: 'high',
      },
    ],
  },
  {
    id: 'victim-2',
    fullName: 'Петров Сидор Алексеевич',
    alias: 'Сосед с перфоратором в субботу',
    targetGender: 'male',
    curses: [CURSES_CATALOG[2]],
    severityLevel: 'apocalyptic',
    sacrificeItem: 'Клок шерсти черного кота',
    createdAt: '29 сентября 2026, 09:12',
    status: 'infiltrating',
    agonyLevel: 60,
    sealedBy: 'Баалзебуб Повелитель Мух',
    logs: [
      {
        id: '1',
        timestamp: '09:12',
        event: 'Порча на понос в метро на перегоне Театральная — Охотный Ряд активирована.',
        severity: 'high',
      },
    ],
  },
];

// Seed Blessed Souls for initial display
const SEED_BLESSED_SOULS: BlessedSoul[] = [
  {
    id: 'soul-1',
    fullName: 'Смирнов Артем Сергеевич',
    blessings: [BLESSINGS_CATALOG[0], BLESSINGS_CATALOG[9], BLESSINGS_CATALOG[16]],
    rank: 'archangelic',
    patronSaint: 'Архистратиг Михаил',
    holyRelic: 'Иорданская Святая Вода',
    createdAt: '29 сентября 2026, 12:00',
    status: 'sanctified',
    graceLevel: 95,
    intercessor: 'Архистратиг Михаил',
    logs: [
      {
        id: 'log-1',
        timestamp: '12:00',
        event: 'Небесный покров ниспослан. Защитник: Архистратиг Михаил. Сила благодати 95%.',
        type: 'blessing',
      },
    ],
  },
  {
    id: 'soul-2',
    fullName: 'Васильева Елена Павловна',
    blessings: [BLESSINGS_CATALOG[1], BLESSINGS_CATALOG[10], BLESSINGS_CATALOG[24]],
    rank: 'saintly',
    patronSaint: 'Серафим Саровский',
    holyRelic: 'Афонский Ладан «Роза Валаама»',
    createdAt: '29 сентября 2026, 14:30',
    status: 'canonized',
    graceLevel: 88,
    intercessor: 'Серафим Саровский',
    logs: [
      {
        id: 'log-2',
        timestamp: '14:30',
        event: 'Освящение покровом Преподобного Серафима Саровского («Радость моя!»).',
        type: 'miracle',
      },
    ],
  },
];

type MainView = 'home' | 'cursed_tools' | 'blessed_tools' | 'karmic_pact';
type CursedSubTab = 'hexmaster' | 'registry' | 'history' | 'excuses' | 'sinometer';

export default function App() {
  // App views: 'home' is the default landing on BestToolsEver!
  const [currentView, setCurrentView] = useState<MainView>('home');
  const [cursedTab, setCursedTab] = useState<CursedSubTab>('hexmaster');

  // Mute audio state
  const [isMuted, setIsMuted] = useState(occultAudio.isMuted);

  // Corrupter DB State with offline-first localStorage cache
  const [victims, setVictims] = useState<CursedVictim[]>(() => {
    try {
      const saved = localStorage.getItem('cursed_tools_victims');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return SEED_VICTIMS;
  });

  const [history, setHistory] = useState<RitualHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('cursed_tools_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Sanctuary DB State (BlessedTools)
  const [blessedSouls, setBlessedSouls] = useState<BlessedSoul[]>(() => {
    try {
      const saved = localStorage.getItem('blessed_tools_souls');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return SEED_BLESSED_SOULS;
  });

  const [blessingHistory, setBlessingHistory] = useState<BlessingHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('blessed_tools_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isDbConnected, setIsDbConnected] = useState(true);

  // Global audio unlock on first user interaction
  useEffect(() => {
    const unlockAudio = () => {
      occultAudio.ensureContext();
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Play entry sounds whenever view switches to BlessedTools or CursedTools
  useEffect(() => {
    if (currentView === 'blessed_tools') {
      occultAudio.playVibratingAngelicChoir();
    } else if (currentView === 'cursed_tools') {
      occultAudio.playCursedReversePianoWithRoar();
    }
  }, [currentView]);

  // Sync to local cache
  useEffect(() => {
    try {
      localStorage.setItem('cursed_tools_victims', JSON.stringify(victims));
    } catch {
      // ignore
    }
  }, [victims]);

  useEffect(() => {
    try {
      localStorage.setItem('cursed_tools_history', JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('blessed_tools_souls', JSON.stringify(blessedSouls));
    } catch {
      // ignore
    }
  }, [blessedSouls]);

  useEffect(() => {
    try {
      localStorage.setItem('blessed_tools_history', JSON.stringify(blessingHistory));
    } catch {
      // ignore
    }
  }, [blessingHistory]);

  // Subscribe to real-time Firestore database for both Corrupter and Sanctuary
  useEffect(() => {
    let isInitialLoad = true;

    // Corrupter Subscriptions
    const unsubVictims = subscribeToVictims(
      (dbVictims) => {
        setIsDbConnected(true);
        if (dbVictims && dbVictims.length > 0) {
          setVictims(dbVictims);
        } else if (isInitialLoad && (!victims || victims.length === 0)) {
          SEED_VICTIMS.forEach((sv) => {
            saveVictimToFirestore(sv).catch(() => {});
          });
          setVictims(SEED_VICTIMS);
        }
        isInitialLoad = false;
      },
      () => {
        setIsDbConnected(false);
      }
    );

    const unsubHistory = subscribeToHistory(
      (dbHistory) => {
        if (dbHistory && dbHistory.length > 0) {
          setHistory(dbHistory);
        }
      }
    );

    // Sanctuary Subscriptions
    const unsubSouls = subscribeToBlessedSouls(
      (dbSouls) => {
        if (dbSouls && dbSouls.length > 0) {
          setBlessedSouls(dbSouls);
        } else if (isInitialLoad && (!blessedSouls || blessedSouls.length === 0)) {
          SEED_BLESSED_SOULS.forEach((bs) => {
            saveBlessedSoulToFirestore(bs).catch(() => {});
          });
          setBlessedSouls(SEED_BLESSED_SOULS);
        }
      }
    );

    const unsubBlessingHistory = subscribeToBlessingHistory(
      (dbBlessingHist) => {
        if (dbBlessingHist && dbBlessingHist.length > 0) {
          setBlessingHistory(dbBlessingHist);
        }
      }
    );

    return () => {
      unsubVictims();
      unsubHistory();
      unsubSouls();
      unsubBlessingHistory();
    };
  }, []);

  // Audio Toggle
  const toggleSound = () => {
    const newState = occultAudio.toggleMute();
    setIsMuted(newState);
    if (!newState) {
      if (currentView === 'blessed_tools') {
        occultAudio.playVibratingAngelicChoir();
      } else {
        occultAudio.playCursedReversePianoWithRoar();
      }
    }
  };

  // Callback when a new curse is applied -> saves to database
  const handleCurseApplied = async (newVictim: CursedVictim) => {
    setVictims((prev) => [newVictim, ...prev]);
    await saveVictimToFirestore(newVictim);

    const historyItem: RitualHistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      victimName: newVictim.fullName,
      curseTitle: newVictim.curses.map((c) => c.title).join(' + '),
      timestamp: newVictim.createdAt,
      energySpent: Math.floor(150 + Math.random() * 200),
      demonName: newVictim.sealedBy,
      statusText: 'Внедрено в ауру',
    };
    setHistory((prev) => [historyItem, ...prev]);
    await saveHistoryToFirestore(historyItem);
  };

  // Update victims list (e.g. from Registry) -> syncs with Firestore
  const handleUpdateVictims = (updatedList: CursedVictim[]) => {
    setVictims(updatedList);
    updatedList.forEach((v) => {
      saveVictimToFirestore(v).catch(() => {});
    });

    const updatedIds = new Set(updatedList.map((u) => u.id));
    victims.forEach((v) => {
      if (!updatedIds.has(v.id)) {
        deleteVictimFromFirestore(v.id).catch(() => {});
      }
    });
  };

  const handleOpenCursedTools = (subTab: CursedSubTab = 'hexmaster') => {
    setCursedTab(subTab);
    setCurrentView('cursed_tools');
    occultAudio.playCursedReversePianoWithRoar();
  };

  const handleOpenBlessedTools = () => {
    setCurrentView('blessed_tools');
    occultAudio.playVibratingAngelicChoir();
  };

  const handleOpenKarmicPact = () => {
    setCurrentView('karmic_pact');
    occultAudio.playHolyBells();
  };

  // 1. Initial / Home View: "BestToolsEver!"
  if (currentView === 'home') {
    return (
      <BestToolsHome
        onOpenCursedTools={handleOpenCursedTools}
        onOpenBlessedTools={handleOpenBlessedTools}
        onOpenKarmicPact={handleOpenKarmicPact}
        victims={victims}
        blessedCount={blessedSouls.length}
        isDbConnected={isDbConnected}
      />
    );
  }

  // 2. Karmic Pact Game View (Contract between God & Baphomet)
  if (currentView === 'karmic_pact') {
    return (
      <div className="min-h-screen bg-[#07070b] text-neutral-100 relative overflow-x-hidden selection:bg-amber-600 selection:text-white flex flex-col justify-between">
        {/* Subtle dual background aura */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-amber-600/10 via-yellow-600/5 to-transparent" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600/10 via-red-950/15 to-transparent" />
        </div>

        <KarmicPactGame
          onBackToHome={() => setCurrentView('home')}
          onOpenCursedTools={() => handleOpenCursedTools('hexmaster')}
          onOpenBlessedTools={handleOpenBlessedTools}
        />

        <footer className="relative z-10 border-t border-neutral-800/80 bg-black/60 backdrop-blur-sm py-4 px-4 text-center text-xs text-neutral-400">
          <p>Кармический Пакт ⚖️ • Двусторонний договор между Небесами и Преисподней. BestToolsEver!</p>
        </footer>
      </div>
    );
  }

  // 3. BlessedTools View (Divine Grace, Holy Cross & Light)
  if (currentView === 'blessed_tools') {
    return (
      <div className="min-h-screen bg-[#070b14] text-neutral-100 relative overflow-x-hidden selection:bg-amber-600 selection:text-white flex flex-col justify-between">
        {/* Visual Celestial FX: Radiant Holy Christian Cross & Tabor Light */}
        <HolyCrossBackground />

        {/* Golden Divine Header with clean top spacing for the divine god rays */}
        <header className="relative z-20 pt-16 sm:pt-20 pb-4 px-4 md:px-8 border-b border-amber-900/50 bg-[#080d19]/80 backdrop-blur-md">
          {/* Visual Celestial FX: Radiant Angelic God Rays Overhead */}
          <AngelicRays />

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setCurrentView('home');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-semibold transition cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Главная</span>
              </button>

              <button
                onClick={handleOpenKarmicPact}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-red-500/20 hover:from-amber-500/30 hover:to-red-500/30 text-yellow-300 border border-yellow-500/50 text-xs font-semibold transition cursor-pointer shadow-sm"
                title="Перейти в Кармический Пакт (Сделка с Богом и Дьяволом)"
              >
                <Scale className="w-3.5 h-3.5 text-yellow-400" />
                <span>Кармический Пакт ⚖️</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('cursed_tools');
                  occultAudio.playCursedReversePianoWithRoar();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-200 border border-red-800/80 text-xs font-semibold transition cursor-pointer shadow-sm"
                title="Перейти в CursedTools (Тьма и Порчи)"
              >
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span>В CursedTools 😈</span>
              </button>

              <div className="flex items-center gap-2 pl-2">
                <span className="text-2xl">🕊️</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-xl font-bold text-yellow-300 tracking-wider">
                      BlessedTools ✨
                    </span>
                    <span className="text-[10px] bg-amber-950/90 text-yellow-300 px-2 py-0.5 rounded border border-yellow-500/50 font-mono">
                      Sanctuary Core ✦
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-200/70 font-serif">
                    Храм Благодати, Освящения и Святых Чудес
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-800 text-xs text-yellow-300 font-mono shadow-sm">
                <Sun className="w-3.5 h-3.5 text-yellow-400 animate-spin-slow" />
                <span>Sanctuary: {blessedSouls.length} душ</span>
              </div>

              <button
                onClick={toggleSound}
                className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isMuted
                    ? 'bg-neutral-900 border-neutral-700 text-neutral-400'
                    : 'bg-amber-950/80 border-yellow-400 text-yellow-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                }`}
                title={isMuted ? 'Включить колокола' : 'Выключить звук'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-yellow-400" />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Blessed Console Content */}
        <div className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full relative z-10">
          <BlessedTools
            blessedSouls={blessedSouls}
            blessingHistory={blessingHistory}
            onSaveSoul={async (soul) => {
              setBlessedSouls((prev) => {
                const idx = prev.findIndex((s) => s.id === soul.id);
                if (idx >= 0) {
                  const copy = [...prev];
                  copy[idx] = soul;
                  return copy;
                }
                return [soul, ...prev];
              });
              await saveBlessedSoulToFirestore(soul);
            }}
            onDeleteSoul={async (soulId) => {
              setBlessedSouls((prev) => prev.filter((s) => s.id !== soulId));
              await deleteBlessedSoulFromFirestore(soulId);
            }}
            onSaveHistory={async (item) => {
              setBlessingHistory((prev) => [item, ...prev]);
              await saveBlessingHistoryToFirestore(item);
            }}
            isDbConnected={isDbConnected}
          />
        </div>

        {/* Divine Footer */}
        <footer className="relative z-10 border-t border-amber-900/40 bg-black/60 backdrop-blur-sm py-4 px-4 text-center text-xs text-amber-200/50">
          <p>BlessedTools 🕊️ • Обитель Спасённых. Мир входящему, благословение исходящему.</p>
        </footer>
      </div>
    );
  }

  // 3. CursedTools View (Full Dark Satanic Occult Experience)
  return (
    <div className="min-h-screen bg-[#070506] text-neutral-100 relative overflow-x-hidden selection:bg-red-900 selection:text-white flex flex-col justify-between">
      {/* Visual Occult FX: Animated Rotating Pentagram & Burning Embers */}
      <PentagramBackground />

      {/* Header and Navigation with clean top spacing for the glowing blood canopy */}
      <header className="relative z-20 pt-16 sm:pt-20 pb-0 px-4 md:px-8 border-b border-red-950/70 bg-black/75 backdrop-blur-md">
        {/* Visual Occult FX: Blood Dripping Top Screen Overlay */}
        <BloodDrips />

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 relative z-10">
          {/* Back button & Brand */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setCurrentView('home');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-semibold transition cursor-pointer shadow-sm"
              title="Вернуться на главную BestToolsEver!"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Главная</span>
            </button>

            <button
              onClick={handleOpenKarmicPact}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-red-500/20 hover:from-amber-500/30 hover:to-red-500/30 text-yellow-300 border border-yellow-500/50 text-xs font-semibold transition cursor-pointer shadow-sm"
              title="Перейти в Кармический Пакт (Сделка с Богом и Дьяволом)"
            >
              <Scale className="w-3.5 h-3.5 text-yellow-400" />
              <span>Кармический Пакт ⚖️</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('blessed_tools');
                occultAudio.playVibratingAngelicChoir();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-yellow-300 border border-yellow-500/50 text-xs font-semibold transition cursor-pointer shadow-sm"
              title="Перейти в BlessedTools (Свет и Благодать)"
            >
              <Sun className="w-3.5 h-3.5 text-yellow-400" />
              <span>В BlessedTools 🕊️</span>
            </button>

            <div
              onClick={() => {
                setCursedTab('hexmaster');
                occultAudio.playBloodSizzle();
              }}
              className="flex items-center gap-2 cursor-pointer select-none pl-2"
            >
              <span className="text-xl">😈</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-gothic text-xl md:text-2xl font-bold tracking-wider text-red-500 drop-shadow-[0_2px_10px_rgba(239,68,68,0.8)]">
                    CursedTools 😈
                  </span>
                  <span className="text-[10px] bg-red-950/90 text-red-300 px-2 py-0.5 rounded border border-red-800 font-mono">
                    Corrupter Core ⛧
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 font-serif">
                  Служба бытового возмездия и кармических расплат
                </p>
              </div>
            </div>
          </div>

          {/* Database status and Sound Toggle */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-900/60 text-[11px] text-red-400 font-mono">
              <Database className="w-3 h-3 text-red-400 animate-pulse" />
              <span>Corrupter: {victims.length} душ</span>
            </div>

            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isMuted
                  ? 'bg-neutral-900 border-neutral-700 text-neutral-400'
                  : 'bg-red-950/80 border-red-600 text-red-200 shadow-[0_0_12px_rgba(220,38,38,0.5)]'
              }`}
              title={isMuted ? 'Включить адские звуки' : 'Заглушить адские звуки'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-red-400" />}
            </button>
          </div>
        </div>

        {/* CursedTools Navigation Bar */}
        <div className="max-w-6xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto pt-2 border-t border-red-950/40 -mb-px">
          {[
            { id: 'hexmaster', label: 'Порчегенератор 3000', icon: Flame },
            { id: 'registry', label: `Реестр Возмездия (${victims.length})`, icon: Scroll },
            { id: 'history', label: `Хроника Кар (${history.length})`, icon: History },
            { id: 'excuses', label: 'ExcuseForge (Отмазки)', icon: Brain },
            { id: 'sinometer', label: 'SinOMeter (Грехометр)', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = cursedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCursedTab(tab.id as CursedSubTab);
                  occultAudio.playBloodSizzle();
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all border-t border-x cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#100a0d] border-red-800 text-red-400 shadow-[0_-4px_15px_rgba(185,28,28,0.25)]'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-500' : 'text-neutral-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Cursed SubTab Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full relative z-10">
        {cursedTab === 'hexmaster' && (
          <HexMaster
            onCurseApplied={handleCurseApplied}
            onGoToRegistry={() => setCursedTab('registry')}
          />
        )}

        {cursedTab === 'registry' && (
          <VictimsRegistry
            victims={victims}
            onUpdateVictims={handleUpdateVictims}
            onNavigateToCast={() => setCursedTab('hexmaster')}
          />
        )}

        {cursedTab === 'history' && (
          <HistoryLog
            history={history}
            totalCursesCast={victims.reduce((acc, v) => acc + (v.curses?.length || 0), 0)}
          />
        )}

        {cursedTab === 'excuses' && <ExcuseForge />}

        {cursedTab === 'sinometer' && <SinOMeter />}
      </main>

      {/* Infernal Dark Footer */}
      <footer className="relative z-10 border-t border-red-950/60 bg-black/60 backdrop-blur-sm py-4 px-4 text-center text-xs text-neutral-500">
        <p>CursedTools 😈 • Служба бытового возмездия. Используйте исключительно в сатирических целях.</p>
      </footer>
    </div>
  );
}
