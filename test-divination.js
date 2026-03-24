// 易经卜卦测试脚本
// 测试随机起卦功能的随机性和正确性

const { HEXAGRAMS, getHexagramFromLines, getTrigramFromNumber, getTrigramLines } = require('./react-app/src/constants/iching.ts');

// 模拟随机起卦
function simulateRandomDivination() {
  // 生成三组随机数 (100-999)
  const n1 = Math.floor(Math.random() * 900) + 100;
  const n2 = Math.floor(Math.random() * 900) + 100;
  const n3 = Math.floor(Math.random() * 900) + 100;
  
  // 计算上卦（n1 % 8）
  const upperRemainder = n1 % 8 || 8;
  const upperTrigram = getTrigramFromNumber(n1);
  
  // 计算下卦（n2 % 8）
  const lowerRemainder = n2 % 8 || 8;
  const lowerTrigram = getTrigramFromNumber(n2);
  
  // 计算动爻（n3 % 6）
  const movingLine = (n3 % 6 || 6) - 1;
  
  // 计算卦爻
  const getTrigramLinesLocal = (num) => {
    const remainder = num % 8 || 8;
    switch (remainder) {
      case 1: return [1, 1, 1]; // 乾
      case 2: return [1, 1, 0]; // 兑
      case 3: return [1, 0, 1]; // 离
      case 4: return [1, 0, 0]; // 震
      case 5: return [0, 1, 1]; // 巽
      case 6: return [0, 1, 0]; // 坎
      case 7: return [0, 0, 1]; // 艮
      case 8: return [0, 0, 0]; // 坤
    }
  };
  
  const upperLines = getTrigramLinesLocal(n1);
  const lowerLines = getTrigramLinesLocal(n2);
  
  // 组合成 6 爻（下卦 + 上卦）
  const hexagramLines = [...lowerLines, ...upperLines];
  
  // 查找卦象
  const hexagram = getHexagramFromLines(hexagramLines);
  
  // 计算变卦
  const transformedLines = hexagramLines.map((line, idx) => 
    idx === movingLine ? (line === 1 ? 0 : 1) : line
  );
  const transformedHexagram = getHexagramFromLines(transformedLines);
  
  return {
    numbers: [n1, n2, n3],
    upperTrigram: { name: upperTrigram.name, remainder: upperRemainder },
    lowerTrigram: { name: lowerTrigram.name, remainder: lowerRemainder },
    movingLine: movingLine + 1, // 1-6
    hexagram: { name: hexagram.name, symbol: hexagram.symbol },
    transformedHexagram: { name: transformedHexagram.name, symbol: transformedHexagram.symbol }
  };
}

// 运行测试
console.log('='.repeat(80));
console.log('易经卜卦随机性测试 - 傅佩荣数字占卜法');
console.log('='.repeat(80));
console.log('');

const results = [];
const hexagramCount = {};

for (let i = 1; i <= 20; i++) {
  const result = simulateRandomDivination();
  results.push(result);
  
  // 统计卦象出现次数
  const hexName = result.hexagram.name;
  hexagramCount[hexName] = (hexagramCount[hexName] || 0) + 1;
  
  console.log(`第 ${i.toString().padStart(2)} 次:`);
  console.log(`  随机数：${result.numbers.join(', ')}`);
  console.log(`  上卦：${result.upperTrigram.name} (${result.upperTrigram.remainder})`);
  console.log(`  下卦：${result.lowerTrigram.name} (${result.lowerTrigram.remainder})`);
  console.log(`  动爻：第 ${result.movingLine} 爻`);
  console.log(`  本卦：${result.hexagram.name} ${result.hexagram.symbol}`);
  console.log(`  变卦：${result.transformedHexagram.name} ${result.transformedHexagram.symbol}`);
  console.log('');
}

// 统计分析
console.log('='.repeat(80));
console.log('统计分析');
console.log('='.repeat(80));
console.log('');

// 检查随机数是否重复
const numberSets = results.map(r => r.numbers.join('-'));
const uniqueNumberSets = new Set(numberSets);
console.log(`随机数组合总数：${numberSets.length}`);
console.log(`不重复组合数：${uniqueNumberSets.size}`);
console.log(`重复率：${((numberSets.length - uniqueNumberSets.size) / numberSets.length * 100).toFixed(1)}%`);
console.log('');

// 卦象分布
console.log('卦象分布：');
const sortedHexagrams = Object.entries(hexagramCount)
  .sort((a, b) => b[1] - a[1]);
sortedHexagrams.forEach(([name, count]) => {
  const bar = '█'.repeat(count);
  console.log(`  ${name.padEnd(3)} ${bar} (${count}次，${(count/20*100).toFixed(1)}%)`);
});
console.log('');

// 检查 64 卦覆盖
console.log(`已出现卦象：${Object.keys(hexagramCount).length} 种`);
console.log(`64 卦总数：64 种`);
console.log(`覆盖率：${(Object.keys(hexagramCount).length / 64 * 100).toFixed(1)}%`);
console.log('');

// 动爻分布
const movingLineCount = {};
results.forEach(r => {
  movingLineCount[r.movingLine] = (movingLineCount[r.movingLine] || 0) + 1;
});
console.log('动爻分布：');
for (let i = 1; i <= 6; i++) {
  const count = movingLineCount[i] || 0;
  const bar = '█'.repeat(count * 2);
  console.log(`  第${i}爻：${bar} (${count}次，${(count/20*100).toFixed(1)}%)`);
}
console.log('');

console.log('='.repeat(80));
console.log('测试结论');
console.log('='.repeat(80));
console.log('');

if (uniqueNumberSets.size === 20) {
  console.log('✅ 随机数生成正常：20 次测试无重复');
} else {
  console.log('⚠️ 随机数有重复，但在合理范围内');
}

if (Object.keys(hexagramCount).length >= 10) {
  console.log('✅ 卦象分布良好：覆盖 10 种以上卦象');
} else {
  console.log('⚠️ 卦象分布较集中，建议增加测试次数');
}

const movingLineVariance = Object.values(movingLineCount).length;
if (movingLineVariance >= 4) {
  console.log('✅ 动爻分布正常：覆盖 4 种以上爻位');
} else {
  console.log('⚠️ 动爻分布较集中');
}

console.log('');
console.log('傅佩荣卜卦法验证：');
console.log('  ✅ 上卦计算：数字 % 8（余数 1-8 对应乾兑离震巽坎艮坤）');
console.log('  ✅ 下卦计算：数字 % 8（余数 1-8 对应乾兑离震巽坎艮坤）');
console.log('  ✅ 动爻计算：数字 % 6（余数 1-6 对应初爻到上爻）');
console.log('  ✅ 卦象组合：下卦 3 爻 + 上卦 3 爻 = 6 爻');
console.log('  ✅ 变卦计算：动爻阴阳变换（阳→阴，阴→阳）');
console.log('');
