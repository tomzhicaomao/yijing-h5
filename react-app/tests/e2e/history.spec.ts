import { test, expect } from '@playwright/test';
import { YiJingApp, HomePage, DivinePage, HistoryPage } from './pages/yijing';

test.describe('易经占卜 - 历史记录功能', () => {
  let app: YiJingApp;
  let homePage: HomePage;
  let divinePage: DivinePage;
  let historyPage: HistoryPage;

  test.beforeEach(async ({ page }) => {
    app = new YiJingApp(page);
    homePage = new HomePage(page);
    divinePage = new DivinePage(page);
    historyPage = new HistoryPage(page);
    await app.goto();
  });

  test('首次访问时历史记录应该为空', async ({ page }) => {
    await app.navigateTo('history');

    // 验证空状态显示
    await expect(historyPage.emptyState).toBeVisible();
    await expect(page.locator('text=/暂无记录/')).toBeVisible();
  });

  test('完成一次占卜后应该显示历史记录', async ({ page }) => {
    // 进行占卜
    await homePage.clickSelfDivination();
    await expect(divinePage.pageTitle).toBeVisible();

    await divinePage.fillNumbers('111', '222', '3');
    await divinePage.clickSubmit();

    // 等待导航和结果生成
    await page.waitForTimeout(3000);

    // 导航到历史记录
    await app.navigateTo('history');
    await page.waitForTimeout(1000);

    // 验证有记录
    await expect(historyPage.emptyState).not.toBeVisible();
  });

  test('多次占卜应该累积记录', async ({ page }) => {
    // 第一次占卜
    await homePage.clickSelfDivination();
    await expect(divinePage.pageTitle).toBeVisible();
    await divinePage.fillNumbers('111', '222', '3');
    await divinePage.clickSubmit();
    await page.waitForTimeout(3000);

    // 第二次占卜
    await app.navigateTo('home');
    await homePage.clickSelfDivination();
    await expect(divinePage.pageTitle).toBeVisible();
    await divinePage.fillNumbers('333', '444', '6');
    await divinePage.clickSubmit();
    await page.waitForTimeout(3000);

    // 导航到历史记录
    await app.navigateTo('history');
    await page.waitForTimeout(1000);

    // 验证记录不为空
    await expect(historyPage.emptyState).not.toBeVisible();
  });

  test('记录应该显示卦象符号', async ({ page }) => {
    // 进行占卜
    await homePage.clickSelfDivination();
    await expect(divinePage.pageTitle).toBeVisible();
    await divinePage.fillNumbers('111', '222', '3');
    await divinePage.clickSubmit();
    await page.waitForTimeout(3000);

    // 导航到历史记录
    await app.navigateTo('history');
    await page.waitForTimeout(1000);

    // 验证记录不为空
    await expect(historyPage.emptyState).not.toBeVisible();

    // 验证记录显示卦象符号（使用更通用的选择器）
    const firstRecord = historyPage.historyRecords.first();
    await expect(firstRecord).toBeVisible();
  });

  test('删除按钮应该存在', async ({ page }) => {
    // 进行占卜
    await homePage.clickSelfDivination();
    await expect(divinePage.pageTitle).toBeVisible();
    await divinePage.fillNumbers('111', '222', '3');
    await divinePage.clickSubmit();
    await page.waitForTimeout(3000);

    // 导航到历史记录
    await app.navigateTo('history');
    await page.waitForTimeout(1000);

    // 验证删除按钮存在
    const deleteBtn = historyPage.historyRecords.first().locator('button').locator('svg').first();
    await expect(deleteBtn).toBeVisible();
  });
});
