import React, { useState } from 'react';
import { MessageCircle, Settings, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { ConfigDialog } from './ConfigDialog';

interface HeaderProps {
  onClearChat?: () => void;
}

export function Header({ onClearChat }: HeaderProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('openai-api-key') || '';
    }
    return '';
  });

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
    if (typeof window !== 'undefined') {
      localStorage.setItem('openai-api-key', newApiKey);
    }
  };

  return (
    <>
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Desktop AI Chat</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClearChat}
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsConfigOpen(true)}
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      
      <ConfigDialog
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
      />
    </>
  );
}
