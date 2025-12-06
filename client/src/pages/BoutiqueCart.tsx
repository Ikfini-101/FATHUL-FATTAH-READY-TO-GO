import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function BoutiqueCart() {
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

  const { data: cart, isLoading, refetch } = trpc.cart.get.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const updateQuantityMutation = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Quantité mise à jour");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la mise à jour");
    },
  });

  const removeMutation = trpc.cart.remove.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Article retiré du panier");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });

  const clearMutation = trpc.cart.clear.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Panier vidé");
    },
  });

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantityMutation.mutate({ productId, quantity: newQuantity, sessionId });
  };

  const handleRemove = (productId: number) => {
    removeMutation.mutate({ productId, sessionId });
  };

  const handleClear = () => {
    if (confirm("Êtes-vous sûr de vouloir vider votre panier ?")) {
      clearMutation.mutate({ sessionId });
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Chargement du panier...</p>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <Link href="/boutique" className="inline-flex items-center gap-2 text-sm mb-4 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Retour à la boutique
          </Link>
          <h1 className="text-4xl font-bold">Mon Panier</h1>
          <p className="text-primary-foreground/80 mt-2">
            {isEmpty ? "Votre panier est vide" : `${cart.items.length} article(s)`}
          </p>
        </div>
      </div>

      <div className="container py-12">
        {isEmpty ? (
          <Card className="p-12 text-center">
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
            <p className="text-muted-foreground mb-8">
              Découvrez nos produits et ajoutez-les à votre panier
            </p>
            <Link href="/boutique/catalogue">
              <Button size="lg">
                Découvrir le catalogue
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Liste des articles */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Articles ({cart.items.length})</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={clearMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Vider le panier
                </Button>
              </div>

              {cart.items.map((item) => {
                const images = JSON.parse((item.productImage as string) || "[]");
                const imageUrl = images[0] || "https://via.placeholder.com/150";

                return (
                  <Card key={item.id} className="p-6">
                    <div className="flex gap-6">
                      {/* Image */}
                      <Link href={`/boutique/produits/${item.productSlug}`}>
                        <img
                          src={imageUrl}
                          alt={item.productName}
                          className="w-24 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
                        />
                      </Link>

                      {/* Infos */}
                      <div className="flex-1">
                        <Link href={`/boutique/produits/${item.productSlug}`}>
                          <h3 className="font-bold text-lg hover:text-primary transition-colors">
                            {item.productName}
                          </h3>
                        </Link>
                        <p className="text-2xl font-bold text-primary mt-2">
                          {item.productPrice.toLocaleString()} FCFA
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Stock disponible : {item.productStock}
                        </p>

                        {/* Quantité */}
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-2 border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-12 text-center font-bold">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= item.productStock || updateQuantityMutation.isPending}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(item.productId)}
                            disabled={removeMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Retirer
                          </Button>
                        </div>
                      </div>

                      {/* Sous-total */}
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Sous-total</p>
                        <p className="text-2xl font-bold">
                          {(item.productPrice * item.quantity).toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Résumé */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-6">Résumé de la commande</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-bold">{calculateTotal().toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="font-bold">À calculer</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary text-2xl">
                        {calculateTotal().toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                </div>

                <Button size="lg" className="w-full" disabled>
                  Passer la commande (Bientôt disponible)
                </Button>

                <Link href="/boutique/catalogue">
                  <Button variant="outline" size="lg" className="w-full mt-4">
                    Continuer mes achats
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
