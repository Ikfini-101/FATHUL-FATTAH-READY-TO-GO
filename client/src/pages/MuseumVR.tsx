import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Glasses } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function MuseumVR() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedExhibition, setSelectedExhibition] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: "",
    vrModelUrl: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "ARCHIVED",
  });

  const { data: exhibitions, isLoading } = trpc.vrExhibitions.list.useQuery();
  const utils = trpc.useUtils();

  // Mutations
  const createMutation = trpc.vrExhibitions.create.useMutation({
    onSuccess: () => {
      toast.success("Exposition créée avec succès");
      utils.vrExhibitions.list.invalidate();
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erreur lors de la création: " + error.message);
    },
  });

  const updateMutation = trpc.vrExhibitions.update.useMutation({
    onSuccess: () => {
      toast.success("Exposition mise à jour avec succès");
      utils.vrExhibitions.list.invalidate();
      setIsEditDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour: " + error.message);
    },
  });

  const deleteMutation = trpc.vrExhibitions.delete.useMutation({
    onSuccess: () => {
      toast.success("Exposition supprimée avec succès");
      utils.vrExhibitions.list.invalidate();
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      coverImage: "",
      vrModelUrl: "",
      status: "ACTIVE",
    });
    setSelectedExhibition(null);
  };

  const handleCreate = () => {
    if (!formData.title) {
      toast.error("Veuillez remplir le titre");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (!selectedExhibition) return;
    updateMutation.mutate({
      id: selectedExhibition.id,
      ...formData,
    });
  };

  const handleEdit = (exhibition: any) => {
    setSelectedExhibition(exhibition);
    setFormData({
      title: exhibition.title,
      description: exhibition.description || "",
      coverImage: exhibition.thumbnailUrl || "",
      vrModelUrl: exhibition.sceneUrl || "",
      status: "ACTIVE",
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette exposition ?")) {
      deleteMutation.mutate({ id });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  const totalExhibitions = exhibitions?.length || 0;
  const activeExhibitions = 0; // À implémenter avec le statut
  const totalArtifacts = 0; // À implémenter avec la relation

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-6">
      {/* Header - Mobile: empilé, Desktop: côte à côte */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Musée VR</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Gérez les expositions et artefacts du musée virtuel en réalité virtuelle
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full sm:w-auto min-h-[44px] shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Exposition
        </Button>
      </div>

      {/* Cartes statistiques - Mobile: 1 col, Tablette: 2 cols, Desktop: 3 cols */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Expositions Totales</CardTitle>
            <div className="text-4xl font-bold mt-2">{totalExhibitions}</div>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Expositions Actives</CardTitle>
            <div className="text-4xl font-bold mt-2">{activeExhibitions}</div>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Artefacts Totaux</CardTitle>
            <div className="text-4xl font-bold mt-2">{totalArtifacts}</div>
          </CardHeader>
        </Card>
      </div>

      {/* Liste des expositions */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardTitle className="flex items-center gap-2">
            <Glasses className="h-5 w-5 text-purple-600" />
            Expositions VR
          </CardTitle>
          <CardDescription>
            {totalExhibitions} exposition(s) au total
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {exhibitions && exhibitions.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {exhibitions.map((exhibition: any) => (
                <Card key={exhibition.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {exhibition.thumbnailUrl && (
                    <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      <Glasses className="h-16 w-16 text-purple-400" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{exhibition.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {exhibition.description || "Pas de description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(exhibition)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(exhibition.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Glasses className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune exposition</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par créer votre première exposition virtuelle pour le musée VR
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une Exposition
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de création */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvelle exposition VR</DialogTitle>
            <DialogDescription>
              Créez une nouvelle exposition pour le musée virtuel
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre de l'exposition *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Art Africain Contemporain"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez l'exposition..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="coverImage">Image de couverture (URL)</Label>
              <Input
                id="coverImage"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vrModelUrl">URL de la scène VR</Label>
              <Input
                id="vrModelUrl"
                value={formData.vrModelUrl}
                onChange={(e) => setFormData({ ...formData, vrModelUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Création..." : "Créer l'exposition"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog d'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'exposition</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'exposition
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Titre de l'exposition *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-coverImage">Image de couverture (URL)</Label>
              <Input
                id="edit-coverImage"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-vrModelUrl">URL de la scène VR</Label>
              <Input
                id="edit-vrModelUrl"
                value={formData.vrModelUrl}
                onChange={(e) => setFormData({ ...formData, vrModelUrl: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
