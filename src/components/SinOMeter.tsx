import React, { useState } from 'react';
import { occultAudio } from '../utils/audio';
import { Skull, AlertOctagon, CheckSquare, Square, Flame, RefreshCw } from 'lucide-react';

const EVERYDAY_SINS = [
  { id: 'sin-1', title: 'Сказал «я уже выхожу», хотя даже штаны не надел', weight: 14 },
  { id: 'sin-2', title: 'Отправил голосовое сообщение длиннее 3 минут без спроса', weight: 22 },
  { id: 'sin-3', title: 'Съел последний кусок пиццы в компании, сделав вид что случайно', weight: 18 },
  { id: 'sin-4', title: 'Смотрел Reels / TikTok на полной громкости в транспорте', weight: 28 },
  { id: 'sin-5', title: 'Оставил пустую упаковку от молока в холодильнике', weight: 15 },
  { id: 'sin-6', title: 'Не придержал дверь человеку, который шел прямо за тобой', weight: 12 },
  { id: 'sin-7', title: 'Притворился спящим в метро, чтобы не уступать место', weight: 20 },
  { id: 'sin-8', title: 'Взял чужую еду из офисного холодильника со словами «ну она всё равно пропадает»', weight: 25 },
  { id: 'sin-9', title: 'Сказал официанту «И тебе!», когда тот пожелал «Приятного аппетита»', weight: 5 },
  { id: 'sin-10', title: 'Занял очередь на кассе и убежал за батоном на 15 минут', weight: 24 },
];

export const SinOMeter: React.FC = () => {
  const [checkedSins, setCheckedSins] = useState<string[]>(['sin-1', 'sin-9']);

  const toggleSin = (id: string) => {
    occultAudio.playBloodSizzle();
    setCheckedSins((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalScore = checkedSins.reduce((acc, id) => {
    const sin = EVERYDAY_SINS.find((s) => s.id === id);
    return acc + (sin ? sin.weight : 0);
  }, 0);

  const demonPercentage = Math.min(100, Math.round((totalScore / 183) * 100));

  const getVerdict = (pct: number) => {
    if (pct < 15) return { title: 'Почти святой зануда', desc: 'В аду тебе даже кипяток не включат — слишком скучный.', color: 'text-emerald-400' };
    if (pct < 45) return { title: 'Мелкий бытовой бесенок', desc: 'Твоя аура пахнет вчерашней шаурмой и пропущенными звонками.', color: 'text-amber-400' };
    if (pct < 80) return { title: 'Кандидат в демоны 2-го ранга', desc: 'Люцифер лично держит для тебя VIP-котел с гидромассажем.', color: 'text-red-400' };
    return { title: 'Абсолютный Архидемон Пакости', desc: 'Черти боятся наступать на твою тень. Ты ходячая катастрофа.', color: 'text-purple-400' };
  };

  const verdict = getVerdict(demonPercentage);

  return (
    <div className="relative z-10 max-w-3xl mx-auto space-y-6 pb-16">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 text-xs font-mono">
          <Skull className="w-3.5 h-3.5 text-red-400" />
          <span>Странный инструмент №3</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-gothic text-red-500 tracking-wider">
          ДЕТЕКТОР БЫТОВЫХ ГРЕХОВ
        </h1>
        <p className="text-neutral-400 text-sm max-w-xl mx-auto">
          Отметь грехи, которые ты совершал за последний год, и узнай точный процент гнили в твоей кармической оболочке.
        </p>
      </div>

      <div className="bg-[#120a0d]/90 border border-red-900/60 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl backdrop-blur-md">
        {/* Score & Verdict Banner */}
        <div className="bg-black/60 border border-red-950 p-6 rounded-2xl text-center space-y-3">
          <div className="text-xs uppercase tracking-widest text-neutral-500 font-bold">
            Уровень чертовщины в организме:
          </div>
          <div className="text-5xl md:text-6xl font-gothic text-red-500 font-bold">
            {demonPercentage}%
          </div>
          <div>
            <div className={`text-xl font-bold font-medieval ${verdict.color}`}>{verdict.title}</div>
            <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">{verdict.desc}</p>
          </div>
          <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-800 max-w-md mx-auto">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600 transition-all duration-300"
              style={{ width: `${demonPercentage}%` }}
            />
          </div>
        </div>

        {/* Sins Checklist */}
        <div className="space-y-2.5">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">
            Список бытовых грехопадений (отметь честно):
          </div>

          {EVERYDAY_SINS.map((sin) => {
            const isChecked = checkedSins.includes(sin.id);
            return (
              <div
                key={sin.id}
                onClick={() => toggleSin(sin.id)}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs cursor-pointer transition ${
                  isChecked
                    ? 'bg-red-950/50 border-red-700 text-neutral-200'
                    : 'bg-black/40 border-neutral-900 text-neutral-400 hover:border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-red-500 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-neutral-600 shrink-0" />
                  )}
                  <span>{sin.title}</span>
                </div>
                <span className="font-mono text-red-500/80 text-[11px] shrink-0">
                  +{sin.weight}% скверны
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
