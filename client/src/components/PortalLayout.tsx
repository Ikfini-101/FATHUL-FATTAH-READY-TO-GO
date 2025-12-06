import { ReactNode } from 'react';
import PortalNav from './PortalNav';
import PortalFooter from './PortalFooter';

interface PortalLayoutProps {
  children: ReactNode;
}

/**
 * Layout principal du site Portail Fathul Fattah
 * Site autonome avec navigation et identité propres
 */
export default function PortalLayout({ children }: PortalLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalNav />
      <main className="flex-1">
        {children}
      </main>
      <PortalFooter />
    </div>
  );
}
