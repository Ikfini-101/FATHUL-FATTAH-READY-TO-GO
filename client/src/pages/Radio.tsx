import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Plus, Pencil, Trash2, Radio as RadioIcon, Mic } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Radio() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    hostName: "",
    category: "",
    duration: 60,
    coverImage: "",
    status: "draft" as "draft" | "published" | "archived",
  });

  // Récupérer les émissions radio
  const { data: shows, isLoading } = trpc.radioShows.list.useQuery();
  const utils = trpc.useUtils();

  // Mutations
  const createMutation = trpc.radioShows.create.useMutation({
    onSuccess: () => {
      toast.success("Émission créée avec succès");
      utils.radioShows.list.invalidate();
      setCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erreur lors de la création: " + error.message);
    },
  });

  const updateMutation = trpc.radioShows.update.useMutation({
    onSuccess: () => {
      toast.success("Émission mise à jour avec succès");
      utils.radioShows.list.invalidate();
      setEditDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour: " + error.message);
    },
  });

  const deleteMutation = trpc.radioShows.delete.useMutation({
    onSuccess: () => {
      toast.success("Émission supprimée avec succès");
      utils.radioShows.list.invalidate();
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      hostName: "",
      category: "",
      duration: 60,
      coverImage: "",
      status: "draft",
    });
    setSelectedShow(null);
  };

  const handleCreate = () => {
    if (!formData.title || !formData.hostName) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (!selectedShow) return;
    updateMutation.mutate({
      id: selectedShow.id,
      ...formData,
    });
  };

  const handleEdit = (show: any) => {
    setSelectedShow(show);
    setFormData({
      title: show.title,
      description: show.description || "",
      hostName: show.hostName || "",
      category: show.category || "",
      duration: show.duration || 60,
      coverImage: show.coverImage || "",
      status: show.status || "draft",
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette émission ?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-6">
      {/* Header - Mobile: empilé, Desktop: côte à côte */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">E-Radio</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Gérez les émissions et épisodes radio
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="w-full sm:w-auto min-h-[44px]">
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle émission
        </Button>
      </div>

      {/* Émissions Radio */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50">
          <CardTitle className="flex items-center gap-2">
            <RadioIcon className="h-5 w-5 text-amber-700" />
            Émissions Radio
          </CardTitle>
          <CardDescription>
            {shows?.length || 0} émission(s) au total
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse bg-muted rounded" />
              ))}
            </div>
          ) : shows && shows.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Émission</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Horaire</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shows.map((show: any) => (
                  <TableRow key={show.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Mic className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p>{show.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {show.hostName || "Pas d'animateur"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {show.description || "Pas de description"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {show.category || "Non défini"}
                      </p>
                      {show.duration && (
                        <p className="text-xs text-muted-foreground">
                          {show.duration} min
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(show)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(show.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <RadioIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune émission radio</p>
              <Button 
                className="mt-4" 
                variant="outline"
                onClick={() => setCreateDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Créer votre première émission
              </Button>
            </div>
          )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de création */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvelle émission radio</DialogTitle>
            <DialogDescription>
              Créez une nouvelle émission pour votre radio
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre de l'émission *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Le matin avec vous"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hostName">Animateur *</Label>
              <Input
                id="hostName"
                value={formData.hostName}
                onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                placeholder="Ex: Jean Dupont"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez l'émission..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Spirituel, Culturel, Éducatif"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                />
              </div>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Création..." : "Créer l'émission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog d'édition */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'émission</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'émission
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Titre de l'émission *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-hostName">Animateur *</Label>
              <Input
                id="edit-hostName"
                value={formData.hostName}
                onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Catégorie</Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Spirituel, Culturel, Éducatif"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-duration">Durée (minutes)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-coverImage">Image de couverture (URL)</Label>
              <Input
                id="edit-coverImage"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
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
