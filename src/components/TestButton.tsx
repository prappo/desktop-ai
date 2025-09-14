import React, { useState } from 'react';
import { Button } from './ui/button';
import { AIService } from '../services/aiService';

export function TestButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testAI = async () => {
    setIsLoading(true);
    setResult('Testing...');
    
    try {
      const aiService = AIService.getInstance();
      const response = await aiService.sendMessage('Hello, this is a test message.');
      setResult(`Response: ${response}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg m-4">
      <h3 className="text-lg font-semibold mb-2">AI Test</h3>
      <Button onClick={testAI} disabled={isLoading} className="mb-2">
        {isLoading ? 'Testing...' : 'Test AI Response'}
      </Button>
      <div className="text-sm text-muted-foreground">
        {result}
      </div>
    </div>
  );
}
