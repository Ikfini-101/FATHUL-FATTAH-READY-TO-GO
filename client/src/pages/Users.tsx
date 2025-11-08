import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { Pagination } from "@/components/Pagination";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { UserPlus, Shield } from "lucide-react";
import { toast } from "sonner";

export default function Users() {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const utils = trpc.useUtils();

  // Récupérer les données avec recherche et pagination
  const { data, isLoading } = trpc.users.list.useQuery({
    search: searchQuery || undefined,
    page,
    limit: pageSize,
  });
  const users = data?.users || [];
  const { data: roles } = trpc.roles.list.useQuery();
  const { data: userWithRoles } = trpc.users.getById.useQuery(
    { id: selectedUser! },
    { enabled: selectedUser !== null }
  );

  // Mutations
  const assignRole = trpc.users.assignRole.useMutation({
    onSuccess: () => {
      toast.success("Rôle assigné avec succès");
      utils.users.getById.invalidate();
      utils.users.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const removeRole = trpc.users.removeRole.useMutation({
    onSuccess: () => {
      toast.success("Rôle retiré avec succès");
      utils.users.getById.invalidate();
      utils.users.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAssignRole = (roleId: number) => {
    if (!selectedUser) return;
    assignRole.mutate({ userId: selectedUser, roleId });
  };

  const handleRemoveRole = (roleId: number) => {
    if (!selectedUser) return;
    removeRole.mutate({ userId: selectedUser, roleId });
  };

  return (
    <div className="space-y-8">
      {/* Header avec recherche */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les utilisateurs et leurs rôles
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Nouvel utilisateur
        </Button>
      </div>

      {/* Barre de recherche */}
      <SearchBar
        placeholder="Rechercher par nom ou email..."
        onSearch={(query) => {
          setSearchQuery(query);
          setPage(1); // Réinitialiser à la page 1
        }}
      />

      {/* Users Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-violet-600" />
            Liste des utilisateurs
          </CardTitle>
          <CardDescription>
            {data?.total || 0} utilisateur(s) au total
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 animate-pulse bg-gradient-to-r from-muted to-muted/50 rounded-lg" />
              ))}
            </div>
          ) : users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || "Sans nom"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.lastSignedIn
                        ? new Date(user.lastSignedIn).toLocaleDateString("fr-FR")
                        : "Jamais"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user.id)}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Gérer les rôles
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Gérer les rôles</DialogTitle>
                            <DialogDescription>
                              Assignez ou retirez des rôles pour {user.name || user.email}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            {roles?.map((role) => {
                              const hasRole = userWithRoles?.roles?.some(
                                (r) => r.id === role.id
                              );
                              return (
                                <div
                                  key={role.id}
                                  className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                  <div>
                                    <p className="font-medium">{role.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {role.description}
                                    </p>
                                  </div>
                                  <Button
                                    variant={hasRole ? "destructive" : "default"}
                                    size="sm"
                                    onClick={() =>
                                      hasRole
                                        ? handleRemoveRole(role.id)
                                        : handleAssignRole(role.id)
                                    }
                                    disabled={assignRole.isPending || removeRole.isPending}
                                  >
                                    {hasRole ? "Retirer" : "Assigner"}
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">Aucun utilisateur</p>
          )}
          
          {/* Pagination */}
          {data && data.total > 0 && (
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              pageSize={pageSize}
              totalItems={data.total}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
