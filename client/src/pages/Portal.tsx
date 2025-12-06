import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SEOHead } from "@/components/SEOHead";
import { trpc } from "@/lib/trpc";
import PortalLayout from "@/components/PortalLayout";
import { Calendar, FileText, Mail, ArrowRight, Loader2, BookOpen, ShoppingBag, Radio, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function Portal() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as "fr" | "ar" | "en";
  const isRTL = i18n.language === "ar";

  // Récupérer les 3 derniers articles publiés
  const { data: articles, isLoading } = trpc.portal.articles.useQuery();
  const recentArticles = articles?.slice(0, 3) || [];

  // État du carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const platformCards = [
    {
      id: 1,
      icon: <BookOpen className="w-12 h-12" />,
      titleKey: "portalHome.slides.documentation.title",
      descriptionKey: "portalHome.slides.documentation.description",
      link: "/catalogue",
      gradient: "from-green-600 to-emerald-700",
      bgImage: "/images/grande-mosquee-touba-1.jpeg",
    },
    {
      id: 2,
      icon: <ShoppingBag className="w-12 h-12" />,
      titleKey: "portalHome.slides.boutique.title",
      descriptionKey: "portalHome.slides.boutique.description",
      link: "/boutique",
      gradient: "from-yellow-700 to-amber-800", // Doré
      bgImage: "/images/poemes-ramadan-fr.png",
    },
    {
      id: 3,
      icon: <Radio className="w-12 h-12" />,
      titleKey: "portalHome.slides.radio.title",
      descriptionKey: "portalHome.slides.radio.description",
      link: "/radio",
      gradient: "from-green-700 to-teal-800",
      bgImage: "/images/grande-mosquee-touba-2.jpeg",
    },
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % platformCards.length);
    }, 2500); // Change toutes les 2.5 secondes

    return () => clearInterval(interval);
  }, [isAutoPlaying, platformCards.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % platformCards.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + platformCards.length) % platformCards.length);
  };

  return (
    <PortalLayout>
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

      {/* Carousel de Cartes Plateformes */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("portal.platforms.title", "Nos Plateformes")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("portal.platforms.description", "Découvrez nos trois plateformes dédiées à la culture islamique et mouride")}
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative max-w-5xl mx-auto">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(${isRTL ? currentSlide * 100 : -currentSlide * 100}%)` 
                }}
              >
                {platformCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <Card className="overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                      <div className="relative p-8 text-white overflow-hidden">
                        {/* Image de fond */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${card.bgImage})` }}
                        />
                        {/* Overlay gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-90`} />
                        <div className="relative z-10 flex flex-col items-center text-center">
                          <div className="mb-6 p-4 bg-white/20 backdrop-blur-sm rounded-full animate-scale-in">
                            {card.icon}
                          </div>
                          <h3 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in-down animation-delay-200">
                            {t(card.titleKey)}
                          </h3>
                          <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-2xl leading-relaxed animate-fade-in-up animation-delay-400">
                            {t(card.descriptionKey)}
                          </p>
                          <Button 
                            size="lg" 
                            className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                            onClick={() => window.location.href = card.link}
                          >
                            {t("portalHome.cta", "Découvrir")}
                            <ArrowRight className="ml-2 w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className={`absolute ${
                isRTL ? "right-0" : "left-0"
              } top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-100 text-gray-900 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10`}
              aria-label={t("portalHome.previous", "Précédent")}
            >
              {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            </button>
            <button
              onClick={nextSlide}
              className={`absolute ${
                isRTL ? "left-0" : "right-0"
              } top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-100 text-gray-900 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10`}
              aria-label={t("portalHome.next", "Suivant")}
            >
              {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
            </button>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-8">
              {platformCards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentSlide(index);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? "w-8 h-3 bg-primary"
                      : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`${t("portalHome.goToSlide", "Aller à la diapositive")} ${index + 1}`}
                />
              ))}
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
          <p className="text-center text-gray-500 py-12">
            {t("portal.recentArticles.noArticles")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <Link key={article.id} href={`/portal/articles/${article.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString(currentLang)}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Section Services */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t("portal.services.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/portal/articles">
              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("portal.services.articles.title")}
                  </h3>
                  <p className="text-gray-600">
                    {t("portal.services.articles.description")}
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/portal/events">
              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("portal.services.events.title")}
                  </h3>
                  <p className="text-gray-600">
                    {t("portal.services.events.description")}
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/contact">
              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
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
    </PortalLayout>
  );
}
