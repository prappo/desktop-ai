import React, { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { AIService } from '../services/aiService';
import { TooltipProvider } from './ui/tooltip';
import { 
  PromptInput, 
  PromptInputMessage,
  PromptInputBody,
  PromptInputAttachments,
  PromptInputAttachment,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  PromptInputSubmit,
  PromptInputModelSelect,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectValue,
  Conversation, 
  ConversationContent, 
  ConversationEmptyState,
  ConversationScrollButton,
  Message, 
  MessageContent,
  Response,
  Loader,
  Actions,
  Action
} from './ai-elements';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const aiService = AIService.getInstance();

  const handleSubmit = async (promptMessage: PromptInputMessage) => {
    if (!promptMessage.text.trim() && !promptMessage.files?.length) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: promptMessage.text || 'Sent with attachments',
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Create assistant message ID for streaming
    const assistantMessageId = (Date.now() + 1).toString();
    let assistantMessageCreated = false;

    try {
      // Get AI response using the AI service with streaming
      const aiResponse = await aiService.sendMessage(userMessage.content, (chunk: string) => {
        // Create assistant message on first chunk if not already created
        if (!assistantMessageCreated) {
          const assistantMessage: Message = {
            id: assistantMessageId,
            content: chunk,
            role: 'assistant',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, assistantMessage]);
          assistantMessageCreated = true;
        } else {
          // Update the assistant message content in real-time
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: msg.content + chunk }
              : msg
          ));
        }
      });
      
      // Update the final message with the complete response
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: aiResponse }
          : msg
      ));
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Create assistant message with error content if not already created
      if (!assistantMessageCreated) {
        const errorMessage: Message = {
          id: assistantMessageId,
          content: 'Sorry, I encountered an error while processing your request. Please try again.',
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } else {
        // Update the assistant message with error content
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: 'Sorry, I encountered an error while processing your request. Please try again.' }
            : msg
        ));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20 overflow-hidden">
        {/* Conversation Area - Takes remaining space and is scrollable */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <Conversation className="relative w-full h-full">
            <ConversationContent>
              {messages.length === 0 ? (
                <ConversationEmptyState
                  icon={<Bot className="h-10 w-10 text-white" />}
                  title="Welcome to Desktop AI Chat"
                  description="Start a conversation with our AI assistant"
                >
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                      Ask questions
                    </span>
                    <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                      Get help with coding
                    </span>
                    <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                      Brainstorm ideas
                    </span>
                    <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                      Have a conversation
                    </span>
                  </div>
                </ConversationEmptyState>
              ) : (
                <>
                  {messages.map((message) => (
                    <Message key={message.id} from={message.role}>
                      <MessageContent>
                        <Response>{message.content}</Response>
                        <div className="flex items-center justify-between mt-2">
                          <p className={`text-xs opacity-70 ${
                            message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                          <Actions>
                            <Action tooltip="Copy message">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </Action>
                            <Action tooltip="Regenerate">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </Action>
                          </Actions>
                        </div>
                      </MessageContent>
                    </Message>
                  ))}
                  
                  {isLoading && (
                    <Message from="assistant">
                      <MessageContent>
                        <div className="flex items-center space-x-2">
                          <Loader size={16} />
                          <span className="text-sm text-muted-foreground">AI is thinking...</span>
                        </div>
                      </MessageContent>
                    </Message>
                  )}
                </>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>
        
        {/* Prompt Input Area - Fixed at bottom with proper spacing */}
        <div className="flex-shrink-0 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4">
            <div className="max-w-4xl mx-auto">
              <PromptInput
                onSubmit={handleSubmit}
                maxFiles={5}
                maxFileSize={10 * 1024 * 1024} // 10MB
                accept="image/*,.pdf,.txt,.doc,.docx"
                multiple={true}
                globalDrop={true}
              >
                <PromptInputBody>
                  <PromptInputAttachments>
                    {(attachment) => <PromptInputAttachment data={attachment} />}
                  </PromptInputAttachments>
                  <PromptInputTextarea
                    placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                    disabled={isLoading}
                  />
                </PromptInputBody>
                <PromptInputToolbar>
                  <PromptInputTools>
                    <PromptInputActionMenu>
                      <PromptInputActionMenuTrigger />
                      <PromptInputActionMenuContent>
                        <PromptInputActionAddAttachments />
                      </PromptInputActionMenuContent>
                    </PromptInputActionMenu>
                    <PromptInputModelSelect
                      value={selectedModel}
                      onValueChange={setSelectedModel}
                    >
                      <PromptInputModelSelectTrigger>
                        <PromptInputModelSelectValue />
                      </PromptInputModelSelectTrigger>
                      <PromptInputModelSelectContent>
                        <PromptInputModelSelectItem value="gpt-3.5-turbo">
                          GPT-3.5 Turbo
                        </PromptInputModelSelectItem>
                        <PromptInputModelSelectItem value="gpt-4">
                          GPT-4
                        </PromptInputModelSelectItem>
                        <PromptInputModelSelectItem value="gpt-4-turbo">
                          GPT-4 Turbo
                        </PromptInputModelSelectItem>
                      </PromptInputModelSelectContent>
                    </PromptInputModelSelect>
                  </PromptInputTools>
                  <PromptInputSubmit
                    disabled={isLoading}
                    status={isLoading ? 'streaming' : 'ready'}
                  />
                </PromptInputToolbar>
              </PromptInput>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
