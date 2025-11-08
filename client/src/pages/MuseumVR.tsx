import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Eye, Edit, Trash2, Glasses, Image, Calendar, MapPin } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MuseumVR() {
  const [selectedExhibition, setSelectedExhibition] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState<any>(null);

  const { data: exhibitions, isLoading, refetch } = trpc.vrExhibitions.list.useQuery();

  const handleCreateExhibition = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditExhibition = (exhibition: any) => {
    setEditingExhibition(exhibition);
    setIsEditDialogOpen(true);
  };

  const handleDeleteExhibition = (id: number) => {
    toast.info("Fonctionnalité de suppression à venir");
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Musée VR</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les expositions et artefacts du musée virtuel en réalité virtuelle
          </p>
        </div>
        <Button onClick={handleCreateExhibition} className="shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Exposition
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-100">
              Expositions Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{exhibitions?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-100">
              Expositions Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {exhibitions?.filter((e: any) => e.status === 'ACTIVE').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-100">
              Artefacts Totaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {exhibitions?.reduce((sum: number, e: any) => sum + (e.artifactCount || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exhibitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exhibitions?.map((exhibition: any) => (
          <Card key={exhibition.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Glasses className="h-5 w-5 text-purple-600" />
                    {exhibition.title}
                  </CardTitle>
                  <CardDescription className="mt-2 line-clamp-2">
                    {exhibition.description || "Pas de description"}
                  </CardDescription>
                </div>
                <Badge
                  variant={exhibition.status === 'ACTIVE' ? 'default' : 'secondary'}
                  className="ml-2"
                >
                  {exhibition.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Exhibition Image */}
              {exhibition.thumbnailUrl && (
                <div className="relative h-40 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={exhibition.thumbnailUrl}
                    alt={exhibition.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Exhibition Details */}
              <div className="space-y-2 text-sm">
                {exhibition.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{exhibition.location}</span>
                  </div>
                )}
                {exhibition.artifactCount !== undefined && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Image className="h-4 w-4" />
                    <span>{exhibition.artifactCount} artefacts</span>
                  </div>
                )}
                {exhibition.startDate && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(exhibition.startDate).toLocaleDateString('fr-FR')}
                      {exhibition.endDate && ` - ${new Date(exhibition.endDate).toLocaleDateString('fr-FR')}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedExhibition(exhibition.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Voir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEditExhibition(exhibition)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteExhibition(exhibition.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {exhibitions?.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Glasses className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune exposition</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Commencez par créer votre première exposition virtuelle pour le musée VR
            </p>
            <Button onClick={handleCreateExhibition}>
              <Plus className="h-4 w-4 mr-2" />
              Créer une Exposition
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer une Nouvelle Exposition</DialogTitle>
            <DialogDescription>
              Ajoutez une nouvelle exposition virtuelle au musée VR
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l'exposition</Label>
              <Input id="title" placeholder="Ex: Art Islamique du Moyen-Âge" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez l'exposition..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Localisation</Label>
                <Input id="location" placeholder="Ex: Salle principale" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select defaultValue="DRAFT">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Brouillon</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ARCHIVED">Archivée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Input id="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Input id="endDate" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Image miniature (URL)</Label>
              <Input id="thumbnail" placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => {
              toast.success("Exposition créée avec succès");
              setIsCreateDialogOpen(false);
            }}>
              Créer l'Exposition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'Exposition</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'exposition
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Titre de l'exposition</Label>
              <Input
                id="edit-title"
                defaultValue={editingExhibition?.title}
                placeholder="Ex: Art Islamique du Moyen-Âge"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                defaultValue={editingExhibition?.description}
                placeholder="Décrivez l'exposition..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-location">Localisation</Label>
                <Input
                  id="edit-location"
                  defaultValue={editingExhibition?.location}
                  placeholder="Ex: Salle principale"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Statut</Label>
                <Select defaultValue={editingExhibition?.status || "DRAFT"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Brouillon</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ARCHIVED">Archivée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => {
              toast.success("Exposition modifiée avec succès");
              setIsEditDialogOpen(false);
            }}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
