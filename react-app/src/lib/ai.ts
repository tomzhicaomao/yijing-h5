import type { Hexagram } from '../constants/iching';
import type { DivinationType } from '../types';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

function getApiKey(): string | null {
  return import.meta.env.VITE_DEEPSEEK_API_KEY || null;
}

const TYPE_LABELS: Record<DivinationType, string> = {
  wealth: '财运',
  love: '感情',
  health: '健康',
  career: '学业',
  other: '综合运势',
};

function buildPrompt(
  hex: Hexagram,
  transHex: Hexagram | null,
  movingIdx: number[],
  question: string,
  divType: DivinationType
): string {
  const typeLabel = TYPE_LABELS[divType] || '综合运势';

  let prompt = `你是一位精通傅佩荣易经体系的易学大师。请为用户解读以下卦象。

【占卜类型】${typeLabel}
【用户问题】${question || '近期运势'}
【本卦】${hex.name}卦（${hex.pinyin}）${hex.symbol}
【卦辞】${hex.judgment}
【象曰】${hex.image}
【传统解读】${hex.meaning}
【上卦】${hex.trigrams.upper} 【下卦】${hex.trigrams.lower}`;

  if (movingIdx.length > 0) {
    prompt += `\n【动爻】第${movingIdx.map(i => i + 1).join('、')}爻`;
  }

  if (transHex) {
    prompt += `\n【变卦】${transHex.name}卦（${transHex.pinyin}）${transHex.symbol}
【变卦解读】${transHex.meaning}`;
  }

  prompt += `\n\n请按以下格式回复（每部分用【】标记）：\n
【卦象分析】对本卦和变卦进行详细分析，解释卦象与用户问题的关联。\n
【大师建议】给出具体可行的建议，帮助用户趋吉避凶。\n
【吉凶指数】给出一个 0-100 的分数，并简要说明理由。`;

  return prompt;
}

function buildFallbackText(
  hex: Hexagram,
  transHex: Hexagram | null,
  movingIdx: number[]
): { interpretation: string; advice: string; score: number } {
  const movingLinesText = movingIdx.length > 0
    ? `动爻为：第${movingIdx.map(i => i + 1).join('、')}爻。变卦为：${transHex?.name}卦。`
    : '无动爻。';

  const interpretation = `【本卦】${hex.name}卦\n\n【卦辞】${hex.judgment}\n\n【象曰】${hex.image}\n\n【解读】${hex.meaning}\n\n${movingLinesText ? `【变卦】${transHex?.name}卦 - ${transHex?.meaning}` : ''}`;

  const advice = `建议：${hex.meaning.split('。')[0] || '顺势而为，待机而动。'}`;
  const score = 50;

  return { interpretation, advice, score };
}

interface AiResult {
  interpretation: string;
  advice: string;
  score: number;
}

export async function fetchAiInterpretation(
  hex: Hexagram,
  transHex: Hexagram | null,
  movingIdx: number[],
  question: string,
  divType: DivinationType
): Promise<AiResult> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return buildFallbackText(hex, transHex, movingIdx);
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位精通易经的易学大师，擅长傅佩荣易学体系。你的回答应专业、温暖、有启发性。',
          },
          {
            role: 'user',
            content: buildPrompt(hex, transHex, movingIdx, question, divType),
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const content: string = data.choices?.[0]?.message?.content || '';

    // 解析 AI 回复
    const analysisMatch = content.match(/【卦象分析】([\s\S]*?)(?=【大师建议】|$)/);
    const adviceMatch = content.match(/【大师建议】([\s\S]*?)(?=【吉凶指数】|$)/);
    const scoreMatch = content.match(/【吉凶指数】([\s\S]*?)$/);

    const interpretation = analysisMatch?.[1]?.trim() || content;
    const advice = adviceMatch?.[1]?.trim() || '';
    const scoreText = scoreMatch?.[1]?.trim() || '';
    const score = parseInt(scoreText, 10) || 50;

    return { interpretation, advice, score };
  } catch (error) {
    console.error('AI 解读失败，使用本地解读:', error);
    return buildFallbackText(hex, transHex, movingIdx);
  }
}
