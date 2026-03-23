import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  ScrollText, 
  Sparkles, 
  History, 
  User,
  Home,
  ChevronRight, 
  RefreshCw,
  Share2,
  Trash2,
  BookOpen,
  Star,
  ShieldCheck,
  MessageSquare,
  Zap,
  Dices,
  TrendingUp,
  Lightbulb,
  RotateCcw
} from 'lucide-react';
import { cn } from './lib/utils';
import { getHexagramFromLines, Hexagram } from './constants/iching';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

type View = 'home' | 'divine' | 'history' | 'profile' | 'result';

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

type DivinationType = 'wealth' | 'love' | 'health' | 'career' | 'other';

const DIVINATION_TYPES: { value: DivinationType; label: string; icon: string }[] = [
  { value: 'wealth', label: '财运', icon: '💰' },
  { value: 'love', label: '感情', icon: '💕' },
  { value: 'health', label: '健康', icon: '💪' },
  { value: 'career', label: '学业', icon: '📚' },
  { value: 'other', label: '其他', icon: '🔮' },
];

// Custom Thematic Icon Component
const ThematicIcon = ({ icon: Icon, active, className }: { icon: any, active?: boolean, className?: string }) => (
  <div className={cn(
    "nav-icon-wrapper",
    active ? "bg-mystic-accent text-mystic-bg" : "bg-transparent text-mystic-muted",
    className
  )}>
    <Icon className="w-5 h-5" />
  </div>
);

// Custom Taiji Logo Component
const TaijiLogo = ({ className, showFrame = false, size = "w-10 h-10" }: { className?: string, showFrame?: boolean, size?: string }) => (
  <div className={cn("relative flex items-center justify-center", size, className)}>
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background Circle (White Fish) */}
        <circle cx="50" cy="50" r="50" fill="white" />
        
        {/* Black Fish */}
        <path 
          d="M 50 0 
             A 50 50 0 0 1 50 100 
             A 25 25 0 0 1 50 50 
             A 25 25 0 0 0 50 0" 
          fill="black" 
        />
        
        {/* The Dots (Eyes) */}
        {/* Black dot on the white fish (top) */}
        <circle cx="50" cy="25" r="10" fill="black" />
        
        {/* White dot on the black fish (bottom) */}
        <circle cx="50" cy="75" r="10" fill="white" />
      </svg>
    </motion.div>
    {showFrame && (
      <div className="absolute inset-0 border border-mystic-accent/30 rotate-45 rounded-lg animate-pulse" />
    )}
  </div>
);

