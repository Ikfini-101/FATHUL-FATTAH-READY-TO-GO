import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Clock, CheckCircle2, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

type ReproStatus = "received" | "processing" | "delivered";

const statusLabels: Record<ReproStatus, string> = {
  received: "Reçu",
  processing: "En traitement",
  delivered: "Livré",
};

const statusColors: Record<ReproStatus, string> = {
  received: "bg-blue-100 text-blue-800",
  processing: "bg-amber-100 text-amber-800",
  delivered: "bg-green-100 text-green-800",
};

const statusIcons: Record<ReproStatus, React.ReactNode> = {
  received: <Clock className="h-4 w-4" />,
  processing: <Loader2 className="h-4 w-4" />,
  delivered: <CheckCircle2 className="h-4 w-4" />,
};

export default function DocRepro() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: requests, isLoading, refetch } = trpc.docRepro.list.useQuery();
  const updateStatusMutation = trpc.docRepro.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Statut mis à jour avec succès");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la mise à jour du statut");
    },
  });

  const filteredRequests = requests?.filter((req) =>
    statusFilter === "all" ? true : req.status === statusFilter
  );

  const handleStatusChange = (requestId: number, newStatus: ReproStatus) => {
    updateStatusMutation.mutate({ id: requestId, status: newStatus });
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusCount = (status: ReproStatus) => {
    return requests?.filter((req) => req.status === status).length || 0;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Demandes de Reprographie
            </h1>
            <p className="text-gray-600 mt-1">
              Gérer les demandes de reproduction de documents
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reçues</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {getStatusCount("received")}
                  </p>
                </div>
                <Clock className="h-12 w-12 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En traitement</p>
                  <p className="text-3xl font-bold text-amber-700">
                    {getStatusCount("processing")}
                  </p>
                </div>
                <Loader2 className="h-12 w-12 text-amber-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Livrées</p>
                  <p className="text-3xl font-bold text-green-700">
                    {getStatusCount("delivered")}
                  </p>
                </div>
                <CheckCircle2 className="h-12 w-12 text-green-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                Filtrer par statut :
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="received">Reçues</SelectItem>
                  <SelectItem value="processing">En traitement</SelectItem>
                  <SelectItem value="delivered">Livrées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des demandes */}
        <Card className="border-gray-200 shadow-md">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <Copy className="h-5 w-5" />
              Demandes ({filteredRequests?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : filteredRequests && filteredRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Demandeur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Objectif</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request: any) => (
                      <TableRow key={request.id}>
                        <TableCell className="text-sm">
                          {formatDate(request.createdAt)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {request.requesterName}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {request.requesterEmail}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {request.docItem ? (
                            <>
                              {JSON.parse(request.docItem.titleI18n).fr}
                              <span className="text-xs text-gray-500 block">
                                {request.docItem.creator}
                              </span>
                            </>
                          ) : (
                            "Document inconnu"
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-sm">
                          {request.purpose || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`flex items-center gap-1 w-fit ${
                              statusColors[request.status as ReproStatus]
                            }`}
                          >
                            {statusIcons[request.status as ReproStatus]}
                            {statusLabels[request.status as ReproStatus]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={request.status}
                            onValueChange={(value) =>
                              handleStatusChange(request.id, value as ReproStatus)
                            }
                          >
                            <SelectTrigger className="w-[140px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="received">Reçu</SelectItem>
                              <SelectItem value="processing">
                                En traitement
                              </SelectItem>
                              <SelectItem value="delivered">Livré</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Aucune demande</p>
                <p className="text-sm mt-1">
                  {statusFilter === "all"
                    ? "Aucune demande de reprographie enregistrée"
                    : `Aucune demande avec le statut "${statusLabels[statusFilter as ReproStatus]}"`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
