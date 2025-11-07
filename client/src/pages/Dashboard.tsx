import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Users, FileText, Package, Activity } from "lucide-react";

export default function Dashboard() {
  // Récupérer les statistiques
  const { data: users, isLoading: loadingUsers } = trpc.users.list.useQuery();
  const { data: posts, isLoading: loadingPosts } = trpc.posts.list.useQuery();
  const { data: products, isLoading: loadingProducts } = trpc.products.list.useQuery();

  const stats = [
    {
      title: "Utilisateurs",
      value: users?.length || 0,
      description: "Utilisateurs actifs",
      icon: Users,
      loading: loadingUsers,
    },
    {
      title: "Articles",
      value: posts?.length || 0,
      description: "Articles publiés",
      icon: FileText,
      loading: loadingPosts,
    },
    {
      title: "Produits",
      value: products?.length || 0,
      description: "Produits en catalogue",
      icon: Package,
      loading: loadingProducts,
    },
    {
      title: "Activité",
      value: "24h",
      description: "Dernière activité",
      icon: Activity,
      loading: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de l'écosystème Fathul Fattah
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <div className="h-8 w-20 animate-pulse bg-muted rounded" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Articles Récents</CardTitle>
            <CardDescription>Les derniers articles publiés</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPosts ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse bg-muted rounded" />
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-4">
                {posts.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex items-start space-x-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{post.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {post.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun article</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs Récents</CardTitle>
            <CardDescription>Les derniers utilisateurs inscrits</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse bg-muted rounded" />
                ))}
              </div>
            ) : users && users.length > 0 ? (
              <div className="space-y-4">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-start space-x-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name || "Sans nom"}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun utilisateur</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
