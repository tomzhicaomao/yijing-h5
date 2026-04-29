import { useState, useEffect, useCallback } from 'react';
import { supabase, history as historyAPI } from '../lib/supabase';
import { getHexagramFromLines, Hexagram, calculateLuckScore } from '../constants/iching';
import { fetchAiInterpretation as fetchAi } from '../lib/ai';
import type { HistoryRecord, DivinationType } from '../types';

interface UseDivinationReturn {
  // 只读状态
  lines: number[];
  movingLines: number[];
  currentResult: Hexagram | null;
  transformedResult: Hexagram | null;
  aiInterpretation: string;
  masterAdvice: string;
  luckScore: number;
  isLoadingAi: boolean;
  question: string;
  divinationType: DivinationType;
  history: HistoryRecord[];
  selectedRecord: HistoryRecord | null;
  numberInputs: string[];

  // 用户输入更新
  updateQuestion: (q: string) => void;
  updateDivinationType: (t: DivinationType) => void;
  updateNumberInputs: (inputs: string[]) => void;

  // 语义化操作
  calculateFromNumbers: (inputs: string[]) => { success: boolean };
  fetchAiInterpretation: (hex: Hexagram, transHex: Hexagram | null, movingIdx: number[], userQuestion: string, divType: DivinationType) => Promise<void>;
  startNewDivine: () => void;
  deleteHistory: (id: string) => void;
  loadHistory: () => Promise<void>;
  selectHistoryRecord: (record: HistoryRecord) => void;
}

