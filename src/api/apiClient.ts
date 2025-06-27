console.log('Environment variables:', process.env);
console.log('API_KEY from env:', process.env.EXPO_PUBLIC_API_KEY);
console.log('API_KEY type:', typeof process.env.EXPO_PUBLIC_API_KEY);
import { CharacterStats } from '../types';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

if (!API_KEY) {
  console.error('API_KEY is not loaded! Check your app config or .env settings.');
}

const BASE_URL = 'https://api.venice.ai/api/v1';

export const getChatbotReply = async (
  history: { role: string; content: string }[],
  stats: CharacterStats,
  model = 'dolphin-2.9.2-qwen2-72b'
): Promise<string> => {
  // Deep copy history to avoid mutating the original ref
  const enrichedHistory = JSON.parse(JSON.stringify(history));

  // Find the system prompt and enrich it with the current relationship status
  const systemPromptIndex = enrichedHistory.findIndex((h: { role: string; }) => h.role === 'system');
  if (systemPromptIndex !== -1) {
    const stateSummary = `\n\n[Current Relationship Status: Affection: ${stats.affection}, Trust: ${stats.trust}, Respect: ${stats.respect ?? 50}, Friendship: ${stats.friendship ?? 50}. Your mood is currently ${stats.mood}. Keep this state in mind when replying.]`;
    enrichedHistory[systemPromptIndex].content += stateSummary;
  }


  const body = { model, messages: enrichedHistory };

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
