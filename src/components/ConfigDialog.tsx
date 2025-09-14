import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export function ConfigDialog({ isOpen, onClose, apiKey, onApiKeyChange }: ConfigDialogProps) {
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  const handleSave = () => {
    onApiKeyChange(tempApiKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Get your API key from{' '}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                platform.openai.com
              </a>
            </p>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
