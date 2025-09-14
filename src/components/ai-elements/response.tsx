import React from 'react';
import { Streamdown } from 'streamdown';

export interface ResponseProps {
  children: string;
  className?: string;
  parseIncompleteMarkdown?: boolean;
  components?: Record<string, React.ComponentType<any>>;
  allowedImagePrefixes?: string[];
  allowedLinkPrefixes?: string[];
  defaultOrigin?: string;
  rehypePlugins?: any[];
  remarkPlugins?: any[];
}

export function Response({ 
  children, 
  className = '',
  parseIncompleteMarkdown = true,
  components,
  allowedImagePrefixes,
  allowedLinkPrefixes,
  defaultOrigin,
  rehypePlugins,
  remarkPlugins,
  ...props 
}: ResponseProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Streamdown
      className={`streamdown ${className}`}
      parseIncompleteMarkdown={parseIncompleteMarkdown}
      components={components}
      allowedImagePrefixes={allowedImagePrefixes}
      allowedLinkPrefixes={allowedLinkPrefixes}
      defaultOrigin={defaultOrigin}
      rehypePlugins={rehypePlugins}
      remarkPlugins={remarkPlugins}
      {...props}
    >
      {children}
    </Streamdown>
  );
}
