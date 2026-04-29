import { type Page, type Locator, expect } from '@playwright/test';

export class YiJingApp {
  readonly page: Page;
  readonly taijiLogo: Locator;
  readonly appTitle: Locator;
  readonly navButtons: Locator;
  readonly homeNav: Locator;
  readonly divineNav: Locator;
  readonly historyNav: Locator;
  readonly profileNav: Locator;

  constructor(page: Page) {
    this.page = page;
    this.taijiLogo = page.locator('svg circle[cx="50"][cy="50"]').first();
    this.appTitle = page.locator('h1', { hasText: '傅氏易经' });
    this.navButtons = page.locator('.bottom-nav .nav-item');
    this.homeNav = page.locator('.bottom-nav .nav-item', { hasText: '首页' });
    this.divineNav = page.locator('.bottom-nav .nav-item', { hasText: '起卦' });
    this.historyNav = page.locator('.bottom-nav .nav-item', { hasText: '记录' });
    this.profileNav = page.locator('.bottom-nav .nav-item', { hasText: '我的' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async navigateTo(view: 'home' | 'divine' | 'history' | 'profile') {
    switch (view) {
      case 'home':
        await this.homeNav.click();
        break;
      case 'divine':
        await this.divineNav.click();
        break;
      case 'history':
        await this.historyNav.click();
        break;
      case 'profile':
        await this.profileNav.click();
        break;
    }
    await this.page.waitForLoadState('networkidle');
  }

  async isVisible(): Promise<boolean> {
    return this.appTitle.isVisible();
  }
}

export class HomePage {
  readonly page: Page;
  readonly welcomeTitle: Locator;
  readonly selfDivinationBtn: Locator;
  readonly dailyDivinationBtn: Locator;
  readonly featureCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeTitle = page.locator('h2', { hasText: '易经占卜' });
    this.selfDivinationBtn = page.locator('button', { hasText: '自主起卦' });
    this.dailyDivinationBtn = page.locator('button', { hasText: '每日一占' });
    this.featureCards = page.locator('.glass-card').filter({ hasText: '先天易学' });
  }

  async clickSelfDivination() {
    await this.selfDivinationBtn.click();
  }

  async clickDailyDivination() {
    await this.dailyDivinationBtn.click();
  }
}

export class DivinePage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly questionInput: Locator;
  readonly numberInputs: Locator;
  readonly upperGuaInput: Locator;
  readonly lowerGuaInput: Locator;
  readonly movingLineInput: Locator;
  readonly randomBtn: Locator;
  readonly submitBtn: Locator;
  readonly resetBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('h2', { hasText: '数字占卜' });
    this.questionInput = page.locator('input[placeholder*="问题"]');
    this.numberInputs = page.locator('input[type="number"]');
    this.upperGuaInput = page.locator('input[type="number"]').first();
    this.lowerGuaInput = page.locator('input[type="number"]').nth(1);
    this.movingLineInput = page.locator('input[type="number"]').nth(2);
    this.randomBtn = page.locator('button', { hasText: '随机起卦' });
    this.submitBtn = page.locator('button', { hasText: '起卦占卜' });
    this.resetBtn = page.locator('button', { hasText: '再次起卦' });
  }

  async fillNumbers(n1: string, n2: string, n3: string) {
    await this.upperGuaInput.fill(n1);
    await this.lowerGuaInput.fill(n2);
    await this.movingLineInput.fill(n3);
  }

  async fillQuestion(question: string) {
    await this.questionInput.fill(question);
  }

  async clickRandom() {
    await this.randomBtn.click();
  }

  async clickSubmit() {
    await this.submitBtn.click();
  }

  async getNumberInputValues(): Promise<string[]> {
    const values = [];
    for (let i = 0; i < 3; i++) {
      const input = this.numberInputs.nth(i);
      values.push(await input.inputValue());
    }
    return values;
  }
}

export class ResultPage {
  readonly page: Page;
  readonly hexagramSymbol: Locator;
  readonly hexagramName: Locator;
  readonly judgmentText: Locator;
  readonly transformedHexagram: Locator;
  readonly luckScore: Locator;
  readonly luckScoreBar: Locator;
  readonly interpretationText: Locator;
  readonly adviceText: Locator;
  readonly regenerateBtn: Locator;
  readonly newDivinationBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.hexagramSymbol = page.locator('.text-7xl').first();
    this.hexagramName = page.locator('h2', { hasText: '卦' }).first();
    this.judgmentText = page.locator('[class*="border-l-4"]').locator('p').last();
    this.transformedHexagram = page.locator('text=变卦').locator('xpath=../..');
    this.luckScore = page.locator('[class*="吉凶指数"]').locator('xpath=../..').locator('span').last();
    this.luckScoreBar = page.locator('[class*="rounded-full"]').filter({ hasClass: /bg-gradient/ }).first();
    this.interpretationText = page.locator('p', { hasText: /【本卦】/ }).first();
    this.adviceText = page.locator('text=大师建议').locator('xpath=../..').locator('p');
    this.regenerateBtn = page.locator('button', { hasText: '重新生成解读' });
    this.newDivinationBtn = page.locator('button', { hasText: '再次起卦' });
  }

  async getHexagramName(): Promise<string> {
    return this.hexagramName.textContent() || '';
  }

  async getLuckScore(): Promise<number> {
    const text = await this.luckScore.textContent();
    return parseInt(text || '0', 10);
  }

  async clickNewDivination() {
    await this.newDivinationBtn.click();
  }
}

export class HistoryPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly historyRecords: Locator;
  readonly emptyState: Locator;
  readonly recordCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('h2', { hasText: '占卜记录' });
    this.historyRecords = page.locator('[class*="rounded-\\[32px\\]"]').filter({ has: page.locator('.text-4xl') });
    this.emptyState = page.locator('text=暂无记录');
    this.recordCount = page.locator('text=/\\d+ 条记录/');
  }

  async getRecordCount(): Promise<number> {
    const text = await this.recordCount.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async clickRecord(index: number) {
    await this.historyRecords.nth(index).click();
  }

  async deleteRecord(index: number) {
    const deleteBtn = this.historyRecords.nth(index).locator('button[aria-label="删除记录"]');
    await deleteBtn.click();
  }

  async isEmpty(): Promise<boolean> {
    return this.emptyState.isVisible();
  }
}
