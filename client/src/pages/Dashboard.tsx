import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Users, FileText, Package, TrendingUp, Activity, ShoppingBag } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, AreaChart, Area } from "recharts";

// Données de démonstration pour les graphiques
const trendData = [
  { value: 20 },
  { value: 35 },
  { value: 28 },
  { value: 45 },
  { value: 38 },
  { value: 52 },
  { value: 48 },
];

const activityData = [
  { value: 30 },
  { value: 45 },
  { value: 35 },
  { value: 55 },
  { value: 42 },
  { value: 60 },
  { value: 50 },
  { value: 65 },
];

export default function Dashboard() {
  // Récupérer les statistiques
  const { data: usersData } = trpc.users.list.useQuery();
  const users = usersData?.users || [];
  const { data: postsData } = trpc.posts.list.useQuery();
  const posts = postsData?.posts || [];
  const { data: productsData } = trpc.products.list.useQuery();
  const products = productsData || [];

  // Calculer les statistiques
  const totalUsers = usersData?.total || 0;
  const publishedPosts = posts.filter((p: any) => p.status === "PUBLISHED").length || 0;
  const totalProducts = products.length || 0;
  const recentUsers = users.slice(0, 5);

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tableau de Bord</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Vue d'ensemble de l'écosystème Fathul Fattah
        </p>
      </div>

      {/* Stats Cards - Mobile-first: 1 col mobile, 2 cols tablette, 4 cols desktop */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 - Utilisateurs (Doré avec dégradé) */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-yellow-600 to-amber-700 text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white/80">Utilisateurs</p>
                <p className="text-3xl font-bold mt-1">{totalUsers}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="text-white/90">Utilisateurs actifs</span>
            </div>
            {/* Mini graphique */}
            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ffffff" 
                    strokeWidth={2}
                    fill="url(#colorUsers)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 - Articles (Vert avec dégradé) */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FileText className="h-6 w-6" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white/80">Articles</p>
                <p className="text-3xl font-bold mt-1">{publishedPosts}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4" />
              <span className="text-white/90">Articles publiés</span>
            </div>
            {/* Mini graphique */}
            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ffffff" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 - Produits (Doré clair) */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-500 to-yellow-600 text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Package className="h-6 w-6" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white/80">Produits</p>
                <p className="text-3xl font-bold mt-1">{totalProducts}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <ShoppingBag className="h-4 w-4" />
              <span className="text-white/90">Produits en catalogue</span>
            </div>
            {/* Mini graphique */}
            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ffffff" 
                    strokeWidth={2}
                    fill="url(#colorProducts)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 - Activité (Vert foncé) */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-700 to-emerald-800 text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Activity className="h-6 w-6" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white/80">Activité</p>
                <p className="text-3xl font-bold mt-1">24h</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="text-white/90">Dernière activité</span>
            </div>
            {/* Mini graphique */}
            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ffffff" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deuxième ligne - Détails - Mobile: empilé, Desktop: 2 colonnes */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Articles Récents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Articles Récents
            </CardTitle>
            <CardDescription>Les derniers articles publiés</CardDescription>
          </CardHeader>
          <CardContent>
            {posts.length > 0 ? (
              <div className="space-y-4">
                {posts.slice(0, 3).map((post: any) => (
                  <div
                    key={post.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{post.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {post.status === "PUBLISHED" ? (
                          <span className="text-green-600">Publié</span>
                        ) : (
                          <span className="text-amber-600">Brouillon</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun article</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Utilisateurs Récents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-500" />
              Utilisateurs Récents
            </CardTitle>
            <CardDescription>Les derniers utilisateurs inscrits</CardDescription>
          </CardHeader>
          <CardContent>
            {recentUsers.length > 0 ? (
              <div className="space-y-4">
                {recentUsers.map((user: any) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-violet-600">
                        {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name || "Sans nom"}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin" 
                          ? "bg-violet-100 text-violet-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun utilisateur</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