export default function App() {
  const [activeView, setActiveView] = useState<View>('home');
  const [numberInputs, setNumberInputs] = useState<string[]>(['', '', '']);
  const [isRolling, setIsRolling] = useState(false);
  const [lines, setLines] = useState<number[]>([]); // 0: yin, 1: yang
  const [movingLines, setMovingLines] = useState<number[]>([]); // indices of moving lines (0-5)
  const [currentResult, setCurrentResult] = useState<Hexagram | null>(null);
  const [transformedResult, setTransformedResult] = useState<Hexagram | null>(null);
  const [aiInterpretation, setAiInterpretation] = useState<string>('');
  const [masterAdvice, setMasterAdvice] = useState<string>('');
  const [luckScore, setLuckScore] = useState<number>(50);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [question, setQuestion] = useState('');
  const [divinationType, setDivinationType] = useState<DivinationType>('other');
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('iching_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (record: HistoryRecord) => {
    const newHistory = [record, ...history];
    setHistory(newHistory);
    localStorage.setItem('iching_history', JSON.stringify(newHistory));
  };

  const calculateFromNumbers = () => {
    // Validate inputs
    const isValid = numberInputs.every(val => /^[1-9]\d{2}$/.test(val));
    if (!isValid) {
      alert("请输入三组三位数，且首位不能为0。");
      return;
    }

    const n1 = parseInt(numberInputs[0]);
    const n2 = parseInt(numberInputs[1]);
    const n3 = parseInt(numberInputs[2]);

    // Trigram mapping (1-8)
    const getTrigramLines = (num: number) => {
      const remainder = num % 8 || 8;
      switch (remainder) {
        case 1: return [1, 1, 1]; // Qian
        case 2: return [1, 1, 0]; // Dui
        case 3: return [1, 0, 1]; // Li
        case 4: return [1, 0, 0]; // Zhen
        case 5: return [0, 1, 1]; // Xun
        case 6: return [0, 1, 0]; // Kan
        case 7: return [0, 0, 1]; // Gen
        case 8: return [0, 0, 0]; // Kun
        default: return [0, 0, 0];
      }
    };

    const upperTrigram = getTrigramLines(n1);
    const lowerTrigram = getTrigramLines(n2);
    const movingLineIdx = (n3 % 6 || 6) - 1; // 0-5

    // Hexagram lines: lower (0,1,2) + upper (3,4,5)
    const newLines = [...lowerTrigram, ...upperTrigram];
    setLines(newLines);
    setMovingLines([movingLineIdx]);
  };

  useEffect(() => {
    if (lines.length === 6) {
      const hex = getHexagramFromLines(lines);
      setCurrentResult(hex);
      
      // Calculate transformed hexagram
      const transformedLines = lines.map((line, idx) => 
        movingLines.includes(idx) ? (line === 1 ? 0 : 1) : line
      );
      
      const transHex = movingLines.length > 0 ? getHexagramFromLines(transformedLines) : null;
      setTransformedResult(transHex);
      
      fetchAiInterpretation(hex, transHex, movingLines, question);
    }
  }, [lines, movingLines]);

  const fetchAiInterpretation = async (hex: Hexagram, transHex: Hexagram | null, movingIdx: number[], userQuestion: string) => {
    setIsLoadingAi(true);
    try {
      const movingLinesText = movingIdx.length > 0 
        ? `动爻为：第${movingIdx.map(i => i + 1).join('、')}爻。变卦为：${transHex?.name}卦。`
        : "无动爻。";

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `作为一名深研易经的大师（遵循傅佩荣教授的易经哲学），请针对用户的问题：“${userQuestion || '近期运势'}”，解读其通过数字占卜法占得的卦象。
        本卦：${hex.name}卦（${hex.pinyin}）。卦辞：${hex.judgment}。象曰：${hex.image}。
        ${movingLinesText}
        请根据傅佩荣教授的解读规则（无动爻看本卦卦辞，一动爻看该爻辞，多动爻综合分析）提供深度的、充满哲学智慧且令人信服的分析。
        字数约300字，语气庄重、儒雅。`,
      });
      const text = response.text || '解析失败，请重试。';
      setAiInterpretation(text);
      
      const record: HistoryRecord = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        question: userQuestion || '近期运势',
        divinationType: divinationType,
        hexagram: hex,
        transformedHexagram: transHex || undefined,
        movingLines: movingIdx,
        interpretation: text,
        masterAdvice: masterAdvice,
        luckScore: luckScore
      };
      saveToHistory(record);
      setActiveView('result');
    } catch (error) {
      console.error(error);
      setAiInterpretation('天机不可泄露，请再次尝试。');
      setActiveView('result');
    } finally {
      setIsLoadingAi(false);
    }
  };

  const startNewDivine = () => {
    setLines([]);
    setMovingLines([]);
    setNumberInputs(['', '', '']);
    setCurrentResult(null);
    setTransformedResult(null);
    setAiInterpretation('');
    setQuestion('');
    setActiveView('divine');
  };

  const deleteHistory = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem('iching_history', JSON.stringify(newHistory));
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-8 bg-mystic-bg/80 backdrop-blur-xl z-50 border-b border-mystic-accent/10">
        <div className="flex items-center gap-4">
          <TaijiLogo />
          <div>
            <h1 className="text-xl font-cursive tracking-widest text-mystic-text text-glow">傅氏易经</h1>
            <div className="title-decoration !m-0 !w-full" />
          </div>
        </div>
        <div className="flex gap-4">
          <button className="w-10 h-10 rounded-full bg-mystic-card flex items-center justify-center text-mystic-accent/60 hover:text-mystic-accent transition-colors shadow-sm border border-mystic-accent/10">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="scroll-area">
        <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 space-y-12"
            >
              {/* Refined Welcome Header */}
              <div className="text-center space-y-4 pt-4">
                <span className="text-[10px] uppercase tracking-[0.6em] text-mystic-accent font-bold opacity-80">The Sage's Path</span>
                <h2 className="text-6xl font-cursive text-mystic-text drop-shadow-lg">格物致知</h2>
                <div className="title-decoration mx-auto" />
                <p className="text-xs text-mystic-muted tracking-[0.2em] font-serif leading-relaxed">
                  傅佩荣教授推荐：数字占卜法<br />
                  以诚敬之心，探寻天人之际
                </p>
              </div>

              {/* Main Action Area - Mysterious Design */}
              <div className="relative p-[1px] bg-gradient-to-br from-mystic-accent/30 via-transparent to-mystic-accent/10 rounded-[48px] overflow-hidden group">
                <div className="bg-mystic-card rounded-[47px] p-12 flex flex-col items-center text-center space-y-10 shadow-2xl relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_70%)]" />
                  
                  <div className="bagua-frame max-w-[220px] relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border border-mystic-accent/20 rounded-full"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-4 border border-mystic-accent/10 rounded-full border-dashed"
                    />
                    <div className="w-32 h-32 bg-mystic-bg rounded-full flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.7)] border border-mystic-accent/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1),transparent_70%)]" />
                      <TaijiLogo size="w-20 h-20" />
                    </div>
                  </div>
                  
                  <div className="space-y-4 relative z-10">
                    <h3 className="text-3xl font-serif font-bold tracking-tight text-mystic-text text-glow">诚心起卦</h3>
                    <p className="text-sm text-mystic-muted leading-relaxed px-4 font-serif">
                      摒除杂念，专心致志。<br />
                      通过三组数字，感应宇宙之律。
                    </p>
                  </div>

                  <button 
                    onClick={startNewDivine}
                    className="w-full bg-mystic-accent text-mystic-bg py-6 rounded-2xl font-bold text-base tracking-[0.4em] shadow-[0_15px_40px_rgba(212,175,55,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 hover:brightness-110 hover:shadow-mystic-accent/40"
                  >
                    开启占卜 <ChevronRight className="w-5 h-5 opacity-70" />
                  </button>
                </div>
              </div>

              {/* Stats & Trust */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-mystic-card p-6 rounded-3xl border border-mystic-accent/5 shadow-lg flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-mystic-accent/10 flex items-center justify-center">
                    <History className="w-5 h-5 text-mystic-accent" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-mystic-text">{history.length}</div>
                    <div className="text-[10px] text-mystic-muted uppercase tracking-wider">占卜记录</div>
                  </div>
                </div>
                <div className="bg-mystic-card p-6 rounded-3xl border border-mystic-accent/5 shadow-lg flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-mystic-accent/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-mystic-accent" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-mystic-text">4</div>
                    <div className="text-[10px] text-mystic-muted uppercase tracking-wider">探索天数</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'divine' && (
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
                  onChange={(e) => setQuestion(e.target.value)}
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
                        placeholder="100"
                        value={val}
                        onChange={(e) => {
                          const newInputs = [...numberInputs];
                          newInputs[i] = e.target.value.slice(0, 3);
                          setNumberInputs(newInputs);
                        }}
                        className="w-full bg-mystic-card border border-mystic-accent/20 rounded-2xl py-8 text-center text-3xl font-bold text-mystic-accent focus:ring-4 focus:ring-mystic-accent/20 outline-none transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder:opacity-10"
                      />
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-mystic-accent/5 rounded-2xl border border-mystic-accent/10 w-full">
                  <p className="text-[11px] text-mystic-muted font-serif text-center leading-relaxed italic">
                    “诚则灵，敬则通”<br />
                    请输入三组三位数字（100-999），首位不可为0。
                  </p>
                </div>

                <button 
                  onClick={calculateFromNumbers}
                  className="w-full bg-mystic-accent text-mystic-bg py-6 rounded-2xl font-bold text-lg tracking-[0.5em] shadow-[0_15px_40px_rgba(212,175,55,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3 hover:brightness-110"
                >
                  起卦占卜 <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {activeView === 'result' && (currentResult || selectedRecord) && (
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
                    <div className="text-7xl mb-4 text-mystic-text drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{(currentResult || selectedRecord?.hexagram)?.symbol}</div>
                    <h2 className="text-3xl font-cursive text-mystic-accent">{(currentResult || selectedRecord?.hexagram)?.name}卦</h2>
                    <p className="text-[10px] tracking-widest text-mystic-muted uppercase mt-1">本卦</p>
                  </div>
                  
                  {(transformedResult || selectedRecord?.transformedHexagram) && (
                    <div className="flex flex-col items-center">
                      <div className="text-7xl mb-4 text-mystic-muted opacity-80">{(transformedResult || selectedRecord?.transformedHexagram)?.symbol}</div>
                      <h2 className="text-3xl font-cursive text-mystic-muted">{(transformedResult || selectedRecord?.transformedHexagram)?.name}卦</h2>
                      <p className="text-[10px] tracking-widest text-mystic-muted uppercase mt-1">变卦</p>
                    </div>
                  )}
                </div>
                
                <div className="title-decoration mx-auto" />

                <div className="text-left space-y-6 mt-10">
                  <div className="p-8 bg-mystic-bg/50 rounded-3xl border-l-4 border-mystic-accent/50">
                    <p className="text-[10px] font-bold text-mystic-accent uppercase tracking-[0.3em] mb-3">【本卦卦辞】</p>
                    <p className="text-base leading-relaxed text-mystic-text/90 font-serif italic">{(currentResult || selectedRecord?.hexagram)?.judgment}</p>
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
                      {aiInterpretation || selectedRecord?.interpretation}
                    </p>
                    
                    {(masterAdvice || selectedRecord?.masterAdvice) && (
                      <div className="p-6 bg-mystic-bg/20 rounded-3xl border border-mystic-bg/10">
                        <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" /> 大师建议
                        </h4>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap font-serif">
                          {masterAdvice || selectedRecord?.masterAdvice}
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
                            animate={{ width: `${luckScore || selectedRecord?.luckScore || 50}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className={cn(
                              "h-full rounded-full",
                              (luckScore || selectedRecord?.luckScore || 50) >= 70 ? "bg-gradient-to-r from-green-400 to-emerald-500" :
                              (luckScore || selectedRecord?.luckScore || 50) >= 40 ? "bg-gradient-to-r from-yellow-400 to-orange-500" :
                              "bg-gradient-to-r from-red-400 to-rose-500"
                            )}
                          />
                        </div>
                        <span className="text-2xl font-bold font-cursive">
                          {luckScore || selectedRecord?.luckScore || 50}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => fetchAiInterpretation(currentResult || selectedRecord!.hexagram, transformedResult || selectedRecord?.transformedHexagram || null, movingLines || selectedRecord?.movingLines || [], question || selectedRecord?.question || '')}
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
                onClick={startNewDivine}
                className="w-full py-6 rounded-2xl bg-mystic-card border border-mystic-accent/20 font-bold text-sm tracking-[0.4em] flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all text-mystic-accent"
              >
                <RefreshCw className="w-4 h-4" /> 再次起卦
              </button>
            </motion.div>
          )}

          {activeView === 'history' && (
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
                        setSelectedRecord(record);
                        setAiInterpretation(record.interpretation);
                        setActiveView('result');
                      }}
                      className="bg-mystic-card p-6 rounded-[32px] border border-mystic-accent/5 shadow-lg flex items-center gap-6 active:scale-[0.98] transition-all group"
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
                          deleteHistory(record.id);
                        }}
                        className="p-3 text-mystic-muted/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 space-y-12"
            >
              <div className="flex flex-col items-center py-12">
                <div className="relative w-32 h-32 mb-8">
                  <div className="absolute inset-0 border-2 border-mystic-accent/20 rotate-45 rounded-[40px] animate-[rotate-slow_30s_linear_infinite]" />
                  <div className="absolute inset-3 overflow-hidden rounded-[32px] border border-mystic-accent/10 shadow-2xl">
                    <img src="https://picsum.photos/seed/seeker/300/300" className="w-full h-full object-cover grayscale brightness-75" referrerPolicy="no-referrer" />
                  </div>
                </div>
                <h2 className="text-4xl font-cursive text-mystic-text">缘主</h2>
                <div className="title-underline mx-auto w-16" />
                <p className="text-[10px] text-mystic-muted mt-5 uppercase tracking-[0.3em]">Seeker of Wisdom</p>
              </div>

              <div className="bg-mystic-card rounded-[40px] border border-mystic-accent/5 overflow-hidden shadow-2xl">
                {[
                  { icon: Star, label: "我的收藏" },
                  { icon: MessageSquare, label: "大师咨询" },
                  { icon: BookOpen, label: "易学典籍" },
                  { icon: User, label: "设置" }
                ].map((item, i, arr) => (
                  <div key={i} className={cn(
                    "p-7 flex items-center justify-between active:bg-white/5 transition-colors",
                    i !== arr.length - 1 && "border-b border-mystic-accent/5"
                  )}>
                    <div className="flex items-center gap-5">
                      <item.icon className="w-5 h-5 text-mystic-accent" />
                      <span className="text-base font-medium text-mystic-text/80">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-mystic-accent/20" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          onClick={() => setActiveView('home')}
          className={cn("nav-item", activeView === 'home' && "active")}
        >
          <ThematicIcon icon={Home} active={activeView === 'home'} />
          <span>首页</span>
        </button>
        <button 
          onClick={startNewDivine}
          className={cn("nav-item", activeView === 'divine' && "active")}
        >
          <ThematicIcon icon={Compass} active={activeView === 'divine'} />
          <span>起卦</span>
        </button>
        <button 
          onClick={() => setActiveView('history')}
          className={cn("nav-item", activeView === 'history' && "active")}
        >
          <ThematicIcon icon={History} active={activeView === 'history'} />
          <span>记录</span>
        </button>
        <button 
          onClick={() => setActiveView('profile')}
          className={cn("nav-item", activeView === 'profile' && "active")}
        >
          <ThematicIcon icon={User} active={activeView === 'profile'} />
          <span>我的</span>
        </button>
      </nav>
    </div>
  );
}
