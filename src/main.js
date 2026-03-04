// 易经占卜 - 主入口
import { initBackground, initApp } from './modules/ui.js';
import { loadData } from './modules/divination.js';
import { initUser } from './modules/user.js';

// 初始化背景
initBackground();

// 初始化用户系统
initUser();

// 加载数据
loadData().then(() => {
  console.log('数据加载完成');
  initApp();
});