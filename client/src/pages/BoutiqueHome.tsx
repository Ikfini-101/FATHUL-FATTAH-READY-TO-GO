import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, ArrowRight, Star, TrendingUp } from "lucide-react";

export default function BoutiqueHome() {
  // Récupérer les produits vedettes
  const { data: featuredProducts, isLoading } = trpc.products.list.useQuery({
    featured: true,
    status: "ACTIVE",
  });

  // Récupérer les catégories
  const { data: categories } = trpc.productCategories.list.useQuery();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Boutique Fathul Fattah
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre collection d'ouvrages islamiques, de livres sur le Mouridisme et d'articles spirituels
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/boutique/catalogue">
                <Button size="lg" className="w-full sm:w-auto">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Voir le catalogue
                </Button>
              </Link>
              <Link href="/boutique/catalogue?featured=true">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Produits vedettes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories Section */}
      {categories && categories.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-8">Catégories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category: any) => (
                <Link key={category.id} href={`/boutique/catalogue?category=${category.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Produits Vedettes Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Produits Vedettes</h2>
            <Link href="/boutique/catalogue?featured=true">
              <Button variant="ghost">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product: any) => (
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
            <p className="text-center text-muted-foreground py-12">
              Aucun produit vedette pour le moment
            </p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Besoin d'aide ?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>
          <Link href="/contact">
            <Button size="lg" variant="outline">
              Nous contacter
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
