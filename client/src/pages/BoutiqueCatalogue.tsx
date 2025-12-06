import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Search, Filter, Star, ArrowRight, X } from "lucide-react";

export default function BoutiqueCatalogue() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    searchParams.get("category") ? parseInt(searchParams.get("category")!) : undefined
  );
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get("featured") === "true");

  const { data: products, isLoading } = trpc.products.list.useQuery({
    search: searchQuery || undefined,
    categoryId: selectedCategory,
    featured: featuredOnly || undefined,
    status: "ACTIVE",
  });

  const { data: categories } = trpc.productCategories.list.useQuery();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(undefined);
    setFeaturedOnly(false);
  };

  const hasActiveFilters = searchQuery || selectedCategory || featuredOnly;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Catalogue Produits</h1>
          <p className="text-muted-foreground">
            {products?.length || 0} produit(s) disponible(s)
          </p>
        </div>
      </section>

      {/* Filtres */}
      <section className="sticky top-0 z-10 bg-background border-b py-4 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Catégorie */}
            <Select
              value={selectedCategory?.toString() || "all"}
              onValueChange={(value) =>
                setSelectedCategory(value === "all" ? undefined : parseInt(value))
              }
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {categories?.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Vedettes */}
            <Button
              variant={featuredOnly ? "default" : "outline"}
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className="w-full md:w-auto"
            >
              <Star className={`h-4 w-4 mr-2 ${featuredOnly ? "fill-current" : ""}`} />
              Vedettes
            </Button>

            {/* Réinitialiser */}
            {hasActiveFilters && (
              <Button variant="ghost" onClick={handleClearFilters} className="w-full md:w-auto">
                <X className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Grille produits */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <Link key={product.id} href={`/boutique/produits/${product.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                    {/* Image produit */}
                    <div className="relative aspect-square bg-muted overflow-hidden rounded-t-lg">
                      {product.images && JSON.parse(product.images)[0] ? (
                        <img
                          src={JSON.parse(product.images)[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="h-16 w-16 text-muted-foreground/30" />
                        </div>
                      )}
                      {product.featured && (
                        <Badge className="absolute top-2 right-2 bg-orange-600">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Vedette
                        </Badge>
                      )}
                      {product.stock === 0 && (
                        <Badge className="absolute top-2 left-2 bg-destructive">
                          Rupture
                        </Badge>
                      )}
                    </div>

                    {/* Infos produit */}
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <h3 className="font-semibold line-clamp-2 mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          {product.compareAtPrice && product.compareAtPrice > product.price ? (
                            <div>
                              <p className="text-sm text-muted-foreground line-through">
                                {formatPrice(product.compareAtPrice)}
                              </p>
                              <p className="text-lg font-bold text-orange-600">
                                {formatPrice(product.price)}
                              </p>
                            </div>
                          ) : (
                            <p className="text-lg font-bold">{formatPrice(product.price)}</p>
                          )}
                        </div>
                        <Button size="sm" variant="ghost">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground mb-6">
                Essayez de modifier vos filtres de recherche
              </p>
              {hasActiveFilters && (
                <Button onClick={handleClearFilters}>Réinitialiser les filtres</Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
