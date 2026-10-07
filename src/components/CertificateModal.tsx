import React, { useRef } from 'react';
import { CursedVictim } from '../types/curse';
import { X, Printer, Share2, Check, ShieldAlert } from 'lucide-react';

interface CertificateModalProps {
  victim: CursedVictim;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ victim, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const handleCopyText = () => {
    const text = `📜 ИНФЕРНАЛЬНАЯ ГРАМОТА НАВЕДЕНИЯ ПОРЧИ
Настоящим подтверждается, что на гражданина(-ку):
${victim.fullName}
Наложено законное проклятие Верховной Канцелярии Тьмы:
${victim.curses.map((c, i) => `${i + 1}. ${c.title}`).join('\n')}

Степень скверны: ${victim.severityLevel.toUpperCase()}
Дата и час печати: ${victim.createdAt}
Текущий статус: ${victim.status} (Муки: ${victim.agonyLevel}%)
Катализатор: ${victim.sacrificeItem}
Скреплено несмываемой кровью грешников.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#140e10] border-2 border-amber-900/60 rounded-xl p-6 md:p-8 text-neutral-200 shadow-[0_0_50px_rgba(180,83,9,0.3)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-white p-2 rounded-full hover:bg-neutral-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* The Printable Parchment Certificate */}
        <div
          ref={certRef}
          className="bg-[#1f1618] border-4 border-amber-900/40 p-6 md:p-8 rounded-lg relative overflow-hidden font-medieval text-neutral-300 shadow-inner"
        >
          {/* Subtle watermark pentagram */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-96 h-96 stroke-amber-500 fill-none">
              <circle cx="50" cy="50" r="45" strokeWidth="2" />
              <polygon points="50,90 20,30 90,55 10,55 80,30" strokeWidth="2" />
            </svg>
          </div>

          {/* Header */}
          <div className="text-center border-b-2 border-amber-950 pb-4 mb-4">
            <div className="text-xs uppercase tracking-widest text-amber-500/80 mb-1">
              Infernalis Notarius & Maleficium Bureau
            </div>
            <h2 className="text-2xl md:text-3xl font-gothic text-amber-400 tracking-wider">
              СВИДЕТЕЛЬСКИЙ АКТ ПОРЧИ
            </h2>
            <div className="text-xs text-neutral-400 mt-1">
              Серия: SATAN-HEX-№{victim.id.slice(0, 8).toUpperCase()}
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              Сим священным пергаментом удостоверяется, что над физической и астральной оболочкой смертного лица:
            </p>

            <div className="text-center py-2 px-4 bg-black/40 border border-red-950 rounded font-bold text-xl text-red-400 font-gothic">
              {victim.fullName}
            </div>

            <p>
              совершен законный оккультный ритуал. В энергетическую матрицу жертвы внедрены следующие кары Преисподней:
            </p>

            <ul className="space-y-2 pl-2">
              {victim.curses.map((curse, i) => (
                <li key={curse.id} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">{i + 1}.</span>
                  <div>
                    <span className="font-semibold text-white">{curse.title}</span>
                    <span className="text-xs text-neutral-400 block italic">«{curse.latinIncantation}»</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-2 border-t border-amber-950/60 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-neutral-500 block">Катализатор призыва:</span>
                <span className="text-amber-300 font-semibold">{victim.sacrificeItem}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Уровень истощения:</span>
                <span className="text-red-400 font-semibold">{victim.agonyLevel}% скверны</span>
              </div>
            </div>
          </div>

          {/* Footer with Wax Seal */}
          <div className="mt-6 pt-4 border-t-2 border-amber-950 flex items-center justify-between">
            <div className="text-xs text-neutral-400">
              <div>Дата наложения: {victim.createdAt}</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">Обжалованию в аду не подлежит</div>
            </div>

            {/* Red wax seal simulation */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-700 via-red-900 to-black border-2 border-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.7)] text-red-200 select-none">
              <div className="text-[9px] font-bold text-center uppercase tracking-tighter leading-tight">
                VERITAS<br />MALEFICUM<br />⛧
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 mt-5">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg text-sm border border-neutral-700 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-500" />}
            <span>{copied ? 'Скопировано!' : 'Скопировать текст'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-900/60 hover:bg-amber-800 text-amber-200 rounded-lg text-sm border border-amber-700 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Печать / Экспорт</span>
          </button>
        </div>
      </div>
    </div>
  );
};
