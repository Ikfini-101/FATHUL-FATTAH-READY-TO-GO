import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  File,
  Trash2,
  Download,
  ExternalLink,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload";

export default function MediaLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const { data: mediaFiles, isLoading, refetch } = trpc.media.list.useQuery();

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return ImageIcon;
    if (mimeType.startsWith("video/")) return Film;
    if (mimeType.startsWith("audio/")) return Music;
    if (mimeType.includes("pdf")) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleUploadComplete = (url: string) => {
    setUploadedFile(url);
    toast.success("Fichier uploadé avec succès");
    refetch();
    setIsUploadDialogOpen(false);
  };

  const handleDeleteMedia = (id: number) => {
    toast.info("Fonctionnalité de suppression à venir");
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copiée dans le presse-papiers");
  };

  const filteredMedia = mediaFiles?.filter((media: any) =>
    media.filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    media.altText?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
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
          <h1 className="text-3xl font-bold tracking-tight">Bibliothèque de Médias</h1>
          <p className="text-muted-foreground mt-1">
            Gérez tous vos fichiers images, vidéos et documents
          </p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)} className="shadow-lg">
          <Upload className="h-4 w-4 mr-2" />
          Uploader des Fichiers
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Total Fichiers</p>
                <p className="text-2xl font-bold">{mediaFiles?.length || 0}</p>
              </div>
              <File className="h-8 w-8 text-blue-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">Images</p>
                <p className="text-2xl font-bold">
                  {mediaFiles?.filter((m: any) => m.mimeType?.startsWith("image/")).length || 0}
                </p>
              </div>
              <ImageIcon className="h-8 w-8 text-purple-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-100">Vidéos</p>
                <p className="text-2xl font-bold">
                  {mediaFiles?.filter((m: any) => m.mimeType?.startsWith("video/")).length || 0}
                </p>
              </div>
              <Film className="h-8 w-8 text-orange-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-100">Documents</p>
                <p className="text-2xl font-bold">
                  {mediaFiles?.filter((m: any) => !m.mimeType?.startsWith("image/") && !m.mimeType?.startsWith("video/")).length || 0}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher des fichiers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia?.map((media: any) => {
          const FileIconComponent = getFileIcon(media.mimeType);
          const isImage = media.mimeType?.startsWith("image/");

          return (
            <Card
              key={media.id}
              className="group hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              onClick={() => setSelectedMedia(media)}
            >
              <div className="aspect-square relative bg-muted">
                {isImage ? (
                  <img
                    src={media.url}
                    alt={media.altText || media.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileIconComponent className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(media.url);
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(media.url, "_blank");
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMedia(media.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{media.filename}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(media.fileSize || 0)}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {media.mimeType?.split("/")[0]}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredMedia?.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? "Aucun fichier trouvé" : "Aucun fichier"}
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {searchQuery
                ? "Essayez avec d'autres mots-clés"
                : "Commencez par uploader vos premiers fichiers"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Uploader des Fichiers
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Uploader des Fichiers</DialogTitle>
            <DialogDescription>
              Glissez-déposez vos fichiers ou cliquez pour sélectionner
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ImageUpload
              onUploadComplete={handleUploadComplete}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Media Details Dialog */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails du Fichier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMedia?.mimeType?.startsWith("image/") && (
              <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.altText || selectedMedia.filename}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nom du fichier</Label>
                <p className="text-sm mt-1">{selectedMedia?.filename}</p>
              </div>
              <div>
                <Label>Type</Label>
                <p className="text-sm mt-1">{selectedMedia?.mimeType}</p>
              </div>
              <div>
                <Label>Taille</Label>
                <p className="text-sm mt-1">{formatFileSize(selectedMedia?.fileSize || 0)}</p>
              </div>
              <div>
                <Label>Date d'upload</Label>
                <p className="text-sm mt-1">
                  {selectedMedia?.createdAt
                    ? new Date(selectedMedia.createdAt).toLocaleDateString("fr-FR")
                    : "-"}
                </p>
              </div>
            </div>
            <div>
              <Label>URL</Label>
              <div className="flex gap-2 mt-1">
                <Input value={selectedMedia?.url} readOnly className="flex-1" />
                <Button
                  variant="outline"
                  onClick={() => handleCopyUrl(selectedMedia?.url)}
                >
                  Copier
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedMedia(null)}>
              Fermer
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteMedia(selectedMedia?.id);
                setSelectedMedia(null);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
