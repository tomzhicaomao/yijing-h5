import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Lightbulb, TrendingUp, ShieldCheck, MessageSquare, RotateCcw, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Hexagram } from '../constants/iching';
import type { DivinationType } from '../types';

interface ResultViewProps {
  hexagram: Hexagram;
  transformedHexagram?: Hexagram;
  aiInterpretation: string;
  masterAdvice?: string;
  luckScore: number;
  isLoadingAi: boolean;
  onFetchAI: () => void;
  onNewDivination: () => void;
  movingLines?: number[];
  question?: string;
  divinationType?: DivinationType;
}

export const ResultView = React.memo<ResultViewProps>(({
  hexagram,
  transformedHexagram,
  aiInterpretation,
  masterAdvice,
  luckScore,
  isLoadingAi,
  onFetchAI,
  onNewDivination
}) => {
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 space-y-8"
    >
      <div className="bg-mystic-card p-10 rounded-[40px] shadow-2xl border border-mystic-accent/10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
          <Sparkles className="w-32 h-32 text-mystic-accent" />
        </div>

        <div className="flex justify-center gap-12 mb-10">
          <div className="flex flex-col items-center">
            <div className="text-7xl mb-4 text-mystic-text drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{hexagram.symbol}</div>
            <h2 className="text-3xl font-cursive text-mystic-accent">{hexagram.name}卦</h2>
            <p className="text-[10px] tracking-widest text-mystic-muted uppercase mt-1">本卦</p>
          </div>

          {transformedHexagram && (
            <div className="flex flex-col items-center">
              <div className="text-7xl mb-4 text-mystic-muted opacity-80">{transformedHexagram.symbol}</div>
              <h2 className="text-3xl font-cursive text-mystic-muted">{transformedHexagram.name}卦</h2>
              <p className="text-[10px] tracking-widest text-mystic-muted uppercase mt-1">变卦</p>
            </div>
          )}
        </div>

        <div className="title-decoration mx-auto" />

        <div className="text-left space-y-6 mt-10">
          <div className="p-8 bg-mystic-bg/50 rounded-3xl border-l-4 border-mystic-accent/50">
            <p className="text-[10px] font-bold text-mystic-accent uppercase tracking-[0.3em] mb-3">【本卦卦辞】</p>
            <p className="text-base leading-relaxed text-mystic-text/90 font-serif italic">{hexagram.judgment}</p>
          </div>
        </div>
      </div>

      <div className="bg-mystic-accent text-mystic-bg p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)]" />
        <h3 className="text-2xl font-cursive mb-8 flex items-center gap-3 relative z-10">
          <Sparkles className="w-6 h-6" /> 智慧启示
        </h3>
        {isLoadingAi ? (
          <div className="space-y-4 relative z-10">
            <div className="h-3 bg-mystic-bg/10 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-mystic-bg/10 rounded w-full animate-pulse" />
            <div className="h-3 bg-mystic-bg/10 rounded w-2/3 animate-pulse" />
          </div>
        ) : (
          <div className="space-y-8 relative z-10">
            <p className="text-base leading-loose font-serif whitespace-pre-wrap">
              {aiInterpretation}
            </p>

            {masterAdvice && (
              <div className="p-6 bg-mystic-bg/20 rounded-3xl border border-mystic-bg/10">
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> 大师建议
                </h4>
                <p className="text-sm leading-relaxed whitespace-pre-wrap font-serif">
                  {masterAdvice}
                </p>
              </div>
            )}

            <div className="p-6 bg-mystic-bg/20 rounded-3xl border border-mystic-bg/10">
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> 吉凶指数
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-4 bg-mystic-bg/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${luckScore}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className={cn(
                      "h-full rounded-full",
                      luckScore >= 70 ? "bg-gradient-to-r from-green-400 to-emerald-500" :
                      luckScore >= 40 ? "bg-gradient-to-r from-yellow-400 to-orange-500" :
                      "bg-gradient-to-r from-red-400 to-rose-500"
                    )}
                  />
                </div>
                <span className="text-2xl font-bold font-cursive">
                  {luckScore}
                </span>
              </div>
            </div>

            <button
              onClick={onFetchAI}
              disabled={isLoadingAi}
              className="w-full py-3 bg-mystic-bg/30 hover:bg-mystic-bg/50 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" /> 重新生成解读
            </button>

            <div className="pt-8 border-t border-mystic-bg/10 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> 傅氏易学
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> 哲学指引
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onNewDivination}
        className="w-full py-6 rounded-2xl bg-mystic-card border border-mystic-accent/20 font-bold text-sm tracking-[0.4em] flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all text-mystic-accent"
      >
        <RefreshCw className="w-4 h-4" /> 再次起卦
      </button>
    </motion.div>
  );
});

ResultView.displayName = 'ResultView';

export default ResultView;
