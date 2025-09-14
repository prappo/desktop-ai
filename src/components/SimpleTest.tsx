import React, { useState } from 'react';
import { Button } from './ui/button';

export function SimpleTest() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testDirectAPI = async () => {
    setIsLoading(true);
    setResult('Testing direct OpenAI API...');
    
    try {
      const apiKey = localStorage.getItem('openai-api-key');
      if (!apiKey) {
        setResult('No API key found');
        return;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Hello, this is a test message.' }],
          max_tokens: 100,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      console.log('Direct API response:', data);
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        setResult(`Direct API Success: ${data.choices[0].message.content}`);
      } else {
        setResult(`Direct API Error: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error('Direct API error:', error);
      setResult(`Direct API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg m-4">
      <h3 className="text-lg font-semibold mb-2">Direct API Test</h3>
      <Button onClick={testDirectAPI} disabled={isLoading} className="mb-2">
        {isLoading ? 'Testing...' : 'Test Direct OpenAI API'}
      </Button>
      <div className="text-sm text-muted-foreground">
        {result}
      </div>
    </div>
  );
}
