import OpenAI from "openai";
import { documentStore } from "./documentStore";

console.log("ENV API KEY:", process.env.OPENAI_API_KEY ? "Found" : "Not found");

// Process environment variables more reliably
try {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OpenAI API key not found. Please add your OPENAI_API_KEY to the .env file.\n" +
      "1. Copy .env.example to .env\n" +
      "2. Add your API key to the .env file\n" +
      "3. Restart the application"
    );
  }
  
  // Check if it's a placeholder value
  if (process.env.OPENAI_API_KEY === "your_openai_api_key_here" || 
      process.env.OPENAI_API_KEY.includes("XXX")) {
    throw new Error(
      "You are using a placeholder API key. Please replace it with your actual OpenAI API key in the .env file."
    );
  }
} catch (error) {
  console.error("API KEY ERROR:", error.message);
  throw error;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `You are a helpful CDP support assistant that helps users with questions about Segment, mParticle, Lytics, and Zeotap. 
Answer questions accurately and concisely. If a question is not related to these CDPs, politely explain that you can only help with CDP-related questions.
For comparison questions, highlight key differences and similarities.
Always structure your response as a JSON object with the following format:
{
  "answer": "Your detailed answer here",
  "metadata": {
    "platform": "segment|mparticle|lytics|zeotap|multiple|none",
    "confidence": 0.0-1.0,
    "category": "how-to|comparison|general|irrelevant"
  }
}`;

// Fallback response when API is rate limited
const getFallbackResponse = (question: string) => {
  // Check if it's a comparison question
  const comparisonKeywords = ['compare', 'difference', 'versus', 'vs', 'better'];
  const isComparison = comparisonKeywords.some(keyword => 
    question.toLowerCase().includes(keyword)
  );

  if (isComparison) {
    // Extract feature to compare
    const features = ['source', 'user', 'audience', 'tracking'];
    const feature = features.find(f => question.toLowerCase().includes(f)) || 'source';
    const comparison = documentStore.compareCDPs(feature);

    return {
      answer: comparison.content,
      metadata: {
        platform: 'multiple',
        confidence: comparison.confidence,
        category: 'comparison'
      }
    };
  }

  // Regular documentation fallback
  const relevantDocs = documentStore.findRelevantContent(question);

  return {
    answer: `Based on our documentation:\n\n${relevantDocs.content}\n\nFor more details, check the official documentation:\n` +
      "- Segment: https://segment.com/docs/\n" +
      "- mParticle: https://docs.mparticle.com/\n" +
      "- Lytics: https://docs.lytics.com/\n" +
      "- Zeotap: https://docs.zeotap.com/",
    metadata: {
      platform: relevantDocs.platform,
      confidence: relevantDocs.confidence,
      category: "how-to"
    }
  };
};

// Exponential backoff retry logic
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  retries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError;
  let delay = initialDelay;

  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      if (error.status !== 429) throw error; // Only retry on rate limit errors
      await wait(delay);
      delay *= 2; // Exponential backoff
    }
  }
  throw lastError;
}

export async function generateAnswer(question: string): Promise<{
  answer: string;
  metadata: {
    platform?: string;
    confidence: number;
    category: string;
  };
}> {
  try {
    const operation = async () => {
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

      return JSON.parse(content);
    };

    // Attempt operation with retries
    return await retryWithBackoff(operation);
  } catch (error: any) {
    console.error('OpenAI API error:', error);

    // Use fallback for any API errors when running locally
    if (error.status === 429 || error.code === 'ENOTFOUND' || error.message.includes('API key')) {
      console.log('API issue, using fallback response');
      return getFallbackResponse(question);
    }

    // Provide a more detailed error response
    return {
      answer: "I'm having trouble connecting to my knowledge base. Please check your API key configuration or try again later.",
      metadata: {
        platform: "none",
        confidence: 0.1,
        category: "error" 
      }
    };
  }
}