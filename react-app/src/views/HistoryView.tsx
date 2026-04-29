import React from 'react';
import { motion } from 'motion/react';
import { History, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Hexagram } from '../constants/iching';
import type { DivinationType } from '../types';

interface HistoryRecord {
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

interface HistoryViewProps {
  history: HistoryRecord[];
  onSelectRecord: (record: HistoryRecord) => void;
  onDeleteRecord: (id: string) => void;
  onNavigateToResult: () => void;
}

export const HistoryView = React.memo<HistoryViewProps>(({
  history,
  onSelectRecord,
  onDeleteRecord,
  onNavigateToResult
}) => {
  return (
    <motion.div
      key="history"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-4xl font-cursive text-mystic-text">占卜记录</h2>
        <span className="text-[10px] text-mystic-accent font-bold uppercase tracking-widest">{history.length} 条记录</span>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-40 text-mystic-muted/20">
          <div className="relative w-20 h-20 mx-auto mb-8 flex items-center justify-center">
            <div className="absolute inset-0 border border-mystic-accent/20 rotate-45" />
            <History className="w-10 h-10 text-mystic-accent/30" />
          </div>
          <p className="text-sm tracking-[0.3em]">暂无记录</p>
        </div>
      ) : (
        <div className="space-y-5">
          {history.map((record) => (
            <div
              key={record.id}
              onClick={() => {
                onSelectRecord(record);
                onNavigateToResult();
              }}
              className="bg-mystic-card p-6 rounded-[32px] border border-mystic-accent/5 shadow-lg flex items-center gap-6 active:scale-[0.98] transition-all group cursor-pointer"
            >
              <div className="w-16 h-16 bg-mystic-bg rounded-2xl flex items-center justify-center text-4xl text-mystic-text group-hover:text-mystic-accent transition-colors shadow-inner">
                {record.hexagram.symbol}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-base truncate text-mystic-text/90">{record.question}</h4>
                <p className="text-[10px] text-mystic-muted mt-2 uppercase tracking-tighter font-medium">
                  {record.date} · {record.hexagram.name}卦
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteRecord(record.id);
                }}
                className="p-3 text-mystic-muted/20 hover:text-red-400 transition-colors"
                aria-label="删除记录"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
});

HistoryView.displayName = 'HistoryView';

export default HistoryView;
