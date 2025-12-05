import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

const DOC_TYPES = [
  { value: "manuscript", label: "Manuscrit" },
  { value: "book", label: "Livre" },
  { value: "article", label: "Article" },
  { value: "thesis", label: "Thèse" },
  { value: "report", label: "Rapport" },
  { value: "audio", label: "Audio" },
  { value: "video", label: "Vidéo" },
  { value: "image", label: "Image" },
  { value: "other", label: "Autre" },
] as const;

export default function DocItemForm() {
  const [, params] = useRoute("/doc-items/:id/edit");
  const [, setLocation] = useLocation();
  const isEdit = !!params?.id;
  const docId = params?.id ? parseInt(params.id) : undefined;

  const [formData, setFormData] = useState({
    slug: "",
    titleI18n: { fr: "", ar: "", en: "" },
    descriptionI18n: { fr: "", ar: "", en: "" },
    creator: "",
    contributors: [] as string[],
    subject: [] as string[],
    date: "",
    type: "book" as any,
    language: "fr",
    rights: "",
    collection: "",
    identifiers: {
      isbn: "",
      issn: "",
      doi: "",
      custom: "",
    },
    status: "draft" as "draft" | "published" | "archived",
  });

  const { data: document, isLoading: loadingDoc } = trpc.docItems.getById.useQuery(
    { id: docId! },
    { enabled: isEdit && !!docId }
  );

  useEffect(() => {
    if (document) {
      setFormData({
        slug: document.slug,
        titleI18n: typeof document.titleI18n === 'string' 
          ? JSON.parse(document.titleI18n) 
          : document.titleI18n || { fr: "", ar: "", en: "" },
        descriptionI18n: typeof document.descriptionI18n === 'string'
          ? JSON.parse(document.descriptionI18n)
          : document.descriptionI18n || { fr: "", ar: "", en: "" },
        creator: document.creator || "",
        contributors: typeof document.contributors === 'string'
          ? JSON.parse(document.contributors)
          : document.contributors || [],
        subject: typeof document.subject === 'string'
          ? JSON.parse(document.subject)
          : document.subject || [],
        date: document.date || "",
        type: document.type,
        language: document.language,
        rights: document.rights || "",
        collection: document.collection || "",
        identifiers: typeof document.identifiers === 'string'
          ? JSON.parse(document.identifiers)
          : document.identifiers || { isbn: "", issn: "", doi: "", custom: "" },
        status: document.status,
      });
    }
  }, [document]);

  const createMutation = trpc.docItems.create.useMutation({
    onSuccess: () => {
      toast.success("Document créé");
      setLocation("/doc-items");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const updateMutation = trpc.docItems.update.useMutation({
    onSuccess: () => {
      toast.success("Document mis à jour");
      setLocation("/doc-items");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && docId) {
      updateMutation.mutate({
        id: docId,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isEdit && loadingDoc) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setLocation("/doc-items")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {isEdit ? "Modifier le document" : "Nouveau document"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="mon-document"
                  required
                />
              </div>

              {/* Titre multilingue */}
              <div className="space-y-2">
                <Label>Titre *</Label>
                <Tabs defaultValue="fr">
                  <TabsList>
                    <TabsTrigger value="fr">🇫🇷 Français</TabsTrigger>
                    <TabsTrigger value="ar">🇸🇦 العربية</TabsTrigger>
                    <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
                  </TabsList>
                  <TabsContent value="fr">
                    <Input
                      value={formData.titleI18n.fr}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          titleI18n: { ...formData.titleI18n, fr: e.target.value },
                        })
                      }
                      placeholder="Titre en français"
                    />
                  </TabsContent>
                  <TabsContent value="ar">
                    <Input
                      value={formData.titleI18n.ar}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          titleI18n: { ...formData.titleI18n, ar: e.target.value },
                        })
                      }
                      placeholder="العنوان بالعربية"
                      dir="rtl"
                    />
                  </TabsContent>
                  <TabsContent value="en">
                    <Input
                      value={formData.titleI18n.en}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          titleI18n: { ...formData.titleI18n, en: e.target.value },
                        })
                      }
                      placeholder="Title in English"
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Description multilingue */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Tabs defaultValue="fr">
                  <TabsList>
                    <TabsTrigger value="fr">🇫🇷 Français</TabsTrigger>
                    <TabsTrigger value="ar">🇸🇦 العربية</TabsTrigger>
                    <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
                  </TabsList>
                  <TabsContent value="fr">
                    <Textarea
                      value={formData.descriptionI18n.fr}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionI18n: { ...formData.descriptionI18n, fr: e.target.value },
                        })
                      }
                      placeholder="Description en français"
                      rows={4}
                    />
                  </TabsContent>
                  <TabsContent value="ar">
                    <Textarea
                      value={formData.descriptionI18n.ar}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionI18n: { ...formData.descriptionI18n, ar: e.target.value },
                        })
                      }
                      placeholder="الوصف بالعربية"
                      dir="rtl"
                      rows={4}
                    />
                  </TabsContent>
                  <TabsContent value="en">
                    <Textarea
                      value={formData.descriptionI18n.en}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionI18n: { ...formData.descriptionI18n, en: e.target.value },
                        })
                      }
                      placeholder="Description in English"
                      rows={4}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DOC_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Langue */}
                <div className="space-y-2">
                  <Label htmlFor="language">Langue *</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => setFormData({ ...formData, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Créateur */}
                <div className="space-y-2">
                  <Label htmlFor="creator">Créateur/Auteur</Label>
                  <Input
                    id="creator"
                    value={formData.creator}
                    onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                    placeholder="Nom de l'auteur"
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">Date de publication</Label>
                  <Input
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="2024"
                  />
                </div>
              </div>

              {/* Statut */}
              <div className="space-y-2">
                <Label htmlFor="status">Statut *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setLocation("/doc-items")}>
                  Annuler
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  <Save className="h-4 w-4 mr-2" />
                  {isEdit ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
