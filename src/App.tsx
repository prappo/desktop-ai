import React, { useState } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { Header } from './components/Header';
import { AIService } from './services/aiService';
import './index.css';

function App() {
  const aiService = AIService.getInstance();

  const handleClearChat = () => {
    aiService.clearHistory();
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header onClearChat={handleClearChat} />
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}

export default App;
