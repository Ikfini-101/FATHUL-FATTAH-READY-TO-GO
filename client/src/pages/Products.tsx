import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { Pagination } from "@/components/Pagination";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateProductDialog } from "@/components/CreateProductDialog";
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
import { Plus, Pencil, Trash2, Package } from "lucide-react";

export default function Products() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Récupérer les produits avec recherche et filtres
  const { data: productsData, isLoading } = trpc.products.list.useQuery({
    search: searchQuery || undefined,
    status: "ACTIVE", // Filtrer seulement les produits actifs
  });
  const products = productsData || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge variant="default">Publié</Badge>;
      case "DRAFT":
        return <Badge variant="secondary">Brouillon</Badge>;
      case "OUT_OF_STOCK":
        return <Badge variant="destructive">Rupture</Badge>;
      case "ARCHIVED":
        return <Badge variant="outline">Archivé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price / 100); // Prix stocké en centimes
  };

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-6">
      {/* Header - Mobile: empilé, Desktop: côte à côte */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Produits</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Gérez le catalogue de l'e-boutique
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="w-full sm:w-auto min-h-[44px]">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau produit
        </Button>
      </div>

      {/* Barre de recherche */}
      <SearchBar
        placeholder="Rechercher des produits..."
        onSearch={(query) => {
          setSearchQuery(query);
          setPage(1);
        }}
      />

      {/* Products Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-yellow-700" />
            Liste des produits
          </CardTitle>
          <CardDescription>
            {products.length || 0} produit(s) au total
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 animate-pulse bg-muted rounded" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p>{product.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                        {product.stock} en stock
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">Aucun produit</p>
          )}
          </div>
          
          {/* Pagination - à implémenter si nécessaire */}
          {products.length > 10 && (
            <div className="text-center text-sm text-muted-foreground py-4">
              {products.length} produit(s) affiché(s)
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de création/édition */}
      <CreateProductDialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open) setEditingProduct(null);
        }}
        product={editingProduct}
      />
    </div>
  );
}
