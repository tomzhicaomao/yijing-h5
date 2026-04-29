import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { Compass, History, User, Home, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from './lib/utils';
import type { Hexagram } from './constants/iching';
import { Profile } from './pages/Profile';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useDivination } from './hooks/useDivination';
import { generateRandomNumbers, validateNumberInputs } from './lib/utils';
import type { View, DivinationType, HistoryRecord } from './types';

// Lazy load view components for route-based code splitting
const HomeView = lazy(async () => import('./views/HomeView'));
const DivineView = lazy(async () => import('./views/DivineView'));
const ResultView = lazy(async () => import('./views/ResultView'));
const HistoryView = lazy(async () => import('./views/HistoryView'));

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
  const [selectedRecord, setSelectedRecordState] = useState<HistoryRecord | null>(null);
  const autoFetchRef = useRef(false);

  const {
    currentResult,
    transformedResult,
    aiInterpretation,
    masterAdvice,
    luckScore,
    isLoadingAi,
    question,
    divinationType,
    history,
    movingLines,
    numberInputs,

    updateQuestion,
    updateDivinationType,
    updateNumberInputs,

    calculateFromNumbers: calculateFromNumbersHook,
    fetchAiInterpretation: fetchAiInterpretationHook,
    startNewDivine,
    deleteHistory: deleteHistoryHook,
    selectHistoryRecord,
  } = useDivination();

  const handleRandomGenerate = () => {
    const randomNumbers = generateRandomNumbers();
    updateNumberInputs(randomNumbers);
  };

  const calculateFromNumbers = () => {
    const isValid = validateNumberInputs(numberInputs);
    if (!isValid) {
      toast.error("请输入三组三位数，且首位不能为 0。");
      return;
    }

    const result = calculateFromNumbersHook(numberInputs);
    if (result.success) {
      autoFetchRef.current = true;
      setTimeout(() => {
        setActiveView('result');
      }, 1000);
    }
  };

  // 起卦完成后自动触发 AI 解读
  useEffect(() => {
    if (autoFetchRef.current && currentResult && !isLoadingAi) {
      autoFetchRef.current = false;
      fetchAiInterpretationHook(
        currentResult,
        transformedResult,
        movingLines,
        question,
        divinationType
      );
    }
  }, [currentResult, isLoadingAi]);

  const fetchAiInterpretation = async (
    hex: Hexagram,
    transHex: Hexagram | null,
    movingIdx: number[],
    userQuestion: string,
    divType: DivinationType
  ) => {
    await fetchAiInterpretationHook(hex, transHex, movingIdx, userQuestion, divType);
    setActiveView('result');
  };

  const deleteHistory = (id: string) => {
    deleteHistoryHook(id);
  };

  const startNewDivination = () => {
    startNewDivine();
    setActiveView('divine');
  };

  const setSelectedRecord = (record: HistoryRecord | null) => {
    setSelectedRecordState(record);
    if (record) {
      selectHistoryRecord(record);
    }
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
          <ErrorBoundary>
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="text-mystic-accent">Loading...</div></div>}>
              {activeView === 'home' && (
                <HomeView
                  onNavigate={setActiveView}
                  onSetNumberInputs={updateNumberInputs}
                  onSetDivinationType={updateDivinationType}
                  onSetQuestion={updateQuestion}
                />
              )}
              {activeView === 'divine' && (
                <DivineView
                  question={question}
                  onQuestionChange={updateQuestion}
                  numberInputs={numberInputs}
                  onNumberInputChange={updateNumberInputs}
                  onRandom={handleRandomGenerate}
                  onCalculate={calculateFromNumbers}
                  onReset={startNewDivine}
                />
              )}

              {activeView === 'result' && (currentResult || selectedRecord) && (
                <ResultView
                  hexagram={currentResult || selectedRecord!.hexagram}
                  transformedHexagram={transformedResult || selectedRecord?.transformedHexagram}
                  aiInterpretation={aiInterpretation}
                  masterAdvice={masterAdvice}
                  luckScore={luckScore}
                  isLoadingAi={isLoadingAi}
                  onFetchAI={() => fetchAiInterpretation(
                    currentResult || selectedRecord!.hexagram,
                    transformedResult || selectedRecord?.transformedHexagram || null,
                    movingLines,
                    question || selectedRecord?.question || '',
                    divinationType || selectedRecord?.divinationType || 'other'
                  )}
                  onNewDivination={startNewDivination}
                  movingLines={movingLines}
                  question={question}
                  divinationType={divinationType}
                />
              )}
              {activeView === 'result' && !currentResult && !selectedRecord && numberInputs.some(n => n) && (
                <div className="p-8 text-center text-mystic-text">
                  <p>Loading hexagram...</p>
                </div>
              )}
              {activeView === 'history' && (
                <HistoryView
                  history={history}
                  onSelectRecord={(record: HistoryRecord) => {
                    setSelectedRecord(record);
                  }}
                  onDeleteRecord={deleteHistory}
                  onNavigateToResult={() => setActiveView('result')}
                />
              )}
              {activeView === 'profile' && (
                <Profile />
              )}
            </Suspense>
          </ErrorBoundary>
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
          onClick={startNewDivination}
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
      <Toaster position="top-center" richColors />
    </div>
  );
}
