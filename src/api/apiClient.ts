console.log('Environment variables:', process.env);
console.log('API_KEY from env:', process.env.EXPO_PUBLIC_API_KEY);
console.log('API_KEY type:', typeof process.env.EXPO_PUBLIC_API_KEY);

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

if (!API_KEY) {
  console.error('API_KEY is not loaded! Check your app config or .env settings.');
}

const BASE_URL = 'https://api.venice.ai/api/v1';

export const getChatbotReply = async (
  history: { role: string; content: string }[],
  model = 'dolphin-2.9.2-qwen2-72b'
): Promise<string> => {
  const body = { model, messages: history };

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Sorry, I didn't quite get that.";
  } catch (error) {
    console.error('[getChatbotReply]', error);
    return 'Sorry, I had trouble replying. Please try again.';
  }
};
