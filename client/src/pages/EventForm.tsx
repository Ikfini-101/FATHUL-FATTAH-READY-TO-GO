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

export default function EventForm() {
  const [, params] = useRoute("/events/:id/edit");
  const [, setLocation] = useLocation();
  const eventId = params?.id ? parseInt(params.id) : null;
  const isEdit = eventId !== null;

  const { data: event, isLoading: loadingEvent } = trpc.events.getById.useQuery(
    { id: eventId! },
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
    startAt: "",
    endAt: "",
    location: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED",
  });

  useEffect(() => {
    if (event) {
      setFormData({
        slug: event.slug,
        titleFr: event.titleI18n?.fr || "",
        titleAr: event.titleI18n?.ar || "",
        titleEn: event.titleI18n?.en || "",
        bodyFr: event.bodyI18n?.fr || "",
        bodyAr: event.bodyI18n?.ar || "",
        bodyEn: event.bodyI18n?.en || "",
        startAt: new Date(event.startAt).toISOString().slice(0, 16),
        endAt: new Date(event.endAt).toISOString().slice(0, 16),
        location: event.location || "",
        status: event.status,
      });
    }
  }, [event]);

  const createMutation = trpc.events.create.useMutation({
    onSuccess: () => {
      toast.success("Événement créé avec succès");
      setLocation("/events");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });

  const updateMutation = trpc.events.update.useMutation({
    onSuccess: () => {
      toast.success("Événement mis à jour avec succès");
      setLocation("/events");
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
      startAt: new Date(formData.startAt),
      endAt: new Date(formData.endAt),
      location: formData.location || undefined,
      status: formData.status,
    };

    if (isEdit) {
      updateMutation.mutate({ id: eventId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (loadingEvent) {
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
        <Button variant="outline" onClick={() => setLocation("/events")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? "Modifier l'événement" : "Nouvel événement"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? "Modifiez les informations de l'événement" : "Créez un nouvel événement multilingue"}
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
            placeholder="conference-mouridisme-2025"
            required
          />
          <p className="text-sm text-gray-500">Utilisé dans l'URL: /portal/events/{formData.slug || "slug"}</p>
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

        {/* Descriptions multilingues */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bodyFr">Description (Français) *</Label>
            <Textarea
              id="bodyFr"
              value={formData.bodyFr}
              onChange={(e) => setFormData({ ...formData, bodyFr: e.target.value })}
              placeholder="Description complète en français"
              rows={6}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bodyAr">Description (Arabe) *</Label>
            <Textarea
              id="bodyAr"
              value={formData.bodyAr}
              onChange={(e) => setFormData({ ...formData, bodyAr: e.target.value })}
              placeholder="الوصف الكامل بالعربية"
              rows={6}
              required
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bodyEn">Description (Anglais) *</Label>
            <Textarea
              id="bodyEn"
              value={formData.bodyEn}
              onChange={(e) => setFormData({ ...formData, bodyEn: e.target.value })}
              placeholder="Full description in English"
              rows={6}
              required
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startAt">Date et heure de début *</Label>
            <Input
              id="startAt"
              type="datetime-local"
              value={formData.startAt}
              onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endAt">Date et heure de fin *</Label>
            <Input
              id="endAt"
              type="datetime-local"
              value={formData.endAt}
              onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Lieu */}
        <div className="space-y-2">
          <Label htmlFor="location">Lieu</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Centre Culturel Fathul Fattah, Dakar"
          />
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
            onClick={() => setLocation("/events")}
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
