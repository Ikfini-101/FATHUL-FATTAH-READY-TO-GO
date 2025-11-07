import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Shield, Lock } from "lucide-react";

export default function Roles() {
  // Récupérer les rôles et permissions
  const { data: roles, isLoading: loadingRoles } = trpc.roles.list.useQuery();
  const { data: permissions, isLoading: loadingPermissions } = trpc.permissions.list.useQuery();

  // Grouper les permissions par ressource
  const groupedPermissions = permissions?.reduce((acc, perm) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = [];
    }
    acc[perm.resource].push(perm);
    return acc;
  }, {} as Record<string, typeof permissions>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rôles & Permissions</h1>
        <p className="text-muted-foreground mt-2">
          Système de contrôle d'accès basé sur les rôles (RBAC)
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Rôles */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Rôles</h2>
          {loadingRoles ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse bg-muted rounded" />
              ))}
            </div>
          ) : roles && roles.length > 0 ? (
            <div className="space-y-4">
              {roles.map((role) => (
                <Card key={role.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg capitalize">{role.name}</CardTitle>
                        <CardDescription>{role.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Créé le {new Date(role.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">Aucun rôle</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Permissions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Permissions</h2>
          {loadingPermissions ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 animate-pulse bg-muted rounded" />
              ))}
            </div>
          ) : groupedPermissions && Object.keys(groupedPermissions).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([resource, perms]) => (
                <Card key={resource} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                        <Lock className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg capitalize">{resource}</CardTitle>
                        <CardDescription>{perms.length} permission(s)</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {perms.map((perm) => (
                        <Badge key={perm.id} variant="outline">
                          {perm.action}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 space-y-2">
                      {perms.map((perm) => (
                        <div key={perm.id} className="text-sm">
                          <span className="font-medium">{perm.name}</span>
                          <span className="text-muted-foreground"> - {perm.description}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">Aucune permission</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle>Statistiques du Système RBAC</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Rôles</p>
              <p className="text-3xl font-bold">{roles?.length || 0}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Permissions</p>
              <p className="text-3xl font-bold">{permissions?.length || 0}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Ressources Protégées</p>
              <p className="text-3xl font-bold">
                {groupedPermissions ? Object.keys(groupedPermissions).length : 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
