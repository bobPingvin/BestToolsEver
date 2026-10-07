export type CurseCategory = 
  | 'digestive'    // Пищеварительный ад
  | 'domestic'     // Бытовые пытки
  | 'digital'      // Цифровой маразм
  | 'social'       // Социальный позор
  | 'infernal'     // Черная сатанинская магия
  | 'transport';   // Транспорт и дороги

export type CurseSeverity = 'mild' | 'severe' | 'apocalyptic';

export interface CurseTemplate {
  id: string;
  title: string;
  description: string;
  category: CurseCategory;
  severity: CurseSeverity;
  icon: string;
  latinIncantation: string;
  symptoms: string[];
  castSuccessChance: number; // e.g. 98%
  cooldownHours: number;
}

export type VictimStatus = 
  | 'infiltrating'   // Внедрение в ауру
  | 'active'         // Активно терзает
  | 'critical'       // Критический урон
  | 'fulfilled'      // Возмездие свершилось!
  | 'dispelled';     // Снято откупом

export interface VictimAuraLog {
  id: string;
  timestamp: string;
  event: string;
  severity: 'low' | 'medium' | 'high' | 'chaos';
}

export interface CursedVictim {
  id: string;
  fullName: string;
  alias?: string;
  targetGender?: 'male' | 'female' | 'unspecified';
  curses: CurseTemplate[];
  severityLevel: CurseSeverity;
  sacrificeItem: string;
  createdAt: string;
  status: VictimStatus;
  agonyLevel: number; // 0 to 100%
  lastImpulseAt?: string;
  notes?: string;
  logs: VictimAuraLog[];
  sealedBy: string; // e.g. "Магистр Черного Кода"
}

export interface RitualHistoryItem {
  id: string;
  victimName: string;
  curseTitle: string;
  timestamp: string;
  energySpent: number;
  demonName: string;
  statusText: string;
}
