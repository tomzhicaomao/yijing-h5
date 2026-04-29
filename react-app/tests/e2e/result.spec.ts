import { test, expect } from '@playwright/test';
import { YiJingApp, HomePage, DivinePage, ResultPage } from './pages/yijing';

test.describe('易经占卜 - 结果页面功能', () => {
  let app: YiJingApp;
  let homePage: HomePage;
  let divinePage: DivinePage;
  let resultPage: ResultPage;

  test.beforeEach(async ({ page }) => {
    app = new YiJingApp(page);
    homePage = new HomePage(page);
    divinePage = new DivinePage(page);
    resultPage = new ResultPage(page);
    await app.goto();
    await homePage.clickSelfDivination();
    // 等待起卦页面加载完成
    await expect(divinePage.pageTitle).toBeVisible();
  });

  test('完成起卦后应该显示结果页面', async ({ page }) => {
    // 输入有效数字并起卦
    await divinePage.fillNumbers('111', '222', '333');
    await divinePage.clickSubmit();

    // 等待导航到结果页面 - 增加等待时间
    await page.waitForTimeout(4000);

    // 验证结果页面元素 - 使用"本卦卦辞"来验证（包含括号）
    await expect(page.locator('text=【本卦卦辞】')).toBeVisible();
  });

  test('应该显示本卦卦名和符号', async ({ page }) => {
    await divinePage.fillNumbers('111', '222', '333');
    await divinePage.clickSubmit();
    await page.waitForTimeout(2000);

    // 验证卦名包含"卦"字和"本卦"标签（使用 exact 匹配）
    await expect(page.getByText('本卦', { exact: true })).toBeVisible();
  });

  test('应该显示卦辞和解读', async ({ page }) => {
    await divinePage.fillNumbers('111', '222', '333');
    await divinePage.clickSubmit();
    await page.waitForTimeout(2000);

    // 验证卦辞标签存在
    await expect(page.locator('text=【本卦卦辞】')).toBeVisible();

    // 验证解读内容存在（验证智慧启示标题和卦辞内容）
    await expect(page.locator('text=/屯/')).toBeVisible();
    await expect(page.locator('text=/智慧启示/')).toBeVisible();
  });

  test('应该显示吉凶指数', async ({ page }) => {
    await divinePage.fillNumbers('111', '222', '333');
    await divinePage.clickSubmit();
    await page.waitForTimeout(2000);

    // 验证吉凶指数显示
    await expect(page.locator('text=吉凶指数')).toBeVisible();
  });

  test('应该显示进度条', async ({ page }) => {
    await divinePage.fillNumbers('111', '222', '333');
    await divinePage.clickSubmit();
    await page.waitForTimeout(2000);

    // 验证进度条存在
    await expect(page.locator('[class*="rounded-full"]').filter({ hasClass: /bg-gradient/ }).first()).toBeVisible();
  });

  test('有动爻时应该显示变卦', async ({ page }) => {
    await divinePage.fillNumbers('111', '222', '333');
    await divinePage.clickSubmit();
    await page.waitForTimeout(2000);

    // 验证变卦部分存在
    await expect(page.locator('text=变卦')).toBeVisible();
  });

  test('应该显示大师建议', async ({ page }) => {
    await divinePage.fillNumbers('111', '222', '333');
    await divinePage.clickSubmit();
    await page.waitForTimeout(2000);

    // 点击重新生成解读按钮以获取大师建议
    await page.locator('button', { hasText: '重新生成解读' }).click();
    await page.waitForTimeout(2000);

    // 验证大师建议显示
    await expect(page.locator('text=大师建议')).toBeVisible();
  });

  test('点击再次起卦应该返回起卦页面', async ({ page }) => {
    await divinePage.fillNumbers('111', '222', '333');
    await divinePage.clickSubmit();
    await page.waitForTimeout(2000);

    // 点击再次起卦按钮
    await page.locator('button', { hasText: '再次起卦' }).click();

    // 验证返回起卦页面
    await expect(divinePage.pageTitle).toBeVisible();
  });

  test('智慧启示卡片应该正确显示', async ({ page }) => {
    await divinePage.fillNumbers('111', '222', '333');
    await divinePage.clickSubmit();
    await page.waitForTimeout(2000);

    // 验证智慧启示标题
    await expect(page.locator('text=智慧启示')).toBeVisible();

    // 验证傅氏易学标识
    await expect(page.locator('text=傅氏易学')).toBeVisible();
  });
});
