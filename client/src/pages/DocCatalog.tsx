import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Book, Filter, Loader2 } from "lucide-react";
import PublicFooter from "@/components/PublicFooter";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const TYPE_LABELS: Record<string, { fr: string; ar: string; en: string }> = {
  manuscript: { fr: "Manuscrit", ar: "مخطوطة", en: "Manuscript" },
  book: { fr: "Livre", ar: "كتاب", en: "Book" },
  article: { fr: "Article", ar: "مقالة", en: "Article" },
  thesis: { fr: "Thèse", ar: "أطروحة", en: "Thesis" },
  report: { fr: "Rapport", ar: "تقرير", en: "Report" },
  audio: { fr: "Audio", ar: "صوت", en: "Audio" },
  video: { fr: "Vidéo", ar: "فيديو", en: "Video" },
  image: { fr: "Image", ar: "صورة", en: "Image" },
  other: { fr: "Autre", ar: "آخر", en: "Other" },
};

export default function DocCatalog() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as "fr" | "ar" | "en";

  const [filters, setFilters] = useState({
    query: "",
    creator: "",
    type: "all",
    language: "all",
    limit: 20,
    offset: 0,
  });

  const { data: documents, isLoading } = trpc.docCatalog.search.useQuery(filters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, offset: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header avec image de fond */}
      <header className="relative bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg overflow-hidden">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0 opacity-20">
          <img
            src="/images/cheikh-bamba-historic.png"
            alt="Cheikh Ahmadou Bamba"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-700/90 to-green-600/90" />
        
        {/* Contenu du header */}
        <div className="relative container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Book className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold">
                  {t("docCenter.title", "Centre de Documentation")}
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

      {/* Hero Section avec présentation */}
      <div className="relative bg-gradient-to-r from-amber-50 via-green-50 to-amber-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Texte de présentation */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-green-800">
                {t("docCenter.heroTitle", "Préserver et Partager le Patrimoine Mouride")}
              </h2>
              <div className="prose prose-lg text-gray-700 space-y-4">
                <p>
                  {t(
                    "docCenter.heroIntro",
                    "Le Centre de Documentation Fathul Fattah est une initiative du Musée de Touba en partenariat avec l'Université Cheikh Ahmadou Bamba Khadim Rassoul (CCAK). Notre mission est de collecter, préserver et rendre accessible le riche patrimoine intellectuel et spirituel du Mouridisme."
                  )}
                </p>
                <p>
                  {t(
                    "docCenter.heroMission",
                    "Nous offrons aux chercheurs, étudiants et passionnés un accès privilégié à des manuscrits rares, khassaides, ouvrages historiques et documents d'archives relatifs à Cheikh Ahmadou Bamba et à la confrérie Mouride."
                  )}
                </p>
                <div className="flex gap-4 pt-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <Book className="h-5 w-5" />
                    <span className="font-semibold">{t("docCenter.manuscripts", "Manuscrits rares")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-700">
                    <Book className="h-5 w-5" />
                    <span className="font-semibold">{t("docCenter.khassaides", "Khassaides")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Images illustratives */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="/images/cheikh-bamba-historic.png"
                  alt="Cheikh Ahmadou Bamba - Photo historique"
                  className="rounded-lg shadow-xl w-full h-64 object-cover border-4 border-amber-200 bg-amber-50"
                />
                <div className="bg-green-700 text-white p-4 rounded-lg shadow-lg">
                  <p className="text-sm font-semibold">{t("docCenter.partnership", "En partenariat avec")}</p>
                  <p className="text-xs mt-1">{t("docCenter.partners", "Musée de Touba • Université CCAK")}</p>
                </div>
              </div>
              <div className="mt-8">
                <img
                  src="/images/poemes-ramadan-fr.png"
                  alt="Couverture Poèmes du Ramadan"
                  className="rounded-lg shadow-xl w-full h-80 object-cover border-4 border-green-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Bouton Galerie */}
        <div className="mb-6 flex justify-end">
          <Link href="/galerie">
            <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
              <Book className="h-4 w-4 mr-2" />
              {currentLang === "fr" && "Galerie Photos"}
              {currentLang === "ar" && "معرض الصور"}
              {currentLang === "en" && "Photo Gallery"}
            </Button>
          </Link>
        </div>

        {/* Barre de recherche */}
        <Card className="mb-8 border-green-200 shadow-md">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      value={filters.query}
                      onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                      placeholder={t("docCenter.searchPlaceholder", "Rechercher un document...")}
                      className="pl-10 h-12 border-green-300 focus:border-green-500"
                    />
                  </div>
                </div>
                <Button type="submit" size="lg" className="bg-green-600 hover:bg-green-700">
                  <Search className="h-5 w-5 mr-2" />
                  {t("docCenter.search", "Rechercher")}
                </Button>
              </div>

              {/* Filtres */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {t("docCenter.filterType", "Type de document")}
                  </label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) => setFilters({ ...filters, type: value })}
                  >
                    <SelectTrigger className="border-green-300">
                      <SelectValue placeholder={t("docCenter.allTypes", "Tous les types")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("docCenter.allTypes", "Tous les types")}
                      </SelectItem>
                      {Object.entries(TYPE_LABELS).map(([value, labels]) => (
                        <SelectItem key={value} value={value}>
                          {labels[currentLang]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("docCenter.filterLanguage", "Langue")}
                  </label>
                  <Select
                    value={filters.language}
                    onValueChange={(value) => setFilters({ ...filters, language: value })}
                  >
                    <SelectTrigger className="border-green-300">
                      <SelectValue placeholder={t("docCenter.allLanguages", "Toutes les langues")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("docCenter.allLanguages", "Toutes les langues")}
                      </SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("docCenter.filterCreator", "Auteur/Créateur")}
                  </label>
                  <Input
                    value={filters.creator}
                    onChange={(e) => setFilters({ ...filters, creator: e.target.value })}
                    placeholder={t("docCenter.creatorPlaceholder", "Nom de l'auteur")}
                    className="border-green-300"
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Résultats */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : !documents || documents.length === 0 ? (
          <Card className="text-center py-12 border-green-200">
            <CardContent>
              <Book className="h-16 w-16 mx-auto text-green-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t("docCenter.noResults", "Aucun document trouvé")}
              </h3>
              <p className="text-muted-foreground">
                {t("docCenter.tryDifferentSearch", "Essayez avec d'autres critères de recherche")}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => {
              const titleI18n = typeof doc.titleI18n === 'string' 
                ? JSON.parse(doc.titleI18n) 
                : doc.titleI18n;
              const descriptionI18n = typeof doc.descriptionI18n === 'string'
                ? JSON.parse(doc.descriptionI18n)
                : doc.descriptionI18n;

              return (
                <Link key={doc.id} href={`/catalogue/${doc.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-green-200 hover:border-green-400">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-green-600">
                          {TYPE_LABELS[doc.type]?.[currentLang] || doc.type}
                        </Badge>
                        <Badge variant="outline" className="border-green-300">
                          {doc.language?.toUpperCase()}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">
                        {titleI18n?.[currentLang] || titleI18n?.fr || titleI18n?.en || "Sans titre"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {descriptionI18n?.[currentLang] || descriptionI18n?.fr || ""}
                      </p>
                      {doc.creator && (
                        <p className="text-sm font-medium text-green-700">
                          {doc.creator}
                        </p>
                      )}
                      {doc.date && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {doc.date}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <PublicFooter />
    </div>
  );
}
