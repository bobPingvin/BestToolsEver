import React, { useState } from 'react';
import { CursedVictim, VictimAuraLog } from '../types/curse';
import { occultAudio } from '../utils/audio';
import { Eye, X, Zap, RefreshCw, AlertTriangle, Radio } from 'lucide-react';

interface AstralSpyModalProps {
  victim: CursedVictim;
  onClose: () => void;
  onSendImpulse: (victimId: string, customNote?: string) => void;
}

const RANDOM_SUFFERINGS = [
  'Жертва нервно дергает ногой: мизинец только что нашел угол стола.',
  'Кофе на белой рубашке образовал силуэт черепа.',
  'Внезапный резкий спазм в животе во время телефонного звонка от мамы.',
  'Пакет с продуктами дал микротрещину в правом нижнем углу.',
  'Наушник выпал прямо в щель между сиденьями маршрутки.',
  'Компьютер завис на 99% установки срочного обновления.',
  'Жертва трижды перевернула подушку, но спасительного холода так и не нашла.',
  'Официант улыбнулся, а жертва покраснела до корней волос.',
  'Светофор переключился на красный за 2 метра до капота.',
  'В зубах застряла невидимая рыбная кость — язык жертвы в агонии.',
];

export const AstralSpyModal: React.FC<AstralSpyModalProps> = ({ victim, onClose, onSendImpulse }) => {
  const [logs, setLogs] = useState<VictimAuraLog[]>(victim.logs);
  const [isPulsing, setIsPulsing] = useState(false);

  const handlePulse = () => {
    setIsPulsing(true);
    occultAudio.playRitualPulse();

    setTimeout(() => {
      const newEvent = RANDOM_SUFFERINGS[Math.floor(Math.random() * RANDOM_SUFFERINGS.length)];
      const newLog: VictimAuraLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        event: newEvent,
        severity: 'high',
      };
      setLogs((prev) => [newLog, ...prev]);
      onSendImpulse(victim.id, newEvent);
      setIsPulsing(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0f090b] border-2 border-red-800/80 rounded-2xl p-6 text-neutral-200 shadow-[0_0_60px_rgba(220,38,38,0.4)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-red-950 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-600 flex items-center justify-center text-red-500 animate-pulse">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-gothic text-xl text-red-500">Астральный Шпионаж</h3>
              <p className="text-xs text-neutral-400">
                Слежка за биополем: <span className="text-white font-bold">{victim.fullName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aura Status Banner */}
        <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-xl mb-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-500 animate-ping" />
            <span className="text-neutral-300">Прямое подключение к адскому каналу</span>
          </div>
          <span className="font-bold text-red-400">Скверна: {victim.agonyLevel}%</span>
        </div>

        {/* Timeline of events */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-sm">
              Астральные помехи рассеиваются. Нажмите «Послать импульс мук», чтобы вызвать новое бедствие!
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-[#180f12] border border-red-950/80 hover:border-red-900 transition flex items-start gap-3 text-xs"
              >
                <span className="font-mono text-neutral-500 pt-0.5">{log.timestamp}</span>
                <div className="flex-1 text-neutral-300">
                  <p>{log.event}</p>
                </div>
                {log.severity === 'high' && (
                  <span className="text-[10px] text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                    Агония
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 pt-4 border-t border-red-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handlePulse}
            disabled={isPulsing}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white rounded-xl text-xs font-bold transition shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-pointer disabled:opacity-50"
          >
            {isPulsing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-yellow-300" />}
            <span>{isPulsing ? 'Посылаем разряд скверны...' : 'Послать импульс мук жертве'}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-xl text-xs transition cursor-pointer"
          >
            Закрыть мониторинг
          </button>
        </div>
      </div>
    </div>
  );
};
