import { ReactNode } from 'react';
import RadioNav from './RadioNav';
import RadioFooter from './RadioFooter';

interface RadioLayoutProps {
  children: ReactNode;
}

/**
 * Layout principal du site Radio Fathul Fattah
 * Site autonome avec navigation et identité propres
 */
export default function RadioLayout({ children }: RadioLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <RadioNav />
      <main className="flex-1">
        {children}
      </main>
      <RadioFooter />
    </div>
  );
}
