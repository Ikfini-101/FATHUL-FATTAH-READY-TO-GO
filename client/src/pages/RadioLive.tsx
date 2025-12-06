import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Play, Pause, Volume2, VolumeX, Radio as RadioIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

// URL du flux audio live (à configurer dans l'admin plus tard)
const LIVE_STREAM_URL = "https://stream.example.com/live.mp3"; // TODO: Rendre configurable

export default function RadioLive() {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      setError(null);
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Erreur lecture audio:", err);
      setError(t('radio.stream_error', 'Impossible de lire le flux audio. Vérifiez votre connexion.'));
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <PublicNav />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="container max-w-4xl">
          {/* Bouton retour */}
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/radio">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back', 'Retour')}
            </Link>
          </Button>

          <Card className="shadow-2xl border-2 border-green-200 dark:border-green-800">
            <CardHeader className="text-center bg-gradient-to-r from-green-600 to-green-800 text-white rounded-t-lg py-12">
              <RadioIcon className="w-20 h-20 mx-auto mb-4 animate-pulse" />
              <CardTitle className="text-4xl font-bold mb-2">
                {t('radio.live_title', 'Radio Fathul Fattah')}
              </CardTitle>
              <CardDescription className="text-green-100 text-lg">
                {isPlaying 
                  ? t('radio.now_playing', '🔴 En Direct') 
                  : t('radio.ready_to_play', 'Prêt à écouter')}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              {/* Player Controls */}
              <div className="flex flex-col items-center gap-8">
                {/* Bouton Play/Pause Principal */}
                <Button
                  size="lg"
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="w-24 h-24 rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg transition-all hover:scale-105"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                  ) : isPlaying ? (
                    <Pause className="h-12 w-12" />
                  ) : (
                    <Play className="h-12 w-12 ml-1" />
                  )}
                </Button>

                {/* Message d'erreur */}
                {error && (
                  <div className="text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Contrôle Volume */}
                <div className="w-full max-w-md">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="shrink-0"
                    >
                      {isMuted || volume[0] === 0 ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </Button>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {volume[0]}%
                    </span>
                  </div>
                </div>

                {/* Info Technique */}
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <p>{t('radio.stream_quality', 'Qualité: MP3 128kbps')}</p>
                  <p>{t('radio.stream_note', 'Le démarrage peut prendre quelques secondes')}</p>
                </div>

                {/* Programme en cours (placeholder) */}
                <Card className="w-full bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t('radio.now_on_air', 'À l\'antenne maintenant')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('radio.program_info_placeholder', 'Informations sur le programme en cours...')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      {t('radio.next_show', 'Prochaine émission: À venir')}
                    </p>
                  </CardContent>
                </Card>

                {/* Liens rapides */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button variant="outline" asChild>
                    <Link href="/radio/grille">
                      {t('radio.view_schedule', 'Voir la grille')}
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/radio/podcasts">
                      {t('radio.view_podcasts', 'Écouter les replays')}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audio Element */}
          <audio
            ref={audioRef}
            src={LIVE_STREAM_URL}
            preload="none"
            onError={() => {
              setError(t('radio.stream_unavailable', 'Flux audio indisponible. Veuillez réessayer plus tard.'));
              setIsPlaying(false);
              setIsLoading(false);
            }}
          />
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
