import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Get API key from localStorage or use a default
const getApiKey = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('openai-api-key') || '';
  }
  return '';
};

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cachedInputTokens?: number;
  reasoningTokens?: number;
}

export class AIService {
  private static instance: AIService;
  private messages: ChatMessage[] = [];
  private totalTokenUsage: TokenUsage = {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    cachedInputTokens: 0,
    reasoningTokens: 0,
  };

  private constructor() {
    // Initialize with a system message
    this.messages.push({
      role: 'system',
      content: 'You are a helpful AI assistant. Provide clear, concise, and helpful responses to user questions.'
    });
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public async sendMessage(userMessage: string, onChunk?: (chunk: string) => void): Promise<{ text: string; usage: TokenUsage }> {
    try {
      const apiKey = getApiKey();
      
      if (!apiKey) {
        return {
          text: 'Please configure your OpenAI API key in the settings to use the AI chat feature.',
          usage: this.totalTokenUsage
        };
      }

      // Add user message to conversation history
      this.messages.push({
        role: 'user',
        content: userMessage
      });

      // Create OpenAI client with API key
      const openai = createOpenAI({
        apiKey: apiKey,
      });

      const model = openai('gpt-3.5-turbo');

      console.log('Messages being sent:', this.messages);
      console.log('API Key length:', apiKey.length);
      console.log('Model created:', model);

      // Generate AI response using streaming
      console.log('Attempting streamText...');
      const result = await streamText({
        model: model,
        messages: this.messages,
        temperature: 0.7,
      });
      
      console.log('streamText result:', result);
      
      let fullText = '';
      
      // Process the stream
      for await (const chunk of result.textStream) {
        console.log('Received chunk:', chunk);
        fullText += chunk;
        
        // Call the onChunk callback if provided
        if (onChunk) {
          onChunk(chunk);
        }
      }
      
      console.log('AI Response received:', fullText);
      console.log('Response length:', fullText?.length || 0);

      // Check if we got a valid response
      if (!fullText || fullText.trim() === '') {
        console.error('Empty response received from AI');
        return {
          text: 'I apologize, but I received an empty response. Please try again.',
          usage: this.totalTokenUsage
        };
      }

      // Get token usage from the result
      const usage = await result.usage;
      if (usage) {
        this.totalTokenUsage.inputTokens += usage.inputTokens || 0;
        this.totalTokenUsage.outputTokens += usage.outputTokens || 0;
        this.totalTokenUsage.totalTokens += usage.totalTokens || 0;
        this.totalTokenUsage.cachedInputTokens += (usage as any).cachedInputTokens || 0;
        this.totalTokenUsage.reasoningTokens += (usage as any).reasoningTokens || 0;
      }

      // Add assistant response to conversation history
      this.messages.push({
        role: 'assistant',
        content: fullText
      });

      return {
        text: fullText,
        usage: this.totalTokenUsage
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Provide more specific error information
      let errorMessage = 'I apologize, but I encountered an error while processing your request.';
      
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
          errorMessage = 'Invalid API key. Please check your OpenAI API key in the settings.';
        } else if (error.message.includes('429')) {
          errorMessage = 'Rate limit exceeded. Please try again in a moment.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      return {
        text: errorMessage,
        usage: this.totalTokenUsage
      };
    }
  }

  public getTokenUsage(): TokenUsage {
    return { ...this.totalTokenUsage };
  }

  public clearHistory(): void {
    this.messages = [{
      role: 'system',
      content: 'You are a helpful AI assistant. Provide clear, concise, and helpful responses to user questions.'
    }];
  }

  public getHistory(): ChatMessage[] {
    return [...this.messages];
  }

  public async testConnection(): Promise<boolean> {
    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        return false;
      }

      // Test with a simple request
      const openai = createOpenAI({
        apiKey: apiKey,
      });

      const model = openai('gpt-3.5-turbo');

      const result = await streamText({
        model: model,
        messages: [{ role: 'user', content: 'Hello' }],
      });
      
      let text = '';
      for await (const chunk of result.textStream) {
        text += chunk;
      }

      console.log('Test connection successful:', text);
      return true;
    } catch (error) {
      console.error('Test connection failed:', error);
      return false;
    }
  }
}
