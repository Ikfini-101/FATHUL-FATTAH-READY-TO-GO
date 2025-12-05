import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2, Book } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

const STATUS_COLORS = {
  draft: "bg-gray-500",
  published: "bg-green-600",
  archived: "bg-orange-600",
} as const;

const TYPE_LABELS = {
  manuscript: "Manuscrit",
  book: "Livre",
  article: "Article",
  thesis: "Thèse",
  report: "Rapport",
  audio: "Audio",
  video: "Vidéo",
  image: "Image",
  other: "Autre",
} as const;

export default function DocItems() {
  const { data: documents, isLoading, refetch } = trpc.docItems.list.useQuery();
  const deleteMutation = trpc.docItems.delete.useMutation({
    onSuccess: () => {
      toast.success("Document supprimé");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const handleDelete = (id: number, title: string) => {
    if (confirm(`Supprimer le document "${title}" ?`)) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Book className="h-8 w-8 text-primary" />
              Documents
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestion du catalogue documentaire
            </p>
          </div>
          <Link href="/doc-items/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau document
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !documents || documents.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <Book className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun document</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par créer votre premier document
            </p>
            <Link href="/doc-items/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Créer un document
              </Button>
            </Link>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Créateur</TableHead>
                  <TableHead>Langue</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      {typeof doc.titleI18n === 'string' 
                        ? JSON.parse(doc.titleI18n).fr || JSON.parse(doc.titleI18n).ar || JSON.parse(doc.titleI18n).en
                        : doc.titleI18n?.fr || doc.titleI18n?.ar || doc.titleI18n?.en || "Sans titre"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {TYPE_LABELS[doc.type as keyof typeof TYPE_LABELS]}
                      </Badge>
                    </TableCell>
                    <TableCell>{doc.creator || "—"}</TableCell>
                    <TableCell>{doc.language?.toUpperCase()}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[doc.status as keyof typeof STATUS_COLORS]}>
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/doc-items/${doc.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(doc.id, 
                            typeof doc.titleI18n === 'string' 
                              ? JSON.parse(doc.titleI18n).fr || "Document"
                              : doc.titleI18n?.fr || "Document"
                          )}
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
      </div>
    </DashboardLayout>
  );
}
