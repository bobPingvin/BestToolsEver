import React, { useState } from 'react';
import { CursedVictim, VictimStatus } from '../types/curse';
import { CURSES_CATALOG } from '../data/cursesData';
import { occultAudio } from '../utils/audio';
import { AstralSpyModal } from './AstralSpyModal';
import { CertificateModal } from './CertificateModal';
import {
  Users,
  Search,
  Filter,
  Eye,
  Scroll,
  Zap,
  CheckCircle,
  Trash2,
  PlusCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  HeartCrack,
  Flame,
  Download,
  Upload,
} from 'lucide-react';

interface VictimsRegistryProps {
  victims: CursedVictim[];
  onUpdateVictims: (victims: CursedVictim[]) => void;
  onNavigateToCast: () => void;
}

const STATUS_CONFIG: Record<
  VictimStatus,
  { label: string; bg: string; text: string; border: string; desc: string }
> = {
  infiltrating: {
    label: 'Внедрение в ауру',
    bg: 'bg-amber-950/60',
    text: 'text-amber-400',
    border: 'border-amber-700/60',
    desc: 'Скверна проникает в энергетические каналы',
  },
  active: {
    label: 'Активно терзает',
    bg: 'bg-red-950/70',
    text: 'text-red-400',
    border: 'border-red-600/70',
    desc: 'Жертва испытывает непрерывные бытовые бедствия',
  },
  critical: {
    label: 'Критический урон',
    bg: 'bg-purple-950/70',
    text: 'text-purple-400',
    border: 'border-purple-600/70',
    desc: 'Нервная система на грани истощения',
  },
  fulfilled: {
    label: 'Возмездие свершилось!',
    bg: 'bg-emerald-950/60',
    text: 'text-emerald-400',
    border: 'border-emerald-700/60',
    desc: 'Понос/позор/удар мизинцем триумфально завершен',
  },
  dispelled: {
    label: 'Помилован / Снято',
    bg: 'bg-neutral-900',
    text: 'text-neutral-400',
    border: 'border-neutral-700',
    desc: 'Проклятие временно нейтрализовано',
  },
};

