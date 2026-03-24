import React from 'react';
import { History as HistoryIcon, Trash2, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Hexagram } from '../constants/iching';

interface HistoryRecord {
  id: string;
  date: string;
  question: string;
  divinationType: string;
  hexagram: Hexagram;
  transformedHexagram?: Hexagram;
  movingLines: number[];
  interpretation: string;
  masterAdvice?: string;
  luckScore?: number;
}

interface HistoryProps {
  records: HistoryRecord[];
  onDelete: (id: string) => void;
  onView: (record: HistoryRecord) => void;
}

export const History: React.FC<HistoryProps> = ({ records, onDelete, onView }) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-40 text-mystic-muted/20">
        <HistoryIcon className="w-24 h-24 mx-auto mb-6 opacity-20" />
        <p className="text-lg">暂无占卜记录</p>
        <p className="text-sm mt-2">起卦问卜后，记录将显示在这里</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div
          key={record.id}
          className="glass-card p-6 hover:border-mystic-accent/30 transition-all cursor-pointer"
          onClick={() => onView(record)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] text-mystic-accent uppercase tracking-widest">
                  {record.divinationType}
                </span>
                <span className="text-[10px] text-mystic-muted">{record.date}</span>
              </div>
              <h3 className="text-lg font-cursive text-mystic-text mb-1">
                {record.hexagram.symbol} {record.hexagram.name}卦
              </h3>
              {record.transformedHexagram && (
                <p className="text-xs text-mystic-muted">
                  之卦：{record.transformedHexagram.name}卦
                </p>
              )}
            </div>
            
            {record.luckScore !== undefined && (
              <div className="text-right">
                <div className={cn(
                  "text-2xl font-bold font-cursive",
                  record.luckScore >= 70 ? "text-green-400" :
                  record.luckScore >= 40 ? "text-yellow-400" : "text-red-400"
                )}>
                  {record.luckScore}
                </div>
                <div className="text-[9px] text-mystic-muted uppercase">吉凶指数</div>
              </div>
            )}
          </div>
          
          <p className="text-sm text-mystic-muted/80 line-clamp-2 mb-4">
            {record.question || '近期运势'}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-mystic-accent/10">
            <div className="flex items-center gap-2 text-[10px] text-mystic-muted">
              <BookOpen className="w-3 h-3" />
              {record.movingLines.length > 0 ? `${record.movingLines.length}动爻` : '无动爻'}
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(record.id);
              }}
              className="p-2 text-mystic-muted hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
