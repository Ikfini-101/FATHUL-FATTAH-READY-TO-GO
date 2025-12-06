import { ReactNode } from 'react';
import DocNav from './DocNav';
import DocFooter from './DocFooter';

interface DocLayoutProps {
  children: ReactNode;
}

/**
 * Layout principal du site Centre de Documentation Fathul Fattah
 * Site autonome avec navigation et identité propres
 */
export default function DocLayout({ children }: DocLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DocNav />
      <main className="flex-1">
        {children}
      </main>
      <DocFooter />
    </div>
  );
}
