import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Upload, Play } from "lucide-react";
import { toast } from "sonner";

export default function RadioEpisodes() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null);
  const [formData, setFormData] = useState({
    showId: 0,
    title: "",
    description: "",
    audioUrl: "",
    duration: 0,
    fileSize: 0,
    publishedAt: new Date().toISOString().split('T')[0],
    status: "draft" as "draft" | "published" | "archived",
  });

  const { data: episodes, isLoading } = trpc.radioEpisodes.list.useQuery();
  const { data: shows } = trpc.radioShows.list.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.radioEpisodes.create.useMutation({
    onSuccess: () => {
      toast.success("Épisode créé avec succès");
      utils.radioEpisodes.list.invalidate();
      setCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erreur lors de la création: " + error.message);
    },
  });

  const updateMutation = trpc.radioEpisodes.update.useMutation({
    onSuccess: () => {
      toast.success("Épisode mis à jour avec succès");
      utils.radioEpisodes.list.invalidate();
      setEditDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour: " + error.message);
    },
  });

  const deleteMutation = trpc.radioEpisodes.delete.useMutation({
    onSuccess: () => {
      toast.success("Épisode supprimé avec succès");
      utils.radioEpisodes.list.invalidate();
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      showId: 0,
      title: "",
      description: "",
      audioUrl: "",
      duration: 0,
      fileSize: 0,
      publishedAt: new Date().toISOString().split('T')[0],
      status: "draft",
    });
    setSelectedEpisode(null);
  };

  const handleCreate = () => {
    createMutation.mutate({
      ...formData,
      publishedAt: new Date(formData.publishedAt),
    });
  };

  const handleUpdate = () => {
    if (!selectedEpisode) return;
    updateMutation.mutate({
      id: selectedEpisode.id,
      ...formData,
      publishedAt: new Date(formData.publishedAt),
    });
  };

  const handleEdit = (episode: any) => {
    setSelectedEpisode(episode);
    setFormData({
      showId: episode.showId,
      title: episode.title,
      description: episode.description || "",
      audioUrl: episode.audioUrl,
      duration: episode.duration,
      fileSize: episode.fileSize || 0,
      publishedAt: new Date(episode.publishedAt).toISOString().split('T')[0],
      status: episode.status || "draft",
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet épisode ?")) {
      deleteMutation.mutate({ id });
    }
  };

  const getShowName = (showId: number) => {
    return shows?.find(s => s.id === showId)?.title || "Émission inconnue";
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "-";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      draft: { variant: "secondary", label: "Brouillon" },
      published: { variant: "default", label: "Publié" },
      archived: { variant: "outline", label: "Archivé" },
    };
    const config = variants[status] || variants.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Épisodes & Podcasts</h1>
          <p className="text-muted-foreground">
            Gérez les épisodes et podcasts de vos émissions radio
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel Épisode
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Émission</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {episodes?.map((episode) => (
                <TableRow key={episode.id}>
                  <TableCell className="font-medium">{episode.title}</TableCell>
                  <TableCell>{getShowName(episode.showId)}</TableCell>
                  <TableCell>
                    {new Date(episode.publishedAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>{formatDuration(episode.duration)}</TableCell>
                  <TableCell>{formatFileSize(episode.fileSize || 0)}</TableCell>
                  <TableCell>{getStatusBadge(episode.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {episode.audioUrl && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(episode.audioUrl, '_blank')}
                          title="Écouter"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(episode)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(episode.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog Création */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvel Épisode</DialogTitle>
            <DialogDescription>
              Créez un nouvel épisode ou podcast pour une émission
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="showId">Émission *</Label>
              <Select
                value={formData.showId.toString()}
                onValueChange={(value) => setFormData({ ...formData, showId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une émission" />
                </SelectTrigger>
                <SelectContent>
                  {shows?.map(show => (
                    <SelectItem key={show.id} value={show.id.toString()}>
                      {show.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Khassida du vendredi - Épisode 12"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Description de l'épisode..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="audioUrl">URL Audio * (S3)</Label>
              <div className="flex gap-2">
                <Input
                  id="audioUrl"
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  placeholder="https://storage.example.com/episode.mp3"
                />
                <Button variant="outline" size="icon" title="Upload vers S3">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Uploadez votre fichier audio vers S3 et collez l'URL ici
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Durée (secondes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  placeholder="Ex: 3600"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fileSize">Taille (bytes)</Label>
                <Input
                  id="fileSize"
                  type="number"
                  value={formData.fileSize}
                  onChange={(e) => setFormData({ ...formData, fileSize: parseInt(e.target.value) })}
                  placeholder="Ex: 52428800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="publishedAt">Date de publication</Label>
                <Input
                  id="publishedAt"
                  type="date"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
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
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreate} disabled={!formData.title || !formData.audioUrl || formData.showId === 0}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Édition (même structure) */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'Épisode</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Même formulaire que création */}
            <div className="grid gap-2">
              <Label htmlFor="edit-showId">Émission *</Label>
              <Select
                value={formData.showId.toString()}
                onValueChange={(value) => setFormData({ ...formData, showId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {shows?.map(show => (
                    <SelectItem key={show.id} value={show.id.toString()}>
                      {show.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-title">Titre *</Label>
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
              <Label htmlFor="edit-audioUrl">URL Audio *</Label>
              <Input
                id="edit-audioUrl"
                value={formData.audioUrl}
                onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-duration">Durée (secondes)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-fileSize">Taille (bytes)</Label>
                <Input
                  id="edit-fileSize"
                  type="number"
                  value={formData.fileSize}
                  onChange={(e) => setFormData({ ...formData, fileSize: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-publishedAt">Date</Label>
                <Input
                  id="edit-publishedAt"
                  type="date"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
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
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdate}>
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
