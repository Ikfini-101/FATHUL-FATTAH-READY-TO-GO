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
import { Plus, Pencil, Trash2, Calendar, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Events() {
  const { data: events, isLoading, refetch } = trpc.events.list.useQuery();
  const deleteMutation = trpc.events.delete.useMutation({
    onSuccess: () => {
      toast.success("Événement supprimé avec succès");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      setDeleteId(id);
      deleteMutation.mutate({ id });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
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
          <h1 className="text-3xl font-bold text-gray-900">Événements</h1>
          <p className="text-gray-600 mt-1">Gérez les événements du portail institutionnel</p>
        </div>
        <Link href="/events/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel événement
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : events && events.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre (FR)</TableHead>
                <TableHead>Date début</TableHead>
                <TableHead>Date fin</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event: any) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">
                    {event.titleI18n?.fr || 'Sans titre'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(event.startAt)}</span>
                      <span className="text-gray-400">{formatTime(event.startAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(event.endAt)}</span>
                      <span className="text-gray-400">{formatTime(event.endAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {event.location || '-'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(event.status)}`}>
                      {event.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/events/${event.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                        disabled={deleteMutation.isPending && deleteId === event.id}
                      >
                        {deleteMutation.isPending && deleteId === event.id ? (
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
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun événement</h3>
          <p className="text-gray-600 mb-6">Commencez par créer votre premier événement</p>
          <Link href="/events/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Créer un événement
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
