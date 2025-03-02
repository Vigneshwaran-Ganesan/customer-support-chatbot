import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || 'default-key'
});

const SYSTEM_PROMPT = `You are a helpful CDP support assistant that helps users with questions about Segment, mParticle, Lytics, and Zeotap. 
Answer questions accurately and concisely. If a question is not related to these CDPs, politely explain that you can only help with CDP-related questions.
Always structure your response as a JSON object with the following format:
{
  "answer": "Your detailed answer here",
  "metadata": {
    "platform": "segment|mparticle|lytics|zeotap|multiple|none",
    "confidence": 0.0-1.0,
    "category": "how-to|comparison|general|irrelevant"
  }
}`;

export async function generateAnswer(question: string): Promise<{
  answer: string;
  metadata: {
    platform: string;
    confidence: number;
    category: string;
  };
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: question }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate answer');
  }
}
