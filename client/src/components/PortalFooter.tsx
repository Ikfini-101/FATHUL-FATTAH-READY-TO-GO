import { Link } from 'wouter';
import { Compass, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Footer du site Portail Fathul Fattah
 * Identité visuelle propre au portail
 */
export default function PortalFooter() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-r from-yellow-900 via-yellow-950 to-amber-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos Portail */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <Compass className="h-5 w-5" />
              <span>Portail Fathul Fattah</span>
            </div>
            <p className="text-sm text-gray-300">
              {t('portal.footer.about', 'Portail d\'information et de ressources sur la confrérie mouride et Cheikh Ahmadou Bamba.')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">{t('portal.footer.navigation', 'Navigation')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/portal" className="text-gray-300 hover:text-white transition-colors">
                  {t('portal.nav.home', 'Accueil')}
                </Link>
              </li>
              <li>
                <Link href="/portal/articles" className="text-gray-300 hover:text-white transition-colors">
                  {t('portal.nav.articles', 'Articles')}
                </Link>
              </li>
              <li>
                <Link href="/portal/events" className="text-gray-300 hover:text-white transition-colors">
                  {t('portal.nav.events', 'Événements')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  {t('portal.nav.contact', 'Contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="font-semibold mb-4">{t('portal.footer.resources', 'Ressources')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalogue" className="text-gray-300 hover:text-white transition-colors">
                  Centre de Documentation
                </Link>
              </li>
              <li>
                <Link href="/radio" className="text-gray-300 hover:text-white transition-colors">
                  Radio Fathul Fattah
                </Link>
              </li>
            </ul>
          </div>

          {/* Réseaux Sociaux */}
          <div>
            <h3 className="font-semibold mb-4">{t('portal.footer.social', 'Suivez-nous')}</h3>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/fathulfattah"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/fathulfattah"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/fathulfattah"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@fathulfattah"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
          © 2025 Portail Fathul Fattah - Hizbut Tarqiyyah. {t('footer.rights', 'Tous droits réservés')}.
        </div>
      </div>
    </footer>
  );
}
