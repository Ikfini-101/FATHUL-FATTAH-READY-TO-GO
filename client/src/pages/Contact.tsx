import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Message envoyé avec succès !");
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de l'envoi du message");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    contactMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNav />

      {/* Header */}
      <header className="relative bg-gradient-to-br from-green-700 via-green-600 to-amber-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactez-Nous</h1>
          <p className="text-xl text-green-50 max-w-2xl">
            Nous sommes à votre écoute pour toute question ou suggestion
          </p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Informations de contact */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-green-200">
              <CardHeader className="bg-gradient-to-br from-green-50 to-amber-50">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <MapPin className="w-5 h-5" />
                  Adresse
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700">
                  Hizbut Tarqiyyah<br />
                  Touba, Diourbel<br />
                  Sénégal
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-sky-50">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Phone className="w-5 h-5" />
                  Téléphone
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <a
                  href="tel:+221338651234"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  +221 33 865 12 34
                </a>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader className="bg-gradient-to-br from-amber-50 to-orange-50">
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <Mail className="w-5 h-5" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <a
                  href="mailto:contact@hizbuttarqiyyah.sn"
                  className="text-amber-600 hover:text-amber-700 font-medium break-all"
                >
                  contact@hizbuttarqiyyah.sn
                </a>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Horaires d'ouverture</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span className="font-medium">8h - 18h</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Samedi</span>
                    <span className="font-medium">9h - 13h</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Dimanche</span>
                    <span className="font-medium text-red-600">Fermé</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Formulaire de contact */}
          <div className="lg:col-span-2">
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-amber-50">
                <CardTitle className="text-2xl text-green-800">
                  Envoyez-nous un message
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Message envoyé !
                    </h3>
                    <p className="text-gray-600">
                      Nous vous répondrons dans les plus brefs délais.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Jean Dupont"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="jean.dupont@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        placeholder="Demande d'information"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Votre message..."
                        rows={8}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="lg"
                    >
                      {contactMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
