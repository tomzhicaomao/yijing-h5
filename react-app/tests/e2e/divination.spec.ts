import { test, expect } from '@playwright/test';
import { YiJingApp, HomePage, DivinePage } from './pages/yijing';

test.describe('易经占卜 - 起卦功能', () => {
  let app: YiJingApp;
  let homePage: HomePage;
  let divinePage: DivinePage;

  test.beforeEach(async ({ page }) => {
    app = new YiJingApp(page);
    homePage = new HomePage(page);
    divinePage = new DivinePage(page);
    await app.goto();
    await homePage.clickSelfDivination();
  });

  test('起卦页面应该正确加载', async ({ page }) => {
    await expect(divinePage.pageTitle).toBeVisible();
    await expect(divinePage.upperGuaInput).toBeVisible();
    await expect(divinePage.lowerGuaInput).toBeVisible();
    await expect(divinePage.movingLineInput).toBeVisible();
    await expect(divinePage.randomBtn).toBeVisible();
    await expect(divinePage.submitBtn).toBeVisible();
  });

  test('输入框应该有正确的占位符和标签', async ({ page }) => {
    await expect(page.locator('label', { hasText: '上卦数' })).toBeVisible();
    await expect(page.locator('label', { hasText: '下卦数' })).toBeVisible();
    await expect(page.locator('label', { hasText: '动爻数' })).toBeVisible();
    await expect(divinePage.upperGuaInput).toHaveAttribute('placeholder', '100');
  });

  test('输入无效数字时应该显示错误提示', async ({ page }) => {
    await divinePage.fillNumbers('99', '100', '100');
    await divinePage.clickSubmit();
    await expect(page.getByText('请输入三组三位数，且首位不能为 0。')).toBeVisible();
  });

  test('输入首位为 0 的数字应该显示错误提示', async ({ page }) => {
    await divinePage.fillNumbers('099', '100', '100');
    await divinePage.clickSubmit();
    await expect(page.getByText('请输入三组三位数，且首位不能为 0。')).toBeVisible();
  });

  test('随机起卦功能应该生成有效的三位数', async ({ page }) => {
    await divinePage.clickRandom();
    const values = await divinePage.getNumberInputValues();
    expect(values).toHaveLength(3);
    values.forEach(value => {
      expect(value).toMatch(/^[1-9]\d{2}$/);
    });
  });

  test('多次随机起卦应该生成不同的数字', async ({ page }) => {
    await divinePage.clickRandom();
    const values1 = await divinePage.getNumberInputValues();
    await divinePage.clickRandom();
    const values2 = await divinePage.getNumberInputValues();
    expect(JSON.stringify(values1)).not.toBe(JSON.stringify(values2));
  });

  test('输入有效数字后应该可以提交', async ({ page }) => {
    await divinePage.fillNumbers('123', '456', '789');
    await divinePage.clickSubmit();

    // 等待导航到结果页面
    await page.waitForTimeout(1500);

    // 验证结果页面 - 使用"本卦卦辞"来验证（与通过的测试一致）
    await expect(page.locator('text=本卦卦辞')).toBeVisible({ timeout: 5000 });
  });

  test('输入问题后应该可以提交', async ({ page }) => {
    await divinePage.fillQuestion('今日运势如何？');
    await divinePage.fillNumbers('321', '654', '987');
    await divinePage.clickSubmit();

    // 等待导航
    await page.waitForTimeout(1500);

    // 验证结果页面 - 使用"本卦卦辞"来验证
    await expect(page.locator('text=本卦卦辞')).toBeVisible({ timeout: 5000 });
  });

  test('输入框应该限制为 3 位数字', async ({ page }) => {
    await divinePage.upperGuaInput.fill('12345');
    const value = await divinePage.upperGuaInput.inputValue();
    expect(value.length).toBeLessThanOrEqual(3);
  });
});
