import React, { useState } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { Header } from './components/Header';
import { AIService } from './services/aiService';
import './index.css';

function App() {
  const aiService = AIService.getInstance();
  const [clearTrigger, setClearTrigger] = useState<number>(0);

  const handleClearChat = () => {
    aiService.clearHistory();
    setClearTrigger(prev => prev + 1); // Trigger re-render of ChatInterface
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header onClearChat={handleClearChat} />
      <main className="flex-1 overflow-hidden">
        <ChatInterface clearTrigger={clearTrigger} />
      </main>
    </div>
  );
}

export default App;
