import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

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

export class AIService {
  private static instance: AIService;
  private messages: ChatMessage[] = [];

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

  public async sendMessage(userMessage: string): Promise<string> {
    try {
      const apiKey = getApiKey();
      
      if (!apiKey) {
        return 'Please configure your OpenAI API key in the settings to use the AI chat feature.';
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

      // Generate AI response using the AI SDK with messages array
      console.log('Attempting generateText...');
      const result = await generateText({
        model: model,
        messages: this.messages,
        maxTokens: 1000,
        temperature: 0.7,
      });
      
      console.log('generateText result:', result);
      console.log('Result keys:', Object.keys(result));
      console.log('Result.text:', result.text);
      
      const text = result.text;
      console.log('AI Response received:', text);
      console.log('Response length:', text?.length || 0);

      // Check if we got a valid response
      if (!text || text.trim() === '') {
        console.error('Empty response received from AI');
        return 'I apologize, but I received an empty response. Please try again.';
      }

      // Add assistant response to conversation history
      this.messages.push({
        role: 'assistant',
        content: text
      });

      return text;
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
      
      return errorMessage;
    }
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

      const result = await generateText({
        model: model,
        messages: [{ role: 'user', content: 'Hello' }],
        maxTokens: 10,
      });
      
      const text = result.text;

      console.log('Test connection successful:', text);
      return true;
    } catch (error) {
      console.error('Test connection failed:', error);
      return false;
    }
  }
}
