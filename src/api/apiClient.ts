const BASE_URL = 'https://api.venice.ai/api/v1';
const API_KEY = 'Bearer HGXiK6Pvez5EY3lRR91HLdkjkeEEHUojp4Q0EA9vUT';

export const getChatbotReply = async (
  history: { role: string; content: string }[],
  model = 'dolphin-2.9.2-qwen2-72b'
): Promise<string> => {
  const body = { model, messages: history };

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error('AI request failed');
    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Sorry, I didn’t quite get that.';
  } catch (error) {
    console.error('[getChatbotReply]', error);
    return 'Sorry, I had trouble replying. Please try again.';
  }
};
