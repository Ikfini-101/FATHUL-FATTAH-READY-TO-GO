import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { BookOpen, ShoppingBag, Radio, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface Slide {
  id: number;
  icon: React.ReactNode;
  titleKey: string;
  descriptionKey: string;
  link: string;
  gradient: string;
  bgImage: string;
}

export default function PortalHome() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides: Slide[] = [
    {
      id: 1,
      icon: <BookOpen className="w-20 h-20" />,
      titleKey: "portalHome.slides.documentation.title",
      descriptionKey: "portalHome.slides.documentation.description",
      link: "/catalogue",
      gradient: "from-green-600 to-emerald-700",
      bgImage: "/images/grande-mosquee-touba-1.jpeg",
    },
    {
      id: 2,
      icon: <ShoppingBag className="w-20 h-20" />,
      titleKey: "portalHome.slides.boutique.title",
      descriptionKey: "portalHome.slides.boutique.description",
      link: "/boutique",
      gradient: "from-amber-600 to-orange-700",
      bgImage: "/images/cheikh-bamba-portrait.png",
    },
    {
      id: 3,
      icon: <Radio className="w-20 h-20" />,
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
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-700 to-green-600 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img
                src="/images/logo-ff.png"
                alt="Fathul Fattah Logo"
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <h1 className="text-2xl font-bold text-white">
                {t("portalHome.title", "Fathul Fattah")}
              </h1>
            </div>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Carousel */}
      <div className="relative h-screen overflow-hidden pt-20">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            }`}
            style={{
              backgroundImage: `url(${slide.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-85`} />

            {/* Content */}
            <div className="relative h-full flex items-center justify-center">
              <div className="container mx-auto px-4 text-center text-white">
                {/* Icon */}
                <div className="flex justify-center mb-8 animate-bounce">
                  <div className="p-6 bg-white/10 backdrop-blur-sm rounded-full border-4 border-white/30">
                    {slide.icon}
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl animate-fade-in">
                  {t(slide.titleKey)}
                </h2>

                {/* Description */}
                <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
                  {t(slide.descriptionKey)}
                </p>

                {/* CTA Button */}
                <Link href={slide.link}>
                  <Button
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
                  >
                    {t("portalHome.cta", "Découvrir")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className={`absolute ${
            isRTL ? "right-8" : "left-8"
          } top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 transform hover:scale-110`}
          aria-label={t("portalHome.previous", "Précédent")}
        >
          {isRTL ? <ChevronRight className="w-8 h-8" /> : <ChevronLeft className="w-8 h-8" />}
        </button>
        <button
          onClick={nextSlide}
          className={`absolute ${
            isRTL ? "left-8" : "right-8"
          } top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 transform hover:scale-110`}
          aria-label={t("portalHome.next", "Suivant")}
        >
          {isRTL ? <ChevronLeft className="w-8 h-8" /> : <ChevronRight className="w-8 h-8" />}
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "w-12 h-3 bg-white"
                  : "w-3 h-3 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`${t("portalHome.goToSlide", "Aller à la diapositive")} ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-white/70 hover:text-white text-sm transition-colors duration-300"
          >
            {isAutoPlaying
              ? t("portalHome.pauseAutoPlay", "⏸ Pause")
              : t("portalHome.resumeAutoPlay", "▶ Lecture automatique")}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm text-white py-4 z-40">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2025 Hizbut Tarqiyyah - {t("portalHome.footer", "Tous droits réservés")}
          </p>
        </div>
      </footer>
    </div>
  );
}
