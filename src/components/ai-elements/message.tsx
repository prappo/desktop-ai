import React from 'react';
import { Bot, User } from 'lucide-react';
import { Card } from '../ui/card';

export interface MessageProps {
  from: 'user' | 'assistant';
  children: React.ReactNode;
  className?: string;
}

export function Message({ from, children, className = '' }: MessageProps) {
  return (
    <div className={`flex ${from === 'user' ? 'justify-end' : 'justify-start'} group ${className}`}>
      <div className={`flex items-start space-x-3 max-w-[85%] ${
        from === 'user' ? 'flex-row-reverse space-x-reverse' : ''
      }`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          from === 'user' 
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
            : 'bg-gradient-to-br from-green-500 to-blue-600 text-white'
        }`}>
          {from === 'user' ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>
        <Card className={`p-4 shadow-sm ${
          from === 'user' 
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0' 
            : 'bg-card border-border/50'
        }`}>
          {children}
        </Card>
      </div>
    </div>
  );
}

export function MessageContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      {children}
    </div>
  );
}
