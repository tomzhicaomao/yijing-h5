import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Dices, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import type { DivinationType, View } from '../types';

interface HomeViewProps {
  onNavigate: (view: View) => void;
  onSetNumberInputs: (inputs: string[]) => void;
  onSetDivinationType: (type: DivinationType) => void;
  onSetQuestion: (question: string) => void;
}

export const HomeView = React.memo<HomeViewProps>(({
  onNavigate,
  onSetNumberInputs,
  onSetDivinationType,
  onSetQuestion
}) => {
  const handleStartDivination = () => {
    onSetNumberInputs(['', '', '']);
    onSetDivinationType('other');
    onSetQuestion('');
    onNavigate('divine');
  };

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-10"
    >
      {/* Welcome Section */}
      <div className="text-center py-12">
        <div className="mb-8 relative inline-block">
          <div className="w-24 h-24 rounded-full bg-mystic-accent/10 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-mystic-accent" />
          </div>
        </div>

        <h2 className="text-5xl font-cursive text-mystic-text mb-3">易经占卜</h2>
        <p className="text-[10px] text-mystic-muted uppercase tracking-[0.4em]">YIJING FORTUNE TELLER</p>

        <div className="title-decoration mx-auto" />

        <p className="text-sm text-mystic-muted/80 mt-8 max-w-md leading-loose">
          先天起卦，感而遂通<br />
          以三数定卦象，窥探天机之微妙
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-2 gap-6">
        <motion.button
          onClick={handleStartDivination}
          whileTap={{ scale: 0.98 }}
          className="glass-card p-8 flex flex-col items-center justify-center gap-4 active:scale-95 transition-all"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mystic-accent to-yellow-600 flex items-center justify-center text-3xl shadow-lg">
            🔮
          </div>
          <div className="text-center">
            <h3 className="font-bold text-mystic-text mb-1">自主起卦</h3>
            <p className="text-[10px] text-mystic-muted">输入数字起卦</p>
          </div>
        </motion.button>

        <motion.button
          onClick={handleStartDivination}
          whileTap={{ scale: 0.98 }}
          className="glass-card p-8 flex flex-col items-center justify-center gap-4 active:scale-95 transition-all"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-3xl shadow-lg">
            🎲
          </div>
          <div className="text-center">
            <h3 className="font-bold text-mystic-text mb-1">每日一占</h3>
            <p className="text-[10px] text-mystic-muted">随机获取指引</p>
          </div>
        </motion.button>
      </div>

      {/* Features */}
      <div className="space-y-4 pt-8">
        {[
          { icon: '📜', title: '先天易学', desc: '傅佩荣易学体系' },
          { icon: '🤖', title: 'AI 解读', desc: '智能卦象分析' },
          { icon: '☁️', title: '云端同步', desc: '历史记录保存' }
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-4 p-5 bg-mystic-card/50 rounded-2xl border border-mystic-accent/5">
            <span className="text-2xl">{feature.icon}</span>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-mystic-text">{feature.title}</h4>
              <p className="text-[10px] text-mystic-muted">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="text-center p-8 glass-card rounded-3xl">
        <p className="text-[11px] text-mystic-muted font-serif leading-relaxed">
          "易与天地准，故能弥纶天地之道"<br />
          <span className="text-[10px] opacity-70">— 《周易·系辞上》</span>
        </p>
      </div>
    </motion.div>
  );
});

HomeView.displayName = 'HomeView';

export default HomeView;
