import React, { useState } from 'react';
import { Bot, Settings, Trash2, Sparkles } from 'lucide-react';
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
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                Desktop AI Chat
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </h1>
              <p className="text-sm text-muted-foreground">
                Powered by OpenAI GPT-3.5 Turbo
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClearChat}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsConfigOpen(true)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
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
