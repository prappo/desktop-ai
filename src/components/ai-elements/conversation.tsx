import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { ChevronDown } from 'lucide-react';

export interface ConversationProps {
  children: React.ReactNode;
  className?: string;
}

export function Conversation({ children, className = '' }: ConversationProps) {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {children}
    </div>
  );
}

export function ConversationContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [children]);

  return (
    <ScrollArea ref={scrollAreaRef} className={`flex-1 ${className}`}>
      <div className="space-y-6 p-6">
        {children}
      </div>
    </ScrollArea>
  );
}

export function ConversationEmptyState({ 
  title = "No messages yet", 
  description = "Start a conversation to see messages here",
  icon,
  children,
  className = '',
  ...props 
}: { 
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
} & React.ComponentProps<"div">) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`} {...props}>
      {icon && (
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
          {icon}
        </div>
      )}
      <h2 className="text-2xl font-bold text-foreground mb-2">
        {title}
      </h2>
      <p className="text-muted-foreground text-lg mb-4">
        {description}
      </p>
      {children}
    </div>
  );
}

export function ConversationScrollButton({ className = '' }: { className?: string }) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showButton, setShowButton] = React.useState(false);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        setShowButton(scrollHeight - scrollTop - clientHeight > 100);
      }
    }
  };

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (!showButton) return null;

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <Button
        onClick={scrollToBottom}
        size="icon"
        className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg hover:shadow-xl"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
