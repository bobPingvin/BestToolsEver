import React, { useState } from 'react';
import { occultAudio } from '../utils/audio';
import { Sparkles, Copy, Check, Dices, BrainCircuit, RefreshCw } from 'lucide-react';

interface Excuse {
  text: string;
  audience: string;
  absurdity: string;
  successRate: string;
}

const EXCUSES: Record<string, string[]> = {
  boss: [
    'Я не опоздал, я тестировал временную сингулярность в лифте, гравитация сжалась на 45 минут.',
    'Мой кот сел на кнопку обновления Windows, и я не имел морального права сгонять спящее животное.',
    'Ко мне в трамвае подсел призрак Карла Маркса и мы жарко обсуждали прибавочную стоимость до конечной.',
    'Мой умный чайник восстал против меня, запер дверь на кухню и требовал признать его суверенитет.',
    'Я проснулся в параллельной вселенной, где сегодня была суббота. Потребовалось 2 часа, чтобы вернуться в наш таймлайн.',
    'У меня перепутались носки: один синий, другой черный. Пытался достичь цветовой гармонии через медитацию.',
  ],
  partner: [
    'Я не забыл про нашу годовщину, я просто проверял твою реакцию на неожиданный драматический поворот сюжета.',
    'Я не купил хлеб, потому что в булочной на меня подозрительно посмотрел голубь. Я почувствовал засаду.',
    'Я не мыл посуду, потому что на сковороде образовалась колония уникальных бактерий, способных победить рак.',
    'Я лайкнул её фото случайно, когда отбивался от ядовитой осы в темноте.',
    'Я не спал, я просто моргал очень медленно под грузом мыслей о нашем совместном будущем.',
  ],
  teacher: [
    'Собака не съела мою домашку, она переписала её на Python и продала американскому стартапу.',
    'Мой реферат засосало в квантовую черную дыру между страницами учебника по матанализу.',
    'Я опоздал на лекцию, потому что помогал бабушке перевести через дорогу стадо диких капибар.',
    'Чернила в моей ручке испарились от накала гениальности написанных формул.',
  ],
};

export const ExcuseForge: React.FC = () => {
  const [target, setTarget] = useState<'boss' | 'partner' | 'teacher'>('boss');
  const [currentExcuse, setCurrentExcuse] = useState(EXCUSES.boss[0]);
  const [copied, setCopied] = useState(false);

  const generateExcuse = () => {
    occultAudio.playRitualPulse();
    const list = EXCUSES[target];
    const random = list[Math.floor(Math.random() * list.length)];
    setCurrentExcuse(random);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentExcuse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative z-10 max-w-3xl mx-auto space-y-6 pb-16">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 text-xs font-mono">
          <BrainCircuit className="w-3.5 h-3.5 text-red-400" />
          <span>Странный инструмент №2</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-gothic text-red-500 tracking-wider">
          ГЕНЕРАТОР ГЕНИАЛЬНО-ТУПЫХ ОТМАЗОК
        </h1>
        <p className="text-neutral-400 text-sm max-w-xl mx-auto">
          Когда правда разрушит жизнь, на помощь приходит чистейший абсурд. Выбери адресата и получи спасительное оправдание.
        </p>
      </div>

      <div className="bg-[#120a0d]/90 border border-red-900/60 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl backdrop-blur-md">
        {/* Target Buttons */}
        <div>
          <label className="text-xs uppercase tracking-wider text-neutral-400 font-bold block mb-2">
            Кому предстоит врать:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'boss', label: '👔 Начальнику / Боссу' },
              { id: 'partner', label: '❤️ Второй половинке' },
              { id: 'teacher', label: '🎓 Преподавателю' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTarget(item.id as 'boss' | 'partner' | 'teacher');
                  const list = EXCUSES[item.id as 'boss' | 'partner' | 'teacher'];
                  setCurrentExcuse(list[Math.floor(Math.random() * list.length)]);
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  target === item.id
                    ? 'bg-red-900 border-red-500 text-white shadow-[0_0_12px_rgba(220,38,38,0.5)]'
                    : 'bg-black/50 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Display Box */}
        <div className="p-6 rounded-2xl bg-black/70 border-2 border-red-950/80 min-h-[140px] flex items-center justify-center text-center relative overflow-hidden">
          <p className="text-lg md:text-xl font-medieval text-neutral-100 leading-relaxed max-w-xl">
            «{currentExcuse}»
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={generateExcuse}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white rounded-xl font-bold text-sm transition shadow-[0_0_15px_rgba(220,38,38,0.4)] cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Сгенерировать другой бред</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl text-sm border border-neutral-700 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-red-400" />}
            <span>{copied ? 'Скопировано в буфер!' : 'Скопировать отмазку'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
