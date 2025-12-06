import { Link } from 'wouter';
import { BookOpen, Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Footer du site Centre de Documentation Fathul Fattah
 * Identité visuelle propre au centre de documentation
 */
export default function DocFooter() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-r from-emerald-900 via-green-900 to-teal-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos Centre Doc */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <BookOpen className="h-5 w-5" />
              <span>Centre de Documentation</span>
            </div>
            <p className="text-sm text-gray-300">
              {t('doc.footer.about', 'Bibliothèque spécialisée en littérature mouride. Manuscrits, ouvrages et archives historiques.')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">{t('doc.footer.navigation', 'Navigation')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalogue" className="text-gray-300 hover:text-white transition-colors">
                  {t('doc.nav.catalog', 'Catalogue')}
                </Link>
              </li>
              <li>
                <Link href="/galerie" className="text-gray-300 hover:text-white transition-colors">
                  {t('doc.nav.gallery', 'Galerie Photos')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Horaires */}
          <div>
            <h3 className="font-semibold mb-4">{t('doc.footer.hours', 'Horaires')}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Lundi - Vendredi : 8h - 18h</li>
              <li>Samedi : 9h - 13h</li>
              <li>Dimanche : Fermé</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">{t('doc.footer.contact', 'Contact')}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Touba, Sénégal</li>
              <li>+221 33 XXX XX XX</li>
              <li>bibliotheque@fathulfattah.sn</li>
            </ul>
            <div className="flex gap-3 mt-4">
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
                href="mailto:bibliotheque@fathulfattah.sn"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
          © 2025 Centre de Documentation Fathul Fattah - Hizbut Tarqiyyah. {t('footer.rights', 'Tous droits réservés')}.
        </div>
      </div>
    </footer>
  );
}
