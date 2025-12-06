import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import PublicFooter from "@/components/PublicFooter";
import { useTranslation } from "react-i18next";

export default function PortalArticles() {
  const { t, i18n } = useTranslation();
  const { data: articles, isLoading } = trpc.portal.articles.useQuery();

  // Fonction pour obtenir le contenu dans la langue actuelle
  const getLocalizedContent = (article: any, field: 'title' | 'excerpt' | 'content') => {
    const i18nField = `${field}I18n`;
    const currentLang = i18n.language as 'fr' | 'ar' | 'en';
    
    // Si le champ i18n existe, utiliser la traduction
    if (article[i18nField] && article[i18nField][currentLang]) {
      return article[i18nField][currentLang];
    }
    
    // Sinon, fallback sur le champ original
    return article[field] || '';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec image de fond */}
      <header className="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white py-12 overflow-hidden">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0 opacity-15">
          <img
            src="/images/cheikh-bamba-historic.png"
            alt="Cheikh Ahmadou Bamba"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/85 to-orange-500/85" />
        
        {/* Contenu du header */}
        <div className="relative container mx-auto px-4">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-4xl font-bold">{t('portal.articles.title')}</h1>
            <LanguageSwitcher />
          </div>
          <a href="/portal" className="text-white/80 hover:text-white">
            {t('portal.articles.backToPortal')} ←
          </a>
        </div>
      </header>

      {/* Articles List */}
      <main className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => {
              const title = getLocalizedContent(article, 'title');
              const excerpt = getLocalizedContent(article, 'excerpt');
              const content = getLocalizedContent(article, 'content');
              
              return (
                <article key={article.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
                    <p className="text-gray-600 text-sm mb-4">
                      {new Date(article.createdAt).toLocaleDateString(i18n.language)}
                    </p>
                    <p className="text-gray-700 mb-4">
                      {excerpt || content?.substring(0, 150) + '...'}
                    </p>
                    <a href={`/portal/articles/${article.slug}`} className="text-amber-600 hover:text-amber-700 font-semibold">
                      {t('portal.articles.readMore')} →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">{t('portal.articles.noArticles')}</p>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
