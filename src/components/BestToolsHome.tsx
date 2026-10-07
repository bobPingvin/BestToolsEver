import React, { useState } from 'react';
import { CursedVictim } from '../types/curse';
import {
  Wrench,
  Flame,
  Brain,
  Skull,
  Search,
  ExternalLink,
  Sparkles,
  Database,
  ArrowRight,
  ShieldCheck,
  Cat,
  Coffee,
  Users,
  Clock,
  Sun,
  Heart,
  Scale,
} from 'lucide-react';
import { occultAudio } from '../utils/audio';

interface BestToolsHomeProps {
  onOpenCursedTools: (initialSubTab?: 'hexmaster' | 'registry' | 'excuses' | 'sinometer') => void;
  onOpenBlessedTools: () => void;
  onOpenKarmicPact: () => void;
  victims: CursedVictim[];
  blessedCount: number;
  isDbConnected: boolean;
}

export const BestToolsHome: React.FC<BestToolsHomeProps> = ({
  onOpenCursedTools,
  onOpenBlessedTools,
  onOpenKarmicPact,
  victims,
  blessedCount,
  isDbConnected,
}) => {
  const [search, setSearch] = useState('');

  const tools = [
    {
      id: 'karmic-pact',
      title: 'Кармический Пакт ⚖️ 📜',
      badge: 'НОВЫЙ РЕЖИМ • БОГ vs БАФОМЕТ',
      badgeColor: 'bg-gradient-to-r from-amber-500/20 to-red-500/20 text-yellow-300 border-amber-500/50',
      description:
        'Подпиши контракт одновременно с Богом и Бафометом! Прими или сожги 10 уникальных дилемм судьбы: на каждой карточке через черту 1 дар (BlessedTools) и 1 порча (CursedTools). Узнай итоговый суд кармы для своей души!',
      tags: ['Контракт', '10 Дилемм', 'Дар + Порча', 'Суд Кармы', 'Без Повторов'],
      actionText: 'Заключить Пакт ✍️',
      isPrimary: true,
      isPact: true,
      onClick: () => {
        occultAudio.playHolyBells();
        onOpenKarmicPact();
      },
      stats: '10 карточек судьбы',
    },
    {
      id: 'blessed-tools',
      title: 'BlessedTools 🕊️ ✨',
      badge: 'НОВИНКА • ВЫСШАЯ БЛАГОДАТЬ 🕊️',
      badgeColor: 'bg-amber-500/20 text-yellow-300 border-yellow-500/50',
      description:
        'Храм Благодати и Освящения: ниспослание даров на человека (ФИО), зеленая волна на светофорах, сладкие арбузы, мгновенный сон за 90 секунд, золотой крест, покровительство Архангелов и священная база данных Sanctuary.',
      tags: ['Благословение', 'Освящение', 'Святой Крест', '30+ Даров', 'База Sanctuary'],
      actionText: 'Войти в Храм Благодати 🕊️',
      isPrimary: true,
      isBlessed: true,
      onClick: () => {
        occultAudio.playVibratingAngelicChoir();
        onOpenBlessedTools();
      },
      stats: `База Sanctuary: ${blessedCount} душ`,
    },
    {
      id: 'cursed-tools',
      title: 'CursedTools 😈',
      badge: 'ГЛАВНЫЙ ИНСТРУМЕНТ • ТЬМА 🔥',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
      description:
        'Порчегенератор 3000: наведение порчи на понос в метро, удар мизинцем об угол кровати, BSOD и 35+ изощренных бытовых кар. Реестр Возмездия, мониторинг страданий, анимированная кровь, пентаграммы и инфернальная база душ Corrupter.',
      tags: ['Порчегенератор', 'Реестр Возмездия', 'Кровь и Пентаграммы', 'База Corrupter'],
      actionText: 'Запустить CursedTools 😈',
      isPrimary: true,
      isBlessed: false,
      onClick: () => {
        occultAudio.playCursedReversePianoWithRoar();
        onOpenCursedTools('hexmaster');
      },
      stats: `База Corrupter: ${victims.length} душ`,
    },
    {
      id: 'excuse-forge',
      title: 'ExcuseForge 🧠',
      badge: 'СПАСЕНИЕ ОТ БОССА',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      description:
        'Генератор гениально-тупых и квантовых отмазок для руководства, второй половинки и преподавателей на все случаи жизни.',
      tags: ['Абсурд', 'Оправдания', 'Психодел'],
      actionText: 'Открыть отмазки 🧠',
      isPrimary: false,
      onClick: () => onOpenCursedTools('excuses'),
      stats: 'Бесконечные варианты',
    },
    {
      id: 'sin-o-meter',
      title: 'SinOMeter 🔮',
      badge: 'КАРМИЧЕСКИЙ ТЕСТ',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      description:
        'Детектор бытовых грехов: съеденный последний кусок пиццы, голосовые на 4 минуты и музыка без наушников. Точный % демонизма.',
      tags: ['Грехи', 'Диагностика кармы', 'Чеклист'],
      actionText: 'Проверить грехи 🔮',
      isPrimary: false,
      onClick: () => onOpenCursedTools('sinometer'),
      stats: '10 бытовых смертных грехов',
    },
    {
      id: 'cat-lie-detector',
      title: 'Cat Lie Detector 🐱',
      badge: 'СКОРО',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      description:
        'Считывание истинных намерений человека по частоте мурчания и положению хвоста домашнего кота.',
      tags: ['Нейросети', 'Котики', 'Биометрия'],
      actionText: 'В разработке...',
      isPrimary: false,
      disabled: true,
      stats: 'Скоро в BestToolsEver',
    },
    {
      id: 'procrastination-shield',
      title: 'Procrastination Shield 🛡️',
      badge: 'СКОРО',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      description:
        'Симулятор бурной рабочей деятельности: автоматическое открывание случайных таблиц Excel при приближении босса.',
      tags: ['Офис', 'Прокрастинация', 'Автоматизация'],
      actionText: 'В разработке...',
      isPrimary: false,
      disabled: true,
      stats: 'Скоро в BestToolsEver',
    },
  ];

  const filteredTools = tools.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0a0d14] text-neutral-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      {/* Top Professional Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-red-600 flex items-center justify-center text-white shadow-lg">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">BestToolsEver!</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                  v3.8 Production
                </span>
              </div>
              <p className="text-xs text-neutral-400">Портал сатирических и оккультных микросервисов</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700 text-neutral-300">
              <Database className={`w-3.5 h-3.5 ${isDbConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span>Sanctuary & Corrupter Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-12 flex-1 w-full space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-800/80 border border-neutral-700 text-xs text-neutral-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Два полюса вселенной: Тьма и Свет, Порчи и Благословения</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Инструменты, которые меняют{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-red-500">
              кармическую реальность
            </span>
          </h1>

          <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
            Добро пожаловать в единую экосистему микросервисов. Наведи заслуженную кару в <b>CursedTools</b> или
            ниспошли небесную благодать и чистый кайф в <b>BlessedTools</b>.
          </p>

          {/* Quick Dual Hero CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                occultAudio.playHolyBells();
                onOpenKarmicPact();
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 via-amber-500 to-red-600 hover:brightness-110 text-black font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(245,158,11,0.6)] transition flex items-center gap-2 cursor-pointer border border-yellow-300"
            >
              <Scale className="w-4 h-4 text-black" />
              <span>Кармический Пакт (Бог & Бафомет) ⚖️</span>
            </button>

            <button
              onClick={() => {
                occultAudio.playHolyBells();
                onOpenBlessedTools();
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 text-black font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(245,158,11,0.5)] transition flex items-center gap-2 cursor-pointer"
            >
              <Sun className="w-4 h-4 text-black" />
              <span>BlessedTools 🕊️</span>
            </button>

            <button
              onClick={() => {
                occultAudio.playBloodSizzle();
                onOpenCursedTools('hexmaster');
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-900 hover:from-red-500 hover:to-red-800 text-white font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(239,68,68,0.4)] transition flex items-center gap-2 cursor-pointer border border-red-500/40"
            >
              <Flame className="w-4 h-4 text-red-300" />
              <span>CursedTools 😈</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск инструментов: благословение, порчегенератор, отмазки, грехи..."
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-900/90 border border-neutral-800 rounded-2xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative overflow-hidden group ${
                (tool as { isPact?: boolean }).isPact
                  ? 'bg-gradient-to-br from-[#1c1424] via-[#140b17] to-[#1a080d] border-2 border-amber-500/70 shadow-[0_0_35px_rgba(245,158,11,0.25)] hover:border-yellow-400 hover:shadow-[0_0_50px_rgba(245,158,11,0.45)] md:col-span-2 lg:col-span-3'
                  : tool.isPrimary && tool.isBlessed
                  ? 'bg-gradient-to-b from-[#131b2f] to-[#0a0f1d] border-2 border-yellow-500/60 shadow-[0_0_35px_rgba(245,158,11,0.25)] hover:border-yellow-400 hover:shadow-[0_0_45px_rgba(245,158,11,0.4)]'
                  : tool.isPrimary && !tool.isBlessed
                  ? 'bg-gradient-to-b from-[#1f0d11] to-[#0f0709] border-2 border-red-600/60 shadow-[0_0_35px_rgba(220,38,38,0.25)] hover:border-red-500 hover:shadow-[0_0_45px_rgba(220,38,38,0.4)]'
                  : 'bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/90'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">{tool.stats}</span>
                </div>

                <div>
                  <h3
                    className={`text-2xl font-bold tracking-tight mb-2 ${
                      (tool as { isPact?: boolean }).isPact
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-red-400'
                        : tool.isBlessed
                        ? 'text-yellow-300'
                        : tool.isPrimary
                        ? 'text-red-400'
                        : 'text-white'
                    }`}
                  >
                    {tool.title}
                  </h3>
                  <p className="text-neutral-300 text-sm leading-relaxed">{tool.description}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-0.5 rounded-md bg-black/40 text-neutral-300 border border-neutral-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-800/80">
                <button
                  onClick={tool.onClick}
                  disabled={tool.disabled}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    (tool as { isPact?: boolean }).isPact
                      ? 'bg-gradient-to-r from-yellow-500 via-amber-500 to-red-600 hover:brightness-110 text-black shadow-lg shadow-amber-500/30'
                      : tool.isBlessed
                      ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 text-black shadow-lg shadow-yellow-500/30'
                      : tool.isPrimary
                      ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-lg shadow-red-900/40'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                  } ${tool.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <span>{tool.actionText}</span>
                  {!tool.disabled && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-900/30 py-6 text-center text-xs text-neutral-500">
        <p>BestToolsEver! © 2026. Портал двойной кармы. Sanctuary DB & Corrupter Core.</p>
      </footer>
    </div>
  );
};
