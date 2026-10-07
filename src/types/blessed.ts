export type BlessingCategory = 
  | 'domestic'    // Бытовая Благодать и Уют
  | 'health'      // Здоровье, Тело и Исцеление
  | 'career'      // Учеба, Карьера и Изобилие
  | 'spiritual'   // Духовный Покой, Защита и Отпущение
  | 'miracle';    // Великие Чудеса и Промысел

export type BlessingRank = 'light' | 'saintly' | 'archangelic';

export interface BlessingTemplate {
  id: string;
  title: string;
  description: string;
  category: BlessingCategory;
  rank: BlessingRank;
  icon: string;
  holyIncantation: string; // Молитва или каноническое благословение
  effects: string[];
  gracePower: number; // e.g. 10 to 100
}

export type BlessedStatus = 
  | 'anointed'    // Осенен благодатью
  | 'protected'   // Под покровом святых
  | 'sanctified'  // Освящен
  | 'canonized';  // В сиянии вечного света

export interface SoulGraceLog {
  id: string;
  timestamp: string;
  event: string;
  type: 'blessing' | 'protection' | 'miracle' | 'relic';
}

export interface BlessedSoul {
  id: string;
  fullName: string;
  blessings: BlessingTemplate[];
  rank: BlessingRank;
  patronSaint: string;
  holyRelic: string;
  createdAt: string;
  status: BlessedStatus;
  graceLevel: number; // 0 to 100%
  logs: SoulGraceLog[];
  intercessor: string; // e.g. "Архангел Михаил"
}

export interface BlessingHistoryItem {
  id: string;
  soulName: string;
  blessingTitle: string;
  timestamp: string;
  patronSaint: string;
  statusText: string;
  graceGained: number;
}
