import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CreditCard, Smartphone } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function BoutiqueCheckout() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("wave");
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingPostalCode: "",
    shippingCountry: "Sénégal",
  });

  useEffect(() => {
    const sid = localStorage.getItem("cart_session_id") || "";
    setSessionId(sid);
  }, []);

  const { data: cart, isLoading } = trpc.cart.get.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      toast.success("Commande créée avec succès !");
      setLocation(`/boutique/confirmation/${data.orderId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la création de la commande");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    // Validation basique
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!formData.shippingAddress || !formData.shippingCity) {
      toast.error("Veuillez renseigner votre adresse de livraison");
      return;
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0
    );

    createOrderMutation.mutate({
      sessionId,
      ...formData,
      paymentMethod,
      paymentStatus: "PENDING",
      totalAmount,
      currency: "XOF",
      items: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.productPrice,
      })),
    });
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-12">
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
            <p className="text-muted-foreground mb-8">
              Ajoutez des produits avant de passer commande
            </p>
            <Link href="/boutique/catalogue">
              <Button>Découvrir le catalogue</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <Link href="/boutique/panier" className="inline-flex items-center gap-2 text-sm mb-4 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Retour au panier
          </Link>
          <h1 className="text-4xl font-bold">Finaliser la commande</h1>
        </div>
      </div>

      <div className="container py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulaire */}
            <div className="lg:col-span-2 space-y-8">
              {/* Informations client */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Informations de contact</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Nom complet *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Email *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="customerPhone">Téléphone *</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      placeholder="+221 XX XXX XX XX"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </Card>

              {/* Adresse livraison */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Adresse de livraison</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="shippingAddress">Adresse *</Label>
                    <Input
                      id="shippingAddress"
                      placeholder="Rue, numéro, quartier..."
                      value={formData.shippingAddress}
                      onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="shippingCity">Ville *</Label>
                      <Input
                        id="shippingCity"
                        value={formData.shippingCity}
                        onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shippingPostalCode">Code postal</Label>
                      <Input
                        id="shippingPostalCode"
                        value={formData.shippingPostalCode}
                        onChange={(e) => setFormData({ ...formData, shippingPostalCode: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="shippingCountry">Pays *</Label>
                      <Input
                        id="shippingCountry"
                        value={formData.shippingCountry}
                        onChange={(e) => setFormData({ ...formData, shippingCountry: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Mode de paiement */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Mode de paiement</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="wave" id="wave" />
                    <Label htmlFor="wave" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Smartphone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-bold">Wave</p>
                        <p className="text-sm text-muted-foreground">Paiement mobile instantané</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="orange-money" id="orange-money" />
                    <Label htmlFor="orange-money" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Smartphone className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-bold">Orange Money</p>
                        <p className="text-sm text-muted-foreground">Paiement mobile sécurisé</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-bold">Carte bancaire</p>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-sm text-muted-foreground mt-4 p-4 bg-muted rounded-lg">
                  💡 <strong>Mode démonstration</strong> : Le paiement sera simulé. Aucun montant ne sera débité.
                </p>
              </Card>
            </div>

            {/* Résumé commande */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-6">Récapitulatif</h2>

                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.productName} × {item.quantity}
                      </span>
                      <span className="font-bold">
                        {(item.productPrice * item.quantity).toLocaleString()} FCFA
                      </span>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span className="font-bold">{calculateTotal().toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Livraison</span>
                      <span className="font-bold">Gratuite</span>
                    </div>
                    <div className="flex justify-between text-lg pt-4 border-t">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary text-2xl">
                        {calculateTotal().toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? "Traitement..." : "Confirmer et payer"}
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
