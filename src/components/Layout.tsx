
import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
  withPadding?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function Layout({ children, withPadding = true, fullWidth = false, className = '' }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main 
        className={`flex-1 flex flex-col ${withPadding ? 'py-8 px-4 md:px-8' : ''} 
        ${fullWidth ? 'w-full' : 'container mx-auto'} ${className}`}
      >
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      <footer className="py-6 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TimeWise Studio. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
