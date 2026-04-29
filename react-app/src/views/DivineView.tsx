import React from 'react';
import { motion } from 'motion/react';
import { Dices, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { NUMBER_MIN, NUMBER_MAX, type DivinationType } from '../types';

interface DivineViewProps {
  question: string;
  onQuestionChange: (q: string) => void;
  numberInputs: string[];
  onNumberInputChange: (inputs: string[]) => void;
  onRandom: () => void;
  onCalculate: () => void;
  onReset: () => void;
}

export const DivineView = React.memo<DivineViewProps>(({
  question,
  onQuestionChange,
  numberInputs,
  onNumberInputChange,
  onRandom,
  onCalculate,
  onReset
}) => {
  return (
    <motion.div
      key="divine"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-8 flex flex-col items-center min-h-full"
    >
      <div className="text-center mb-12 space-y-3">
        <h2 className="text-4xl font-cursive text-mystic-text">数字占卜</h2>
        <div className="title-decoration mx-auto" />
        <p className="text-[10px] text-mystic-muted uppercase tracking-[0.3em]">The Wisdom of Numbers</p>
      </div>

      <div className="w-full mb-10">
        <input
          type="text"
          placeholder="输入您的问题（可选）"
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          className="w-full px-6 py-5 rounded-2xl input-mystic text-center text-sm outline-none transition-all placeholder:text-mystic-muted/30 font-serif"
        />
      </div>

      <div className="w-full space-y-10 flex flex-col items-center">
        <div className="grid grid-cols-3 gap-6 w-full">
          {numberInputs.map((val, i) => (
            <div key={i} className="space-y-3">
              <label className="text-[10px] text-mystic-muted uppercase tracking-widest text-center block font-bold">
                {i === 0 ? "上卦数" : i === 1 ? "下卦数" : "动爻数"}
              </label>
              <input
                type="number"
                maxLength={3}
                placeholder={`${NUMBER_MIN}`}
                value={val}
                onChange={(e) => {
                  const newInputs = [...numberInputs];
                  newInputs[i] = e.target.value.slice(0, 3);
                  onNumberInputChange(newInputs);
                }}
                className="w-full bg-mystic-card border border-mystic-accent/20 rounded-2xl py-8 text-center text-3xl font-bold text-mystic-accent focus:ring-4 focus:ring-mystic-accent/20 outline-none transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder:opacity-10"
              />
            </div>
          ))}
        </div>

        <div className="p-6 bg-mystic-accent/5 rounded-2xl border border-mystic-accent/10 w-full">
          <p className="text-[11px] text-mystic-muted font-serif text-center leading-relaxed italic">
            "诚则灵，敬则通"<br />
            请输入三组三位数字（{NUMBER_MIN}-{NUMBER_MAX}），首位不可为 0。
          </p>
        </div>

        <button
          onClick={onRandom}
          className="w-full py-4 rounded-2xl bg-mystic-accent/10 border border-mystic-accent/20 font-bold text-sm tracking-[0.3em] flex items-center justify-center gap-2 transition-all text-mystic-accent hover:bg-mystic-accent/20"
        >
          <Dices className="w-4 h-4" /> 随机起卦
        </button>

        <button
          onClick={onCalculate}
          className="w-full bg-mystic-accent text-mystic-bg py-6 rounded-2xl font-bold text-lg tracking-[0.5em] shadow-[0_15px_40px_rgba(212,175,55,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3 hover:brightness-110"
        >
          起卦占卜 <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
});

DivineView.displayName = 'DivineView';

export default DivineView;
