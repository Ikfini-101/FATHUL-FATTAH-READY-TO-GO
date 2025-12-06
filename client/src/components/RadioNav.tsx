import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Radio, Menu, X, Headphones, Calendar, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

/**
 * Navigation principale du site Radio Fathul Fattah
 * Site autonome avec identité visuelle propre
 */
export default function RadioNav() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const isActive = (path: string) => location === path || location.startsWith(path + '/');

  const navLinks = [
    { path: '/radio', label: t('radio.nav.home', 'Accueil'), icon: Radio },
    { path: '/radio/live', label: t('radio.nav.live', 'Écoute Live'), icon: Headphones },
    { path: '/radio/grille', label: t('radio.nav.schedule', 'Grille'), icon: Calendar },
    { path: '/radio/podcasts', label: t('radio.nav.podcasts', 'Podcasts'), icon: Mic },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Radio */}
          <Link href="/radio" className="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition-opacity">
            <Radio className="h-6 w-6" />
            <span>Radio Fathul Fattah</span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    isActive(link.path)
                      ? 'bg-white/20 font-semibold'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Navigation Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    isActive(link.path)
                      ? 'bg-white/20 font-semibold'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
