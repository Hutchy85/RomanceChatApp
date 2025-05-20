import Config from 'react-native-config';

const BASE_URL = 'https://api.venice.ai/api/v1';
const API_KEY: string = Config.API_KEY ?? '';

export const getChatbotReply = async (
  history: { role: string; content: string }[],
  model = 'llama-3.2-3b'
): Promise<string> => {
  const body = { model, messages: history };

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json',
      } as HeadersInit,
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
