import React from 'react';

export interface ResponseProps {
  children: React.ReactNode;
  className?: string;
}

export function Response({ children, className = '' }: ResponseProps) {
  return (
    <div className={`whitespace-pre-wrap leading-relaxed ${className}`}>
      {children}
    </div>
  );
}
