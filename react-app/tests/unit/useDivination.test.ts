import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDivination } from '../../src/hooks/useDivination';

// Mock Supabase client
vi.mock('../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      }),
    },
  },
  auth: {},
  history: {
    save: vi.fn().mockResolvedValue({ data: null, error: null }),
    load: vi.fn().mockResolvedValue({ data: [], error: null }),
    delete: vi.fn().mockResolvedValue({ data: null, error: null }),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useDivination', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('初始状态为默认值', () => {
    const { result } = renderHook(() => useDivination());

    expect(result.current.lines).toEqual([]);
    expect(result.current.currentResult).toBeNull();
    expect(result.current.transformedResult).toBeNull();
    expect(result.current.aiInterpretation).toBe('');
    expect(result.current.luckScore).toBe(50);
    expect(result.current.isLoadingAi).toBe(false);
    expect(result.current.numberInputs).toEqual(['', '', '']);
  });

  it('startNewDivine 应重置所有状态', () => {
    const { result } = renderHook(() => useDivination());

    // 先设置一些状态
    act(() => {
      result.current.updateQuestion('测试');
      result.current.updateNumberInputs(['123', '456', '789']);
    });

    expect(result.current.question).toBe('测试');

    act(() => {
      result.current.startNewDivine();
    });

    expect(result.current.question).toBe('');
    expect(result.current.numberInputs).toEqual(['', '', '']);
    expect(result.current.currentResult).toBeNull();
    expect(result.current.transformedResult).toBeNull();
  });

  it('updateQuestion 应更新问题', () => {
    const { result } = renderHook(() => useDivination());

    act(() => {
      result.current.updateQuestion('今日运势？');
    });

    expect(result.current.question).toBe('今日运势？');
  });

  it('updateNumberInputs 应更新数字输入', () => {
    const { result } = renderHook(() => useDivination());

    act(() => {
      result.current.updateNumberInputs(['111', '222', '333']);
    });

    expect(result.current.numberInputs).toEqual(['111', '222', '333']);
  });

  it('calculateFromNumbers 无效输入返回 success: false', () => {
    const { result } = renderHook(() => useDivination());

    let calcResult: { success: boolean } = { success: true };
    act(() => {
      calcResult = result.current.calculateFromNumbers(['99', '100', '100']);
    });

    expect(calcResult.success).toBe(false);
  });

  it('calculateFromNumbers 有效输入返回 success: true', async () => {
    const { result } = renderHook(() => useDivination());

    let calcResult: { success: boolean } = { success: true };
    await act(async () => {
      calcResult = result.current.calculateFromNumbers(['111', '222', '333']);
    });

    expect(calcResult.success).toBe(true);
  });

  it('有效数字计算后应设置卦象', async () => {
    const { result } = renderHook(() => useDivination());

    await act(async () => {
      result.current.calculateFromNumbers(['111', '222', '333']);
    });

    await waitFor(() => {
      expect(result.current.currentResult).not.toBeNull();
    }, { timeout: 2000 });
  });
});
