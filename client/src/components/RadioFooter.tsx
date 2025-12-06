import { Link } from 'wouter';
import { Radio, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Footer du site Radio Fathul Fattah
 * Identité visuelle propre au site radio
 */
export default function RadioFooter() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos Radio */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <Radio className="h-5 w-5" />
              <span>Radio Fathul Fattah</span>
            </div>
            <p className="text-sm text-gray-300">
              {t('radio.footer.about', 'La voix de la spiritualité mouride. Émissions religieuses, Khassaides et actualités communautaires.')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">{t('radio.footer.navigation', 'Navigation')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/radio" className="text-gray-300 hover:text-white transition-colors">
                  {t('radio.nav.home', 'Accueil')}
                </Link>
              </li>
              <li>
                <Link href="/radio/live" className="text-gray-300 hover:text-white transition-colors">
                  {t('radio.nav.live', 'Écoute Live')}
                </Link>
              </li>
              <li>
                <Link href="/radio/grille" className="text-gray-300 hover:text-white transition-colors">
                  {t('radio.nav.schedule', 'Grille des Programmes')}
                </Link>
              </li>
              <li>
                <Link href="/radio/podcasts" className="text-gray-300 hover:text-white transition-colors">
                  {t('radio.nav.podcasts', 'Podcasts & Replays')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">{t('radio.footer.contact', 'Contact')}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Touba, Sénégal</li>
              <li>+221 33 XXX XX XX</li>
              <li>radio@fathulfattah.sn</li>
            </ul>
          </div>

          {/* Réseaux Sociaux */}
          <div>
            <h3 className="font-semibold mb-4">{t('radio.footer.social', 'Suivez-nous')}</h3>
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
          © 2025 Radio Fathul Fattah - Hizbut Tarqiyyah. {t('footer.rights', 'Tous droits réservés')}.
        </div>
      </div>
    </footer>
  );
}
