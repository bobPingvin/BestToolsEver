import React from 'react';
import { RitualHistoryItem } from '../types/curse';
import { History, Flame, Skull, Sparkles, Shield, Clock } from 'lucide-react';

interface HistoryLogProps {
  history: RitualHistoryItem[];
  totalCursesCast: number;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ history, totalCursesCast }) => {
  return (
    <div className="relative z-10 max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-950 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🕯️</span>
            <h1 className="text-3xl md:text-5xl font-gothic text-red-500 tracking-wider">
              ХРОНИКА ВОЗДЕЙСТВИЙ
            </h1>
          </div>
          <p className="text-neutral-400 text-xs md:text-sm mt-1">
            Архив завершенных темных месс, расход демонической маны и результаты пробития астрала.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#120a0d] border border-red-950 p-4 rounded-xl space-y-1">
          <div className="text-xs text-neutral-400">Проведено ритуалов</div>
          <div className="text-2xl md:text-3xl font-gothic text-red-500 font-bold">
            {totalCursesCast}
          </div>
        </div>

        <div className="bg-[#120a0d] border border-red-950 p-4 rounded-xl space-y-1">
          <div className="text-xs text-neutral-400">Успешность кармы</div>
          <div className="text-2xl md:text-3xl font-gothic text-emerald-400 font-bold">
            99.8%
          </div>
        </div>

        <div className="bg-[#120a0d] border border-red-950 p-4 rounded-xl space-y-1">
          <div className="text-xs text-neutral-400">Сожжено серы</div>
          <div className="text-2xl md:text-3xl font-gothic text-amber-500 font-bold">
            {totalCursesCast * 42} г
          </div>
        </div>

        <div className="bg-[#120a0d] border border-red-950 p-4 rounded-xl space-y-1">
          <div className="text-xs text-neutral-400">Инфернальный ранг</div>
          <div className="text-sm md:text-base font-medieval text-red-400 font-bold truncate">
            {totalCursesCast > 5 ? 'Архимаг Скверны' : totalCursesCast > 0 ? 'Адепт Тьмы' : 'Послушник'}
          </div>
        </div>
      </div>

      {/* Ritual Chronology List */}
      <div className="bg-[#0f090c]/90 border border-red-950/80 rounded-2xl p-5 md:p-6 space-y-3">
        <h3 className="text-sm uppercase tracking-wider text-red-400 font-bold flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-red-500" />
          <span>Лента свершенных магических актов:</span>
        </h3>

        {history.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-sm">
            История пуста. Проведи первый ритуал наведения порчи!
          </div>
        ) : (
          <div className="space-y-2.5">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-black/40 border border-red-950/70 hover:border-red-900 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-950/70 border border-red-800 flex items-center justify-center text-red-400 shrink-0">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">
                      {item.victimName} — <span className="text-red-400 font-normal">{item.curseTitle}</span>
                    </div>
                    <div className="text-neutral-400 text-[11px] flex items-center gap-2 mt-0.5">
                      <span>Куратор: {item.demonName}</span>
                      <span>•</span>
                      <span>Расход маны: {item.energySpent} ед.</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto font-mono text-neutral-500 text-[11px]">
                  <Clock className="w-3 h-3 text-neutral-600" />
                  <span>{item.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
