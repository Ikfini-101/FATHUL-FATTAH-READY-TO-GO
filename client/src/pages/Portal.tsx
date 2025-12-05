import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SEOHead } from "@/components/SEOHead";
import { trpc } from "@/lib/trpc";
import { Calendar, FileText, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function Portal() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as "fr" | "ar" | "en";

  // Récupérer les 3 derniers articles publiés
  const { data: articles, isLoading } = trpc.portal.articles.useQuery();
  const recentArticles = articles?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <SEOHead 
        title={t('portal.title')}
        description={t('portal.home.description')}
        type="website"
      />

      {/* Header avec image de fond */}
      <header className="relative bg-primary text-primary-foreground shadow-lg overflow-hidden">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0 opacity-15">
          <img
            src="/images/cheikh-bamba-historic.png"
            alt="Cheikh Ahmadou Bamba"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-primary/85" />
        
        {/* Contenu du header */}
        <div className="relative container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl font-bold">FF</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{t("portal.title")}</h1>
                <p className="text-sm opacity-90">{t("portal.subtitle")}</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Hero Section avec image de fond */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/touba-mosque-3.jpg')" }}
        />
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t("portal.hero.title")}
            </h2>
            <p className="text-xl mb-8 opacity-95">
              {t("portal.hero.description")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/portal/articles">
                <Button size="lg" variant="secondary" className="shadow-lg">
                  {t("portal.hero.discoverArticles")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/portal/events">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20 text-white">
                  {t("portal.hero.viewEvents")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section Articles Récents */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t("portal.recentArticles.title")}
            </h2>
            <p className="text-gray-600">
              {t("portal.recentArticles.description")}
            </p>
          </div>
          <Link href="/portal/articles">
            <Button variant="outline">
              {t("portal.recentArticles.viewAll")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : recentArticles.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              {t("portal.recentArticles.noArticles")}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((article, index) => {
              const title = article.titleI18n?.[currentLang] || article.title || "";
              const excerpt = article.excerptI18n?.[currentLang] || article.excerpt || "";
              
              // Images mockées pour démonstration
              const images = [
                "/images/touba-mosque-1.jpg",
                "/images/touba-mosque-2.jpg",
                "/images/cheikh-bamba.jpeg"
              ];
              const imageUrl = images[index % images.length];

              return (
                <Link key={article.id} href={`/portal/articles/${article.slug}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-2 hover:border-primary/30">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {excerpt}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(article.publishedAt || article.createdAt).toLocaleDateString(currentLang)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Section Services/Liens rapides */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t("portal.services.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link href="/portal/articles">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/30">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <FileText className="w-8 h-8 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {t("portal.services.articles.title")}
                  </h3>
                  <p className="text-gray-600">
                    {t("portal.services.articles.description")}
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/portal/events">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-secondary/30">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary group-hover:text-white transition-colors">
                    <Calendar className="w-8 h-8 text-secondary group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {t("portal.services.events.title")}
                  </h3>
                  <p className="text-gray-600">
                    {t("portal.services.events.description")}
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/portal/contact">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/30">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Mail className="w-8 h-8 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {t("portal.services.contact.title")}
                  </h3>
                  <p className="text-gray-600">
                    {t("portal.services.contact.description")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">{t("portal.footer.about")}</h3>
              <p className="text-sm">
                {t("portal.footer.aboutText")}
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">{t("portal.footer.links")}</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/portal/articles" className="hover:text-white transition-colors">{t("portal.nav.articles")}</Link></li>
                <li><Link href="/portal/events" className="hover:text-white transition-colors">{t("portal.nav.events")}</Link></li>
                <li><Link href="/portal/contact" className="hover:text-white transition-colors">{t("portal.nav.contact")}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">{t("portal.footer.contact")}</h3>
              <p className="text-sm">
                Email: contact@fathul-fattah.sn<br />
                Tél: +221 XX XXX XX XX
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Hizbut Tarqiyyah</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
