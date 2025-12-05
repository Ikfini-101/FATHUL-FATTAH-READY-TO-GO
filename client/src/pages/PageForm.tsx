import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRoute, useLocation } from "wouter";

export default function PageForm() {
  const [, params] = useRoute("/pages/:id/edit");
  const [, setLocation] = useLocation();
  const pageId = params?.id ? parseInt(params.id) : null;
  const isEdit = pageId !== null;

  const { data: page, isLoading: loadingPage } = trpc.pages.getById.useQuery(
    { id: pageId! },
    { enabled: isEdit }
  );

  const [formData, setFormData] = useState({
    slug: "",
    titleFr: "",
    titleAr: "",
    titleEn: "",
    bodyFr: "",
    bodyAr: "",
    bodyEn: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED",
  });

  useEffect(() => {
    if (page) {
      setFormData({
        slug: page.slug,
        titleFr: page.titleI18n?.fr || "",
        titleAr: page.titleI18n?.ar || "",
        titleEn: page.titleI18n?.en || "",
        bodyFr: page.bodyI18n?.fr || "",
        bodyAr: page.bodyI18n?.ar || "",
        bodyEn: page.bodyI18n?.en || "",
        status: page.status,
      });
    }
  }, [page]);

  const createMutation = trpc.pages.create.useMutation({
    onSuccess: () => {
      toast.success("Page créée avec succès");
      setLocation("/pages");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });

  const updateMutation = trpc.pages.update.useMutation({
    onSuccess: () => {
      toast.success("Page mise à jour avec succès");
      setLocation("/pages");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la mise à jour");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      slug: formData.slug,
      titleI18n: {
        fr: formData.titleFr,
        ar: formData.titleAr,
        en: formData.titleEn,
      },
      bodyI18n: {
        fr: formData.bodyFr,
        ar: formData.bodyAr,
        en: formData.bodyEn,
      },
      status: formData.status,
    };

    if (isEdit) {
      updateMutation.mutate({ id: pageId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (loadingPage) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setLocation("/pages")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? "Modifier la page" : "Nouvelle page"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? "Modifiez les informations de la page" : "Créez une nouvelle page statique multilingue"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL) *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="a-propos"
            required
          />
          <p className="text-sm text-gray-500">Utilisé dans l'URL: /portal/{formData.slug || "slug"}</p>
        </div>

        {/* Titres multilingues */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="titleFr">Titre (Français) *</Label>
            <Input
              id="titleFr"
              value={formData.titleFr}
              onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
              placeholder="Titre en français"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="titleAr">Titre (Arabe) *</Label>
            <Input
              id="titleAr"
              value={formData.titleAr}
              onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
              placeholder="العنوان بالعربية"
              required
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="titleEn">Titre (Anglais) *</Label>
            <Input
              id="titleEn"
              value={formData.titleEn}
              onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
              placeholder="Title in English"
              required
            />
          </div>
        </div>

        {/* Contenus multilingues */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bodyFr">Contenu (Français) *</Label>
            <Textarea
              id="bodyFr"
              value={formData.bodyFr}
              onChange={(e) => setFormData({ ...formData, bodyFr: e.target.value })}
              placeholder="Contenu complet en français"
              rows={12}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bodyAr">Contenu (Arabe) *</Label>
            <Textarea
              id="bodyAr"
              value={formData.bodyAr}
              onChange={(e) => setFormData({ ...formData, bodyAr: e.target.value })}
              placeholder="المحتوى الكامل بالعربية"
              rows={12}
              required
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bodyEn">Contenu (Anglais) *</Label>
            <Textarea
              id="bodyEn"
              value={formData.bodyEn}
              onChange={(e) => setFormData({ ...formData, bodyEn: e.target.value })}
              placeholder="Full content in English"
              rows={12}
              required
            />
          </div>
        </div>

        {/* Statut */}
        <div className="space-y-2">
          <Label htmlFor="status">Statut *</Label>
          <Select
            value={formData.status}
            onValueChange={(value: any) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Brouillon</SelectItem>
              <SelectItem value="PUBLISHED">Publié</SelectItem>
              <SelectItem value="ARCHIVED">Archivé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation("/pages")}
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? "Mettre à jour" : "Créer"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
