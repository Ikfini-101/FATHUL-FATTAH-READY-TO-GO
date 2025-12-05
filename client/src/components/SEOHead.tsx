import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

export function SEOHead({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
}: SEOHeadProps) {
  const { i18n } = useTranslation();
  
  const defaultTitle = 'Espace Admin - Fathul Fattah';
  const defaultDescription = 'Portail institutionnel de Fathul Fattah';
  const defaultImage = '/logo.png';
  const baseUrl = window.location.origin;
  
  const fullTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = image || defaultImage;
  const finalUrl = url || window.location.href;

  useEffect(() => {
    // Mettre à jour le titre de la page
    document.title = fullTitle;

    // Mettre à jour ou créer les meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Meta tags standards
    updateMetaTag('description', finalDescription);
    updateMetaTag('language', i18n.language);

    // Open Graph
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', finalDescription, true);
    updateMetaTag('og:image', finalImage.startsWith('http') ? finalImage : `${baseUrl}${finalImage}`, true);
    updateMetaTag('og:url', finalUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:locale', i18n.language === 'ar' ? 'ar_SA' : i18n.language === 'en' ? 'en_US' : 'fr_FR', true);

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', finalImage.startsWith('http') ? finalImage : `${baseUrl}${finalImage}`);

    // Article meta tags
    if (type === 'article' && publishedTime) {
      updateMetaTag('article:published_time', publishedTime, true);
    }
    if (type === 'article' && modifiedTime) {
      updateMetaTag('article:modified_time', modifiedTime, true);
    }

    // Langues alternatives (hreflang)
    const updateLinkTag = (hreflang: string, href: string) => {
      let element = document.querySelector(`link[hreflang="${hreflang}"]`);
      
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'alternate');
        element.setAttribute('hreflang', hreflang);
        document.head.appendChild(element);
      }
      
      element.setAttribute('href', href);
    };

    const currentPath = window.location.pathname;
    updateLinkTag('fr', `${baseUrl}${currentPath}?lang=fr`);
    updateLinkTag('ar', `${baseUrl}${currentPath}?lang=ar`);
    updateLinkTag('en', `${baseUrl}${currentPath}?lang=en`);
    updateLinkTag('x-default', `${baseUrl}${currentPath}`);

  }, [fullTitle, finalDescription, finalImage, finalUrl, type, publishedTime, modifiedTime, i18n.language]);

  return null;
}
