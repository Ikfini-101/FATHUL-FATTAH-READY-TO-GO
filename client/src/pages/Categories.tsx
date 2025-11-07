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
import { trpc } from "@/lib/trpc";
import { Plus, Pencil, Trash2, FolderOpen, Tag } from "lucide-react";

export default function Categories() {
  // Récupérer les catégories et tags
  const { data: categories, isLoading: loadingCategories } = trpc.categories.list.useQuery();
  const { data: tags, isLoading: loadingTags } = trpc.tags.list.useQuery();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Catégories & Tags</h1>
        <p className="text-muted-foreground mt-2">
          Organisez votre contenu avec des catégories et des tags
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Catégories */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Catégories</CardTitle>
                <CardDescription>
                  {categories?.length || 0} catégorie(s) au total
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingCategories ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse bg-muted rounded" />
                ))}
              </div>
            ) : categories && categories.length > 0 ? (
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FolderOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-muted-foreground">{category.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">Aucune catégorie</p>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  {tags?.length || 0} tag(s) au total
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingTags ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse bg-muted rounded" />
                ))}
              </div>
            ) : tags && tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="px-4 py-2 text-sm flex items-center gap-2 cursor-pointer hover:bg-secondary/80"
                  >
                    <Tag className="h-3 w-3" />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">Aucun tag</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
