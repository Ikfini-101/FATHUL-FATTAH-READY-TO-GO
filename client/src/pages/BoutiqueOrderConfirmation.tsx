import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Loader2 } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function BoutiqueOrderConfirmation() {
  const [, params] = useRoute("/boutique/confirmation/:orderId");
  const orderId = params?.orderId ? parseInt(params.orderId) : 0;

  const { data: order, isLoading } = trpc.orders.getById.useQuery(
    { orderId },
    { enabled: orderId > 0 }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Commande introuvable</h2>
        <p className="text-muted-foreground mb-4">Cette commande n'existe pas</p>
        <Link href="/boutique">
          <Button>Retour à la boutique</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header succès */}
      <div className="bg-green-50 dark:bg-green-950 py-12">
        <div className="container text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Commande confirmée !</h1>
          <p className="text-lg text-muted-foreground">
            Merci pour votre commande. Vous recevrez un email de confirmation.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Informations commande */}
          <Card>
            <CardHeader>
              <CardTitle>Commande #{order.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <p className="font-bold">{order.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paiement</p>
                  <p className="font-bold">{order.paymentStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-bold text-lg">{order.total.toLocaleString()} FCFA</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mode de paiement</p>
                  <p className="font-bold">{order.paymentMethod}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adresse livraison */}
          <Card>
            <CardHeader>
              <CardTitle>Adresse de livraison</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold">{order.customerName}</p>
              <p>{order.shippingAddress}</p>
              <p>{order.shippingCity}, {order.shippingCountry}</p>
              <p className="mt-2 text-muted-foreground">{order.customerPhone}</p>
              <p className="text-muted-foreground">{order.customerEmail}</p>
            </CardContent>
          </Card>

          {/* Articles */}
          <Card>
            <CardHeader>
              <CardTitle>Articles commandés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center pb-3 border-b last:border-0">
                    <div>
                      <p className="font-bold">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">Quantité : {item.quantity}</p>
                    </div>
                    <p className="font-bold">{item.subtotal.toLocaleString()} FCFA</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Link href="/boutique">
              <Button variant="outline">Continuer mes achats</Button>
            </Link>
            <Link href="/boutique/catalogue">
              <Button>Voir le catalogue</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