export function useDivination(): UseDivinationReturn {
  // 状态
  const [lines, setLines] = useState<number[]>([]);
  const [movingLines, setMovingLines] = useState<number[]>([]);
  const [currentResult, setCurrentResult] = useState<Hexagram | null>(null);
  const [transformedResult, setTransformedResult] = useState<Hexagram | null>(null);
  const [aiInterpretation, setAiInterpretation] = useState<string>('');
  const [masterAdvice, setMasterAdvice] = useState<string>('');
  const [luckScore, setLuckScore] = useState<number>(50);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>('');
  const [divinationType, setDivinationType] = useState<DivinationType>('other');
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const [numberInputs, setNumberInputs] = useState<string[]>(['', '', '']);
  const [hasLoadedFromSupabase, setHasLoadedFromSupabase] = useState<boolean>(false);

  // 加载历史记录
  const loadHistory = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await historyAPI.load(user.id, 100);
        if (!error && data) {
          const formattedHistory = data.map((item: any) => ({
            ...item,
            hexagram: {
              id: item.hexagram_id,
              name: item.hexagram_name,
              symbol: '',
              lines: [],
              judgment: '',
              image: '',
              meaning: '',
              trigrams: { upper: '', lower: '' }
            },
            transformedHexagram: item.transformed_hexagram_id ? {
              id: item.transformed_hexagram_id,
              name: item.transformed_hexagram_name,
              symbol: '',
              lines: [],
              judgment: '',
              image: '',
              meaning: '',
              trigrams: { upper: '', lower: '' }
            } : undefined
          }));
          setHistory(formattedHistory);
          setHasLoadedFromSupabase(true);
          return;
        }
        setHasLoadedFromSupabase(true);
      } else {
        setHasLoadedFromSupabase(true);
      }
    } catch (e) {
      console.error("Supabase 加载失败，使用 localStorage", e);
      setHasLoadedFromSupabase(false);
    }

    // Fallback: 从 localStorage 加载（仅当 Supabase 失败时）
    if (!hasLoadedFromSupabase) {
      const saved = localStorage.getItem('iching_history');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setHistory(parsed);
        } catch (e) {
          console.error("Failed to parse history", e);
        }
      }
    }
  }, [hasLoadedFromSupabase]);

  // 初始加载
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // 保存到历史记录
  const saveToHistory = useCallback((record: HistoryRecord) => {
    setHistory(prev => {
      const newHistory = [record, ...prev];
      // 保存到 localStorage
      localStorage.setItem('iching_history', JSON.stringify(newHistory));
      return newHistory;
    });

    // 异步保存到 Supabase
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        historyAPI.save({
          user_id: user.id,
          question: record.question,
          divination_type: record.divinationType,
          hexagram_id: record.hexagram.id,
          hexagram_name: record.hexagram.name,
          transformed_hexagram_id: record.transformedHexagram?.id,
          transformed_hexagram_name: record.transformedHexagram?.name,
          moving_lines: record.movingLines,
          interpretation: record.interpretation,
          master_advice: record.masterAdvice,
          luck_score: record.luckScore
        }).catch(e => console.error("Supabase 保存失败", e));
      }
    }).catch(e => console.error("Supabase 获取用户失败", e));
  }, []);

  // 从数字计算卦象
  const calculateFromNumbers = useCallback((inputs: string[]) => {
    // 使用传入的 inputs 或当前的 numberInputs
    const valuesToUse = inputs.length > 0 ? inputs : numberInputs;

    // 验证输入
    const isValid = valuesToUse.every(val => /^[1-9]\d{2}$/.test(val));
    if (!isValid) {
      console.error("请输入三组三位数，且首位不能为 0。");
      return { success: false };
    }

    const n1 = parseInt(valuesToUse[0]);
    const n2 = parseInt(valuesToUse[1]);
    const n3 = parseInt(valuesToUse[2]);

    // 卦象映射 (1-8) - 注意：lines 数组格式为 [top, middle, bottom]
    const getTrigramLines = (num: number) => {
      const remainder = num % 8 || 8;
      switch (remainder) {
        case 1: return [1, 1, 1]; // 乾
        case 2: return [0, 1, 1]; // 兑
        case 3: return [1, 0, 1]; // 离
        case 4: return [0, 0, 1]; // 震
        case 5: return [1, 1, 0]; // 巽
        case 6: return [0, 1, 0]; // 坎
        case 7: return [1, 0, 0]; // 艮
        case 8: return [0, 0, 0]; // 坤
        default: return [0, 0, 0];
      }
    };

    const upperTrigram = getTrigramLines(n1);
    const lowerTrigram = getTrigramLines(n2);
    const movingLineIdx = (n3 % 6 || 6) - 1; // 0-5

    // 卦爻：上卦 (0,1,2) + 下卦 (3,4,5) - 与 HEXAGRAMS 数据格式一致
    const newLines = [...upperTrigram, ...lowerTrigram];
    setLines(newLines);
    setMovingLines([movingLineIdx]);

    return { success: true };
  }, [numberInputs]);

  // 获取 AI 解读
  const fetchAiInterpretation = useCallback(async (
    hex: Hexagram,
    transHex: Hexagram | null,
    movingIdx: number[],
    userQuestion: string,
    divType: DivinationType
  ) => {
    setIsLoadingAi(true);

    const result = await fetchAi(hex, transHex, movingIdx, userQuestion, divType);

    setAiInterpretation(result.interpretation);
    setMasterAdvice(result.advice);
    setLuckScore(result.score);

    const record: HistoryRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      question: userQuestion || '近期运势',
      divinationType: divType,
      hexagram: hex,
      transformedHexagram: transHex || undefined,
      movingLines: movingIdx,
      interpretation: result.interpretation,
      masterAdvice: result.advice,
      luckScore: result.score
    };
    saveToHistory(record);
    setIsLoadingAi(false);
  }, [saveToHistory]);

  // 开始新的占卜
  const startNewDivine = useCallback(() => {
    setLines([]);
    setMovingLines([]);
    setNumberInputs(['', '', '']);
    setCurrentResult(null);
    setTransformedResult(null);
    setAiInterpretation('');
    setQuestion('');
  }, []);

  // 删除历史记录
  const deleteHistory = useCallback((id: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(h => h.id !== id);
      localStorage.setItem('iching_history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // 监听爻变，自动计算卦象
  useEffect(() => {
    if (lines.length === 6) {
      const hex = getHexagramFromLines(lines);
      if (!hex) return;

      setCurrentResult(hex);

      // 计算变卦
      const transformedLines = lines.map((line, idx) =>
        movingLines.includes(idx) ? (line === 1 ? 0 : 1) : line
      );

      const transHex = movingLines.length > 0 ? (getHexagramFromLines(transformedLines) || null) : null;
      setTransformedResult(transHex);
    }
  }, [lines, movingLines]);

  const selectHistoryRecord = useCallback((record: HistoryRecord) => {
    setSelectedRecord(record);
    setAiInterpretation(record.interpretation);
  }, []);

  return {
    // 只读状态
    lines,
    movingLines,
    currentResult,
    transformedResult,
    aiInterpretation,
    masterAdvice,
    luckScore,
    isLoadingAi,
    question,
    divinationType,
    history,
    selectedRecord,
    numberInputs,

    // 用户输入更新
    updateQuestion: setQuestion,
    updateDivinationType: setDivinationType,
    updateNumberInputs: setNumberInputs,

    // 语义化操作
    calculateFromNumbers,
    fetchAiInterpretation,
    startNewDivine,
    deleteHistory,
    loadHistory,
    selectHistoryRecord,
  };
}
