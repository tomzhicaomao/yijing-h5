import { describe, it, expect } from 'vitest';
import { cn, generateRandomNumbers, validateNumberInputs } from '../../src/lib/utils';

describe('validateNumberInputs', () => {
  it('有效的三位数应通过验证', () => {
    expect(validateNumberInputs(['123', '456', '789'])).toBe(true);
  });

  it('首位为 0 的数字应拒绝', () => {
    expect(validateNumberInputs(['099', '100', '200'])).toBe(false);
  });

  it('非三位数应拒绝', () => {
    expect(validateNumberInputs(['12', '100', '200'])).toBe(false);
    expect(validateNumberInputs(['1234', '100', '200'])).toBe(false);
  });

  it('空字符串应拒绝', () => {
    expect(validateNumberInputs(['', '100', '200'])).toBe(false);
  });

  it('含字母的输入应拒绝', () => {
    expect(validateNumberInputs(['abc', '100', '200'])).toBe(false);
  });

  it('所有输入都有效才通过', () => {
    expect(validateNumberInputs(['123', '456', '0'])).toBe(false);
  });
});

describe('generateRandomNumbers', () => {
  it('应生成 3 个数字字符串', () => {
    const result = generateRandomNumbers();
    expect(result).toHaveLength(3);
    result.forEach(n => {
      expect(typeof n).toBe('string');
    });
  });

  it('每个数字应在 100-999 范围', () => {
    for (let i = 0; i < 100; i++) {
      const result = generateRandomNumbers();
      result.forEach(n => {
        const num = parseInt(n, 10);
        expect(num).toBeGreaterThanOrEqual(100);
        expect(num).toBeLessThanOrEqual(999);
      });
    }
  });

  it('生成的数字首位不应为 0', () => {
    for (let i = 0; i < 100; i++) {
      const result = generateRandomNumbers();
      result.forEach(n => {
        expect(n[0]).not.toBe('0');
      });
    }
  });
});

describe('cn', () => {
  it('应合并多个 class', () => {
    const result = cn('a', 'b');
    expect(result).toContain('a');
    expect(result).toContain('b');
  });

  it('应过滤 falsy 值', () => {
    const result = cn('a', false && 'b', undefined, null, 'c');
    expect(result).toContain('a');
    expect(result).toContain('c');
    expect(result).not.toContain('b');
  });

  it('应处理条件 class 对象', () => {
    const result = cn('base', { active: true, disabled: false });
    expect(result).toContain('base');
    expect(result).toContain('active');
    expect(result).not.toContain('disabled');
  });

  it('应解决 Tailwind 冲突', () => {
    const result = cn('px-4', 'px-2');
    // tailwind-merge 应只保留最后的 padding
    expect(result).toContain('px-2');
    expect(result).not.toContain('px-4');
  });
});
