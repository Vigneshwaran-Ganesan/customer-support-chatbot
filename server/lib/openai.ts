import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
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
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: question }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    const result = JSON.parse(content);
    return result;
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    let errorMessage = 'Failed to generate answer';

    if (error.status === 429) {
      errorMessage = 'API rate limit exceeded. Please try again later.';
    }

    throw new Error(errorMessage);
  }
}