import { useState } from "react";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, ArrowLeft, Plus, Minus, Star, Package } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

export default function BoutiqueProductDetail() {
  const [, params] = useRoute("/boutique/produits/:slug");
  const slug = params?.slug;

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [sessionId, setSessionId] = useState<string>("");

  // Générer ou récupérer sessionId pour panier anonyme
  useEffect(() => {
    let sid = localStorage.getItem("cart_session_id");
    if (!sid) {
      sid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart_session_id", sid);
    }
    setSessionId(sid);
  }, []);

  const { data: product, isLoading } = trpc.products.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const addToCartMutation = trpc.cart.add.useMutation({
    onSuccess: () => {
      toast.success(`${quantity} × ${product?.name} ajouté au panier`);
      setQuantity(1); // Réinitialiser la quantité
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de l'ajout au panier");
    },
  });

  const handleAddToCart = () => {
    if (!product) return;
    addToCartMutation.mutate({
      productId: product.id,
      quantity,
      sessionId,
    });
  };

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= (product?.stock || 0)) {
      setQuantity(newQty);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-6xl py-8 px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-20 bg-muted rounded" />
                <div className="h-12 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Produit introuvable</h2>
          <p className="text-muted-foreground mb-6">
            Le produit que vous recherchez n'existe pas ou n'est plus disponible
          </p>
          <Link href="/boutique/catalogue">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au catalogue
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images && typeof product.images === 'string' ? JSON.parse(product.images) : [];
  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl py-8 px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/boutique">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la boutique
            </Button>
          </Link>
        </div>

        {/* Contenu produit */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Galerie images */}
          <div className="space-y-4">
            {/* Image principale */}
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart className="h-24 w-24 text-muted-foreground/30" />
                </div>
              )}
              {product.featured && (
                <Badge className="absolute top-4 right-4 bg-orange-600">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Vedette
                </Badge>
              )}
            </div>

            {/* Miniatures */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square bg-muted rounded overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Infos produit */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.sku && (
                <p className="text-sm text-muted-foreground">Référence: {product.sku}</p>
              )}
            </div>

            {/* Prix */}
            <div>
              {product.compareAtPrice && product.compareAtPrice > product.price ? (
                <div>
                  <p className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </p>
                  <p className="text-3xl font-bold text-yellow-700">
                    {formatPrice(product.price)}
                  </p>
                  <Badge variant="destructive" className="mt-2">
                    Économisez {formatPrice(product.compareAtPrice - product.price)}
                  </Badge>
                </div>
              ) : (
                <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Stock */}
            <div>
              {isOutOfStock ? (
                <Badge variant="destructive" className="text-base py-2 px-4">
                  Rupture de stock
                </Badge>
              ) : product.stock < 10 ? (
                <Badge variant="outline" className="text-base py-2 px-4">
                  Plus que {product.stock} en stock
                </Badge>
              ) : (
                <Badge variant="outline" className="text-base py-2 px-4">
                  En stock
                </Badge>
              )}
            </div>

            {/* Quantité et ajout panier */}
            {!isOutOfStock && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Quantité</label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Ajouter au panier - {formatPrice(product.price * quantity)}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Infos supplémentaires */}
            {product.weight && (
              <div className="text-sm text-muted-foreground">
                Poids: {product.weight}g
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