export const VictimsRegistry: React.FC<VictimsRegistryProps> = ({
  victims,
  onUpdateVictims,
  onNavigateToCast,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeSpyVictim, setActiveSpyVictim] = useState<CursedVictim | null>(null);
  const [activeCertVictim, setActiveCertVictim] = useState<CursedVictim | null>(null);
  const [addCurseModalVictimId, setAddCurseModalVictimId] = useState<string | null>(null);

  // Filtered victims list
  const filtered = victims.filter((v) => {
    const matchSearch =
      v.fullName.toLowerCase().includes(search.toLowerCase()) ||
      v.curses.some((c) => c.title.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Action: Send Astral Shock
  const handleSendImpulse = (victimId: string, customNote?: string) => {
    occultAudio.playDoomHit();
    const updated = victims.map((v) => {
      if (v.id === victimId) {
        const newAgony = Math.min(100, v.agonyLevel + 12);
        const newStatus: VictimStatus =
          newAgony >= 100 ? 'fulfilled' : newAgony >= 75 ? 'critical' : 'active';
        return {
          ...v,
          agonyLevel: newAgony,
          status: newStatus,
          lastImpulseAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          logs: [
            {
              id: Math.random().toString(36).substring(2, 9),
              timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              event: customNote || 'Направлен прямой астральный импульс мук. Жертва содрогнулась.',
              severity: 'high' as const,
            },
            ...v.logs,
          ],
        };
      }
      return v;
    });
    onUpdateVictims(updated);
  };

  // Action: Toggle Status / Dispelling
  const handleTogglePardon = (victimId: string) => {
    occultAudio.playDemonBell();
    const updated = victims.map((v) => {
      if (v.id === victimId) {
        const isDispelled = v.status === 'dispelled';
        return {
          ...v,
          status: (isDispelled ? 'active' : 'dispelled') as VictimStatus,
          logs: [
            {
              id: Math.random().toString(36).substring(2, 9),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              event: isDispelled
                ? 'Проклятие возобновлено! Скверна снова в действии.'
                : 'Акт временного помилования подписан. Ослабление хватки.',
              severity: 'medium' as const,
            },
            ...v.logs,
          ],
        };
      }
      return v;
    });
    onUpdateVictims(updated);
  };

  // Action: Delete from Registry
  const handleDelete = (victimId: string) => {
    if (confirm('Испепелить эту запись из Книги Проклятых навсегда?')) {
      occultAudio.playBloodSizzle();
      onUpdateVictims(victims.filter((v) => v.id !== victimId));
    }
  };

  // Action: Add another curse to victim
  const handleAddExtraCurse = (victimId: string, curseId: string) => {
    const curseToAdd = CURSES_CATALOG.find((c) => c.id === curseId);
    if (!curseToAdd) return;
    occultAudio.playDoomHit();

    const updated = victims.map((v) => {
      if (v.id === victimId) {
        if (v.curses.some((c) => c.id === curseId)) return v;
        return {
          ...v,
          curses: [...v.curses, curseToAdd],
          agonyLevel: Math.min(100, v.agonyLevel + 20),
          status: 'active' as VictimStatus,
          logs: [
            {
              id: Math.random().toString(36).substring(2, 9),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              event: `Наложено дополнительное проклятие: «${curseToAdd.title}». Муки удвоены!`,
              severity: 'high' as const,
            },
            ...v.logs,
          ],
        };
      }
      return v;
    });

    onUpdateVictims(updated);
    setAddCurseModalVictimId(null);
  };

  // Export / Import
  const exportRegistry = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(victims, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'cursed_victims_registry.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="relative z-10 max-w-6xl mx-auto space-y-6 pb-16">
      {/* Registry Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-950 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">📜</span>
            <h1 className="text-3xl md:text-5xl font-gothic text-red-500 tracking-wider">
              РЕЕСТР ВОЗМЕЗДИЯ
            </h1>
          </div>
          <p className="text-neutral-400 text-xs md:text-sm mt-1">
            Книга Проклятых: глобальный учет всех пораженных душ, степень их мучений и рычаги управления.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportRegistry}
            className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs rounded-xl border border-neutral-800 transition cursor-pointer"
            title="Экспортировать Реестр в JSON"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span>Экспорт</span>
          </button>

          <button
            onClick={onNavigateToCast}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-600 transition cursor-pointer"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Новая жертва</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по ФИО жертвы или названию порчи..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0e080b] border border-red-950 rounded-xl text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-red-700 transition"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#0e080b] border border-red-950 rounded-xl px-3 py-2.5 text-sm text-neutral-300 focus:outline-none focus:border-red-700"
          >
            <option value="all">Все статусы ({victims.length})</option>
            <option value="infiltrating">Внедрение в ауру</option>
            <option value="active">Активно терзает</option>
            <option value="critical">Критический урон</option>
            <option value="fulfilled">Возмездие свершилось</option>
            <option value="dispelled">Помилованные</option>
          </select>
        </div>
      </div>

      {/* Victims List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#0f090c]/80 border-2 border-dashed border-red-950/70 rounded-2xl space-y-4">
          <div className="text-5xl">🕯️</div>
          <h3 className="font-gothic text-2xl text-red-400">В Реестре пока нет таких грешников</h3>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            {victims.length === 0
              ? 'Ты ещё никому не отомстил! Переходи в Порчегенератор и накажи своего обидчика.'
              : 'По заданным фильтрам никто не найден.'}
          </p>
          {victims.length === 0 && (
            <button
              onClick={onNavigateToCast}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-900 hover:bg-red-800 text-white rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(220,38,38,0.5)] cursor-pointer"
            >
              <Flame className="w-4 h-4" />
              <span>Навести первую порчу</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((victim) => {
            const statusInfo = STATUS_CONFIG[victim.status] || STATUS_CONFIG.active;
            return (
              <div
                key={victim.id}
                className="bg-[#120a0d]/90 border border-red-950/80 hover:border-red-800 rounded-2xl p-5 md:p-6 transition shadow-md hover:shadow-[0_0_25px_rgba(220,38,38,0.25)] space-y-4"
              >
                {/* Header Row: Full Name, Status, Date */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-red-950/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-950 border border-red-800 flex items-center justify-center text-red-400 font-gothic text-xl font-bold shadow-inner">
                      {victim.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                        <span>{victim.fullName}</span>
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                        <Clock className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Наложено: {victim.createdAt}</span>
                        <span>•</span>
                        <span>Куратор: {victim.sealedBy}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <span
                      className={`text-xs px-3 py-1 rounded-full border font-semibold flex items-center gap-1.5 ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Main Content: Curses on this person */}
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider text-neutral-500 font-bold block">
                    Наложенные воздействия ({victim.curses.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {victim.curses.map((curse) => (
                      <div
                        key={curse.id}
                        className="p-2.5 rounded-xl bg-black/40 border border-red-950 flex items-center gap-2.5 text-xs"
                      >
                        <span className="text-lg">{curse.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-neutral-200 truncate">{curse.title}</div>
                          <div className="text-[10px] text-red-400/80 font-medieval truncate">
                            «{curse.latinIncantation}»
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Button to stack an extra curse */}
                    <button
                      type="button"
                      onClick={() => setAddCurseModalVictimId(victim.id)}
                      className="p-2.5 rounded-xl border border-dashed border-red-900/60 hover:border-red-600 bg-red-950/20 hover:bg-red-950/50 text-red-400 flex items-center justify-center gap-1.5 text-xs transition cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Усилить (добавить порчу)</span>
                    </button>
                  </div>
                </div>

                {/* Suffering Progress Bar & Catalyst */}
                <div className="bg-black/30 p-3 rounded-xl border border-red-950/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Степень страданий и истощения:</span>
                      <span className="font-mono font-bold text-red-400">{victim.agonyLevel}%</span>
                    </div>
                    <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-neutral-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 via-red-600 to-purple-600 transition-all duration-300"
                        style={{ width: `${victim.agonyLevel}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-neutral-400 border-t md:border-t-0 md:border-l border-red-950/60 pt-2 md:pt-0 md:pl-4">
                    <span className="text-neutral-500 block text-[11px]">Катализатор:</span>
                    <span className="text-neutral-200 font-medium">{victim.sacrificeItem}</span>
                  </div>
                </div>

                {/* Additional Actions Row */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Action 1: Astral Spy */}
                    <button
                      onClick={() => {
                        occultAudio.playBloodSizzle();
                        setActiveSpyVictim(victim);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs border border-neutral-700 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-red-400" />
                      <span>Астральный шпионаж</span>
                    </button>

                    {/* Action 2: Certificate of Hex */}
                    <button
                      onClick={() => {
                        occultAudio.playDemonBell();
                        setActiveCertVictim(victim);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-950 text-amber-300 text-xs border border-amber-800/60 transition cursor-pointer"
                    >
                      <Scroll className="w-3.5 h-3.5 text-amber-400" />
                      <span>Свидетельский Акт</span>
                    </button>

                    {/* Action 3: Send Impulsive Shock */}
                    <button
                      onClick={() => handleSendImpulse(victim.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs border border-red-700 transition cursor-pointer"
                      title="Усилить муки и нанести мгновенный урон ауре"
                    >
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Усилить муки</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Action 4: Pardon / Dispelled */}
                    <button
                      onClick={() => handleTogglePardon(victim.id)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${
                        victim.status === 'dispelled'
                          ? 'bg-neutral-800 border-neutral-600 text-neutral-200'
                          : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200'
                      }`}
                      title={victim.status === 'dispelled' ? 'Вернуть проклятие' : 'Помиловать за откуп'}
                    >
                      {victim.status === 'dispelled' ? 'Вернуть скверну' : 'Снять (помиловать)'}
                    </button>

                    {/* Action 5: Delete */}
                    <button
                      onClick={() => handleDelete(victim.id)}
                      className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition cursor-pointer"
                      title="Испепелить запись"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add Extra Curse to Victim */}
      {addCurseModalVictimId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#120a0d] border border-red-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-red-950 pb-3">
              <h3 className="font-gothic text-xl text-red-500">Добавить ещё одно проклятие</h3>
              <button
                onClick={() => setAddCurseModalVictimId(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-neutral-400">
              Выбери дополнительную кару, чтобы усилить страдания жертвы в Реестре:
            </p>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {CURSES_CATALOG.slice(0, 15).map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleAddExtraCurse(addCurseModalVictimId, c.id)}
                  className="p-2.5 rounded-lg bg-black/40 hover:bg-red-950/40 border border-red-950 hover:border-red-800 flex items-center justify-between cursor-pointer transition text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span>{c.icon}</span>
                    <span className="font-semibold text-white">{c.title}</span>
                  </div>
                  <span className="text-red-400 font-bold">+ Добавить</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Astral Spy Modal */}
      {activeSpyVictim && (
        <AstralSpyModal
          victim={activeSpyVictim}
          onClose={() => setActiveSpyVictim(null)}
          onSendImpulse={handleSendImpulse}
        />
      )}

      {/* Certificate Modal */}
      {activeCertVictim && (
        <CertificateModal victim={activeCertVictim} onClose={() => setActiveCertVictim(null)} />
      )}
    </div>
  );
};
