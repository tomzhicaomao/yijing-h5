// 易经占卜应用统一类型定义

import type { Hexagram } from '../constants/iching';

export type DivinationType = 'wealth' | 'love' | 'health' | 'career' | 'other';

export type View = 'home' | 'divine' | 'history' | 'profile' | 'result';

export interface HistoryRecord {
  id: string;
  date: string;
  question: string;
  divinationType: DivinationType;
  hexagram: Hexagram;
  transformedHexagram?: Hexagram;
  movingLines: number[];
  interpretation: string;
  masterAdvice?: string;
  luckScore?: number;
}

export interface DivinationRecord {
  user_id: string;
  question: string;
  divination_type: string;
  hexagram_id: number;
  hexagram_name: string;
  transformed_hexagram_id?: number;
  transformed_hexagram_name?: string;
  moving_lines: number[];
  interpretation: string;
  master_advice?: string;
  luck_score?: number;
}

export const DIVINATION_TYPES: { value: DivinationType; label: string; icon: string }[] = [
  { value: 'wealth', label: '财运', icon: '💰' },
  { value: 'love', label: '感情', icon: '💕' },
  { value: 'health', label: '健康', icon: '💪' },
  { value: 'career', label: '学业', icon: '📚' },
  { value: 'other', label: '其他', icon: '🔮' },
];

// 数字起卦常量
export const NUMBER_MIN = 100;
export const NUMBER_MAX = 999;
