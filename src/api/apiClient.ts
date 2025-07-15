import { CharacterStats } from '../types';
import clone from 'clone';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const BASE_URL = 'https://api.groq.com/openai/v1';

export const getChatbotReply = async (
  history: { role: string; content: string }[],
  stats: CharacterStats,
  model = 'llama3-8b-8192'
): Promise<string> => {
  // Fail fast if the API key is not configured.
  if (!API_KEY) {
    const errorMessage = 'Groq API key is not configured. Please check your .env file and ensure EXPO_PUBLIC_API_KEY is set.';
    console.error(errorMessage);
    return 'Sorry, the service is not configured correctly. Please try again later.';
  }

  // Use a more robust method for deep cloning the history array
  const enrichedHistory = clone(history);

  // Find the system prompt and enrich it with the current relationship status
  const systemPromptIndex = enrichedHistory.findIndex((h) => h.role === 'system');
  if (systemPromptIndex !== -1) {
    const stateSummary = `\n\n[Current Relationship Status: Affection: ${stats.affection}, Trust: ${stats.trust}, Respect: ${stats.respect ?? 50}, Friendship: ${stats.friendship ?? 50}. Your mood is currently ${stats.mood}. Keep this state in mind when replying.]`;
    enrichedHistory[systemPromptIndex].content += stateSummary;
  }

  const body = {
    model,
    messages: enrichedHistory,
    temperature: 0.8, // Add temperature for more creative responses
  };

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // This will give us the exact error from the API provider
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "Sorry, I didn't quite get that.";
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error in getChatbotReply:', errorMessage);
    console.error('Failing request details:', { model, historyLength: history.length });
    return 'Sorry, I had trouble processing your request. Please try again.';
  }
};
