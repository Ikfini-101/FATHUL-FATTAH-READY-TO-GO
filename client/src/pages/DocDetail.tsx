import { useRoute, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Book,
  Calendar,
  User,
  Globe,
  FileText,
  Download,
  Loader2,
} from "lucide-react";
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

export default function DocDetail() {
  const [, params] = useRoute("/catalogue/:slug");
  const [, setLocation] = useLocation();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as "fr" | "ar" | "en";

  const { data: document, isLoading } = trpc.docCatalog.getBySlug.useQuery(
    { slug: params!.slug },
    { enabled: !!params?.slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <Book className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t("docCenter.notFound", "Document non trouvé")}
            </h3>
            <Button onClick={() => setLocation("/catalogue")} className="mt-4">
              {t("docCenter.backToCatalog", "Retour au catalogue")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const titleI18n = typeof document.titleI18n === 'string' 
    ? JSON.parse(document.titleI18n) 
    : document.titleI18n;
  const descriptionI18n = typeof document.descriptionI18n === 'string'
    ? JSON.parse(document.descriptionI18n)
    : document.descriptionI18n;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setLocation("/catalogue")}
                className="text-white hover:bg-green-600"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t("docCenter.back", "Retour")}
              </Button>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Métadonnées */}
          <div className="lg:col-span-1">
            <Card className="border-green-200 sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  {t("docCenter.metadata", "Métadonnées")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t("docCenter.type", "Type")}
                  </label>
                  <div className="mt-1">
                    <Badge className="bg-green-600">
                      {TYPE_LABELS[document.type]?.[currentLang] || document.type}
                    </Badge>
                  </div>
                </div>

                {document.creator && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t("docCenter.creator", "Créateur/Auteur")}
                    </label>
                    <p className="mt-1 font-medium">{document.creator}</p>
                  </div>
                )}

                {document.date && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t("docCenter.date", "Date")}
                    </label>
                    <p className="mt-1">{document.date}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {t("docCenter.language", "Langue")}
                  </label>
                  <p className="mt-1">{document.language?.toUpperCase()}</p>
                </div>

                {document.collection && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t("docCenter.collection", "Collection")}
                    </label>
                    <p className="mt-1">{document.collection}</p>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    {t("docCenter.download", "Télécharger")}
                  </Button>
                  <Button variant="outline" className="w-full border-green-300 hover:bg-green-50">
                    {t("docCenter.requestRepro", "Demander une reprographie")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <Card className="border-green-200">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">
                      {titleI18n?.[currentLang] || titleI18n?.fr || titleI18n?.en || "Sans titre"}
                    </h1>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {descriptionI18n?.[currentLang] && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      {t("docCenter.description", "Description")}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {descriptionI18n[currentLang]}
                    </p>
                  </div>
                )}

                <Separator />

                {/* Visionneuse PDF (placeholder) */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {t("docCenter.preview", "Aperçu")}
                  </h3>
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <Book className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-muted-foreground">
                      {t("docCenter.previewPlaceholder", "Visionneuse de document (PDF/Image)")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t("docCenter.uploadFileHint", "Les fichiers seront affichés ici une fois uploadés")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; 2025 Hizbut Tarqiyyah
          </p>
        </div>
      </footer>
    </div>
  );
}
