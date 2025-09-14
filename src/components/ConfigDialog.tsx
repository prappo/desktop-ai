import React, { useState } from 'react';
import { Settings, X, Key, ExternalLink, CheckCircle } from 'lucide-react';
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
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onApiKeyChange(tempApiKey);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg p-8 shadow-2xl border-border/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Settings
              </h2>
              <p className="text-sm text-muted-foreground">
                Configure your OpenAI API key
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Key className="h-4 w-4" />
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-3 border border-border/50 rounded-lg bg-background text-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 pr-10"
              />
              {tempApiKey && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                To get your API key:
              </p>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Visit the OpenAI Platform</li>
                <li>Sign in to your account</li>
                <li>Go to API Keys section</li>
                <li>Create a new secret key</li>
              </ol>
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Open OpenAI Platform
              </a>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="px-6">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!tempApiKey.trim()}
              className="px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
            >
              {isSaved ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : (
                'Save API Key'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
