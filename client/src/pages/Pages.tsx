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
import { Plus, Pencil, Trash2, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Pages() {
  const { data: pages, isLoading, refetch } = trpc.pages.list.useQuery();
  const deleteMutation = trpc.pages.delete.useMutation({
    onSuccess: () => {
      toast.success("Page supprimée avec succès");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette page ?")) {
      setDeleteId(id);
      deleteMutation.mutate({ id });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PUBLISHED: "bg-green-100 text-green-800",
      DRAFT: "bg-gray-100 text-gray-800",
      ARCHIVED: "bg-red-100 text-red-800",
    };
    return styles[status as keyof typeof styles] || styles.DRAFT;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages Statiques</h1>
          <p className="text-gray-600 mt-1">Gérez les pages statiques du portail institutionnel</p>
        </div>
        <Link href="/pages/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle page
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : pages && pages.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre (FR)</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page: any) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">
                    {page.titleI18n?.fr || 'Sans titre'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    /{page.slug}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(page.status)}`}>
                      {page.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(page.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/pages/${page.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(page.id)}
                        disabled={deleteMutation.isPending && deleteId === page.id}
                      >
                        {deleteMutation.isPending && deleteId === page.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-600" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune page</h3>
          <p className="text-gray-600 mb-6">Commencez par créer votre première page statique</p>
          <Link href="/pages/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Créer une page
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
