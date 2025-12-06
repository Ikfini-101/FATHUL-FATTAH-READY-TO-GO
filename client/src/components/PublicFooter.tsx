import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* À propos */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Hizbut Tarqiyyah</h3>
            <p className="text-sm mb-4">
              Organisation dédiée à la préservation et à la diffusion du patrimoine spirituel Mouride.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/hizbuttarqiyyah"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/hizbuttarqiyyah"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-sky-500 rounded-full flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/hizbuttarqiyyah"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@hizbuttarqiyyah"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation rapide */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/portal" className="hover:text-white transition-colors">
                  Portail
                </Link>
              </li>
              <li>
                <Link href="/portal/articles" className="hover:text-white transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/portal/events" className="hover:text-white transition-colors">
                  Événements
                </Link>
              </li>
              <li>
                <Link href="/catalogue" className="hover:text-white transition-colors">
                  Centre de Documentation
                </Link>
              </li>
              <li>
                <Link href="/galerie" className="hover:text-white transition-colors">
                  Galerie Photos
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Ressources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalogue" className="hover:text-white transition-colors">
                  Bibliothèque Numérique
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-white transition-colors">
                  E-Radio
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-white transition-colors">
                  Musée VR
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-white transition-colors">
                  E-Boutique
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Touba, Sénégal</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+221338651234" className="hover:text-white transition-colors">
                  +221 33 865 12 34
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:contact@hizbuttarqiyyah.sn" className="hover:text-white transition-colors">
                  contact@hizbuttarqiyyah.sn
                </a>
              </li>
            </ul>
            <Link href="/contact" className="mt-4 inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors">
              Nous Contacter
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>&copy; 2025 Hizbut Tarqiyyah. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
