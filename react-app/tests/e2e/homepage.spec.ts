import { test, expect } from '@playwright/test';
import { YiJingApp, HomePage } from './pages/yijing';

test.describe('易经占卜 - 首页功能', () => {
  let app: YiJingApp;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    app = new YiJingApp(page);
    homePage = new HomePage(page);
    await app.goto();
  });

  test('首页应该正确加载并显示标题', async ({ page }) => {
    // 验证应用标题
    await expect(app.appTitle).toBeVisible();
    await expect(app.appTitle).toContainText('傅氏易经');

    // 验证太极 logo 存在
    await expect(app.taijiLogo).toBeVisible();

    // 验证欢迎标题
    await expect(homePage.welcomeTitle).toBeVisible();
    await expect(homePage.welcomeTitle).toContainText('易经占卜');
  });

  test('底部导航栏应该显示所有导航项', async ({ page }) => {
    // 验证所有导航按钮存在
    await expect(app.homeNav).toBeVisible();
    await expect(app.divineNav).toBeVisible();
    await expect(app.historyNav).toBeVisible();
    await expect(app.profileNav).toBeVisible();

    // 验证首页导航处于激活状态
    await expect(app.homeNav).toHaveClass(/active/);
  });

  test('点击自主起卦按钮应该跳转到起卦页面', async ({ page }) => {
    await homePage.clickSelfDivination();

    // 验证跳转到起卦页面
    await expect(page.locator('h2', { hasText: '数字占卜' })).toBeVisible();
    await expect(app.divineNav).toHaveClass(/active/);
  });

  test('点击每日一占按钮应该跳转到起卦页面', async ({ page }) => {
    await homePage.clickDailyDivination();

    // 验证跳转到起卦页面
    await expect(page.locator('h2', { hasText: '数字占卜' })).toBeVisible();
    await expect(app.divineNav).toHaveClass(/active/);
  });

  test('底部导航栏可以切换页面', async ({ page }) => {
    // 导航到起卦页面
    await app.navigateTo('divine');
    await expect(page.locator('h2', { hasText: '数字占卜' })).toBeVisible();
    await expect(app.divineNav).toHaveClass(/active/);

    // 导航到历史记录页面
    await app.navigateTo('history');
    await expect(app.historyNav).toHaveClass(/active/);

    // 导航到我的页面
    await app.navigateTo('profile');
    await expect(app.profileNav).toHaveClass(/active/);

    // 返回首页
    await app.navigateTo('home');
    await expect(homePage.welcomeTitle).toBeVisible();
    await expect(app.homeNav).toHaveClass(/active/);
  });

  test('功能卡片应该正确显示', async ({ page }) => {
    // 验证功能卡片存在
    await expect(page.locator('text=先天易学')).toBeVisible();
    await expect(page.locator('text=AI 解读')).toBeVisible();
    await expect(page.locator('text=云端同步')).toBeVisible();
  });
});
