import { describe, it, expect } from 'vitest';
import { getHexagramFromLines, calculateLuckScore, HEXAGRAMS } from '../../src/constants/iching';

describe('getHexagramFromLines', () => {
  it('应返回乾卦 (id=1) 当爻象全阳', () => {
    const result = getHexagramFromLines([1, 1, 1, 1, 1, 1]);
    expect(result).toBeDefined();
    expect(result!.id).toBe(1);
    expect(result!.name).toBe('乾');
  });

  it('应返回坤卦 (id=2) 当爻象全阴', () => {
    const result = getHexagramFromLines([0, 0, 0, 0, 0, 0]);
    expect(result).toBeDefined();
    expect(result!.id).toBe(2);
    expect(result!.name).toBe('坤');
  });

  it('应返回既济卦 (id=63) 当爻象为 101010', () => {
    const result = getHexagramFromLines([1, 0, 1, 0, 1, 0]);
    expect(result).toBeDefined();
    expect(result!.id).toBe(63);
    expect(result!.name).toBe('既济');
  });

  it('应返回 undefined 当爻象无匹配', () => {
    // 64卦中不存在全阳但变体
    const result = getHexagramFromLines([2, 2, 2, 2, 2, 2]);
    expect(result).toBeUndefined();
  });

  it('空数组应返回 undefined', () => {
    const result = getHexagramFromLines([]);
    expect(result).toBeUndefined();
  });

  it('64卦数据完整性: 每个 id 唯一', () => {
    const ids = HEXAGRAMS.map(h => h.id);
    expect(new Set(ids).size).toBe(64);
  });

  it('常见的卦象应能正确匹配', () => {
    // 验证几个代表性卦象
    const testCases = [
      { lines: [1, 1, 1, 1, 1, 1], expectedId: 1, name: '乾' },
      { lines: [0, 0, 0, 0, 0, 0], expectedId: 2, name: '坤' },
      { lines: [1, 0, 1, 0, 1, 0], expectedId: 63, name: '既济' },
      { lines: [0, 0, 0, 1, 1, 1], expectedId: 11, name: '泰' },
      { lines: [1, 1, 1, 0, 0, 0], expectedId: 12, name: '否' },
    ];

    for (const tc of testCases) {
      const found = getHexagramFromLines(tc.lines);
      expect(found, `${tc.name}卦应匹配`).toBeDefined();
      expect(found!.id).toBe(tc.expectedId);
    }
  });
});

describe('calculateLuckScore', () => {
  it('吉卦分数应 >= 70', () => {
    const qian = HEXAGRAMS.find(h => h.id === 1)!;
    const score = calculateLuckScore(qian, []);
    expect(score).toBeGreaterThanOrEqual(70);
  });

  it('凶卦分数应 <= 50', () => {
    const pi = HEXAGRAMS.find(h => h.id === 12)!; // 否卦
    const score = calculateLuckScore(pi, []);
    expect(score).toBeLessThanOrEqual(50);
  });

  it('分数应在 0-100 范围', () => {
    for (const hex of HEXAGRAMS) {
      const score = calculateLuckScore(hex, []);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });

  it('有动爻时分数会调整', () => {
    const hex = HEXAGRAMS.find(h => h.id === 1)!;
    const noMove = calculateLuckScore(hex, []);
    const oneMove = calculateLuckScore(hex, [0]);
    expect(noMove).not.toBe(oneMove);
  });

  it('动爻过多时扣分', () => {
    const hex = HEXAGRAMS.find(h => h.id === 1)!;
    const noMove = calculateLuckScore(hex, []);
    const manyMoves = calculateLuckScore(hex, [0, 1, 2, 3]);
    expect(manyMoves).toBeLessThan(noMove);
  });

  it('卦辞含"吉"加分', () => {
    const tai = HEXAGRAMS.find(h => h.id === 11)!; // 泰卦, "吉，亨"
    const base = calculateLuckScore(tai, []);
    expect(base).toBeGreaterThanOrEqual(70);
  });

  it('卦辞含"凶"扣分', () => {
    const song = HEXAGRAMS.find(h => h.id === 6)!; // 讼卦, "终凶"
    const base = calculateLuckScore(song, []);
    expect(base).toBeLessThanOrEqual(50);
  });
});
