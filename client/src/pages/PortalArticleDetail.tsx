import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SEOHead } from "@/components/SEOHead";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowLeft, Calendar, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRoute } from "wouter";
import PortalLayout from "@/components/PortalLayout";

export default function PortalArticleDetail() {
  const { t, i18n } = useTranslation();
  const [, params] = useRoute("/portal/articles/:slug");
  const slug = params?.slug || "";

  const { data: article, isLoading, error } = trpc.portal.articleBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const currentLang = i18n.language as 'fr' | 'ar' | 'en';

  // Fonction pour obtenir le contenu localisé
  const getLocalizedContent = (field: 'title' | 'excerpt' | 'content') => {
    if (!article) return '';
    
    const i18nField = `${field}I18n` as 'titleI18n' | 'excerptI18n' | 'bodyI18n';
    
    // Si le champ i18n existe, utiliser la traduction
    if (article[i18nField] && article[i18nField][currentLang]) {
      return article[i18nField][currentLang];
    }
    
    // Sinon, fallback sur le champ original
    return (article as any)[field] || '';
  };

  if (isLoading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center py-12">
        <Loader2 className="w-12 h-12 animate-spin text-amber-600" />
        </div>
      </PortalLayout>
    );
  }

  if (error || !article) {
    return (
      <PortalLayout>
        <header className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-bold">{t('portal.articles.title')}</h1>
              <LanguageSwitcher />
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-600 mb-8">Article non trouvé</p>
            <a href="/portal/articles" className="text-amber-600 hover:text-amber-700 font-semibold inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t('portal.articles.backToPortal')}
            </a>
          </div>
        </main>
      </PortalLayout>
    );
  }

  const title = getLocalizedContent('title');
  const content = getLocalizedContent('content');

  return (
    <PortalLayout>
      <SEOHead 
        title={title}
        description={getLocalizedContent('excerpt') || content.substring(0, 160)}
        type="article"
        publishedTime={article.publishedAt?.toString()}
        modifiedTime={article.updatedAt.toString()}
      />
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start mb-4">
            <a 
              href="/portal/articles" 
              className="text-white/80 hover:text-white inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('portal.articles.backToPortal')}
            </a>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="container mx-auto px-4 py-12">
        <article className="max-w-3xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600" />
                <time dateTime={article.createdAt.toString()}>
                  {new Date(article.createdAt).toLocaleDateString(i18n.language, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </time>
              </div>
              
              {article.publishedAt && (
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-600" />
                  <span>
                    {t('portal.articles.publishedOn')} {new Date(article.publishedAt).toLocaleDateString(i18n.language)}
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-800 leading-relaxed whitespace-pre-wrap"
              style={{
                fontSize: '1.125rem',
                lineHeight: '1.75rem'
              }}
            >
              {content}
            </div>
          </div>

          {/* Back to Articles */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <a 
              href="/portal/articles" 
              className="text-amber-600 hover:text-amber-700 font-semibold inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('portal.articles.backToPortal')}
            </a>
          </div>
        </article>
      </main>

    </PortalLayout>
  );
}
