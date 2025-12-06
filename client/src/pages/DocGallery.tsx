import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Book } from "lucide-react";
import PublicFooter from "@/components/PublicFooter";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";

interface GalleryImage {
  id: number;
  src: string;
  title: { fr: string; ar: string; en: string };
  description: { fr: string; ar: string; en: string };
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 1,
    src: "/images/cheikh-bamba-historic.png",
    title: {
      fr: "Cheikh Ahmadou Bamba - Photo historique",
      ar: "الشيخ أحمدو بامبا - صورة تاريخية",
      en: "Cheikh Ahmadou Bamba - Historic photo"
    },
    description: {
      fr: "Photo historique du fondateur de la confrérie Mouride, Cheikh Ahmadou Bamba Mbacké",
      ar: "صورة تاريخية لمؤسس الطريقة المريدية، الشيخ أحمدو بامبا مباكي",
      en: "Historic photo of the founder of the Mouride brotherhood, Cheikh Ahmadou Bamba Mbacké"
    }
  },
  {
    id: 2,
    src: "/images/cheikh-bamba.jpeg",
    title: {
      fr: "Portrait de Cheikh Ahmadou Bamba",
      ar: "صورة الشيخ أحمدو بامبا",
      en: "Portrait of Cheikh Ahmadou Bamba"
    },
    description: {
      fr: "Portrait du guide spirituel et érudit islamique",
      ar: "صورة المرشد الروحي والعالم الإسلامي",
      en: "Portrait of the spiritual guide and Islamic scholar"
    }
  },
  {
    id: 3,
    src: "/images/touba-mosque-1.jpg",
    title: {
      fr: "Grande Mosquée de Touba",
      ar: "المسجد الكبير في طوبى",
      en: "Great Mosque of Touba"
    },
    description: {
      fr: "La Grande Mosquée de Touba, lieu saint du Mouridisme",
      ar: "المسجد الكبير في طوبى، المكان المقدس للمريدية",
      en: "The Great Mosque of Touba, holy place of Mouridism"
    }
  },
  {
    id: 4,
    src: "/images/touba-mosque-2.jpg",
    title: {
      fr: "Mosquée de Touba - Vue extérieure",
      ar: "مسجد طوبى - منظر خارجي",
      en: "Touba Mosque - Exterior view"
    },
    description: {
      fr: "Vue extérieure de la mosquée et son architecture majestueuse",
      ar: "منظر خارجي للمسجد وهندسته المعمارية المهيبة",
      en: "Exterior view of the mosque and its majestic architecture"
    }
  },
  {
    id: 5,
    src: "/images/touba-mosque-3.jpg",
    title: {
      fr: "Mosquée de Touba - Architecture",
      ar: "مسجد طوبى - العمارة",
      en: "Touba Mosque - Architecture"
    },
    description: {
      fr: "Détails architecturaux de la Grande Mosquée",
      ar: "تفاصيل معمارية للمسجد الكبير",
      en: "Architectural details of the Great Mosque"
    }
  },
  {
    id: 6,
    src: "/images/poemes-ramadan-fr.png",
    title: {
      fr: "Poèmes du Ramadan - Édition française",
      ar: "قصائد رمضان - النسخة الفرنسية",
      en: "Ramadan Poems - French edition"
    },
    description: {
      fr: "Couverture de l'ouvrage 'Poèmes du Ramadan' traduit en français",
      ar: "غلاف كتاب 'قصائد رمضان' مترجم إلى الفرنسية",
      en: "Cover of 'Ramadan Poems' translated into French"
    }
  },
  {
    id: 7,
    src: "/images/poemes-ramadan-ar.png",
    title: {
      fr: "Poèmes du Ramadan - Édition arabe",
      ar: "قصائد رمضان - النسخة العربية",
      en: "Ramadan Poems - Arabic edition"
    },
    description: {
      fr: "Couverture de l'ouvrage 'Poèmes du Ramadan' en arabe",
      ar: "غلاف كتاب 'قصائد رمضان' بالعربية",
      en: "Cover of 'Ramadan Poems' in Arabic"
    }
  }
];

export default function DocGallery() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as "fr" | "ar" | "en";
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header avec image de fond */}
      <header className="relative bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/images/cheikh-bamba-historic.png"
            alt="Cheikh Ahmadou Bamba"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-700/90 to-green-600/90" />
        
        <div className="relative container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Book className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold">
                  {currentLang === "fr" && "Galerie Photos Historiques"}
                  {currentLang === "ar" && "معرض الصور التاريخية"}
                  {currentLang === "en" && "Historic Photo Gallery"}
                </h1>
                <p className="text-green-100 text-sm">
                  {t("docCenter.subtitle", "Fathul Fattah - Recherche académique")}
                </p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <a href="/catalogue" className="text-green-700 hover:text-green-800">
          ← {t("docCenter.backToCatalog", "Retour au catalogue")}
        </a>
      </div>

      {/* Gallery Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentLang === "fr" && "Collection de photos historiques"}
            {currentLang === "ar" && "مجموعة الصور التاريخية"}
            {currentLang === "en" && "Historic photo collection"}
          </h2>
          <p className="text-gray-600">
            {currentLang === "fr" && "Découvrez notre collection de photos historiques du patrimoine Mouride"}
            {currentLang === "ar" && "اكتشف مجموعتنا من الصور التاريخية للتراث المريدي"}
            {currentLang === "en" && "Discover our collection of historic photos of the Mouride heritage"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {GALLERY_IMAGES.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={image.src}
                  alt={image.title[currentLang]}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {image.title[currentLang]}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {image.description[currentLang]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter />

      {/* Modal Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.src}
              alt={selectedImage.title[currentLang]}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="bg-white p-6 rounded-b-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedImage.title[currentLang]}
              </h3>
              <p className="text-gray-700">
                {selectedImage.description[currentLang]}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
