import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Radio, Save, Settings } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function RadioSettings() {
  const [liveStreamUrl, setLiveStreamUrl] = useState("");
  const [currentShowTitle, setCurrentShowTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Récupérer les paramètres existants
  const { data: settings, isLoading: loadingSettings } = trpc.radioSettings.list.useQuery();
  const upsertMutation = trpc.radioSettings.upsert.useMutation();

  useEffect(() => {
    if (settings) {
      const liveUrl = settings.find(s => s.key === "live_stream_url");
      const showTitle = settings.find(s => s.key === "current_show_title");
      
      if (liveUrl) setLiveStreamUrl(liveUrl.value || "");
      if (showTitle) setCurrentShowTitle(showTitle.value || "");
    }
  }, [settings]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Sauvegarder l'URL du streaming
      await upsertMutation.mutateAsync({
        key: "live_stream_url",
        value: liveStreamUrl,
        description: "URL du flux audio en direct (Icecast/Shoutcast/autre)"
      });

      // Sauvegarder le titre de l'émission en cours
      await upsertMutation.mutateAsync({
        key: "current_show_title",
        value: currentShowTitle,
        description: "Titre de l'émission actuellement diffusée"
      });

      toast.success("Paramètres sauvegardés avec succès");
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde des paramètres");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingSettings) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-green-700 rounded-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Configuration Radio
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Paramètres du streaming en direct
              </p>
            </div>
          </div>
        </div>

        {/* Carte de configuration */}
        <Card className="shadow-lg border-green-200 dark:border-green-800">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-green-600" />
              <CardTitle>Streaming en Direct</CardTitle>
            </div>
            <CardDescription>
              Configurez l'URL du flux audio et les informations affichées sur la page live
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* URL du streaming */}
            <div className="space-y-2">
              <Label htmlFor="liveStreamUrl" className="text-base font-semibold">
                URL du Flux Audio
              </Label>
              <Input
                id="liveStreamUrl"
                type="url"
                placeholder="https://stream.example.com/live.mp3"
                value={liveStreamUrl}
                onChange={(e) => setLiveStreamUrl(e.target.value)}
                className="h-11"
              />
              <p className="text-sm text-gray-500">
                URL complète de votre serveur de streaming (Icecast, Shoutcast, ou autre)
              </p>
            </div>

            {/* Titre de l'émission en cours */}
            <div className="space-y-2">
              <Label htmlFor="currentShowTitle" className="text-base font-semibold">
                Titre de l'Émission en Cours
              </Label>
              <Textarea
                id="currentShowTitle"
                placeholder="Radio Fathul Fattah - En Direct"
                value={currentShowTitle}
                onChange={(e) => setCurrentShowTitle(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <p className="text-sm text-gray-500">
                Texte affiché sur la page d'écoute en direct
              </p>
            </div>

            {/* Bouton de sauvegarde */}
            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Carte d'aide */}
        <Card className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-lg">💡 Comment obtenir une URL de streaming ?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-100">Option 1 : Serveur Icecast/Shoutcast</p>
              <p className="text-blue-800 dark:text-blue-200">
                Installez Icecast sur votre serveur VPS et configurez un point de montage (ex: /live.mp3)
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-100">Option 2 : Services cloud</p>
              <p className="text-blue-800 dark:text-blue-200">
                Utilisez des services comme Radio.co, Live365, ou Radionomy pour héberger votre flux
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-100">Format d'URL attendu :</p>
              <code className="block mt-1 p-2 bg-blue-100 dark:bg-blue-900/40 rounded text-blue-900 dark:text-blue-100">
                https://stream.example.com:8000/live.mp3
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
