import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Play, Pause, Calendar, Clock, Download, Share2, Volume2, VolumeX } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import RadioLayout from "@/components/RadioLayout";


export default function RadioPodcastDetail() {
  const { t } = useTranslation();
  const [, params] = useRoute("/radio/podcasts/:slug");
  const slug = params?.slug || "";

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: episode, isLoading: episodeLoading } = trpc.radioEpisodes.getBySlug.useQuery({ slug });
  const { data: show } = trpc.radioShows.getById.useQuery(
    { id: episode?.showId || 0 },
    { enabled: !!episode?.showId }
  );

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
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
      toast.error(t('radio.playback_error', 'Impossible de lire l\'audio'));
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

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (episode?.audioUrl) {
      window.open(episode.audioUrl, '_blank');
      toast.success(t('radio.download_started', 'Téléchargement démarré'));
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: episode?.title,
          text: episode?.description || '',
          url: url,
        });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success(t('common.link_copied', 'Lien copié dans le presse-papiers'));
    }
  };

  if (episodeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!episode) {
    return (
      <RadioLayout>
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">{t('radio.episode_not_found', 'Épisode introuvable')}</p>
              <Link href="/radio/podcasts">
                <Button>{t('radio.back_to_podcasts', 'Retour aux podcasts')}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </RadioLayout>
    );
  }

  return (
    <RadioLayout>

      <div className="flex-1 px-4 py-12">
        <div className="container max-w-4xl">
          {/* Bouton retour */}
          <Link href="/radio/podcasts">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('radio.back_to_podcasts', 'Retour aux podcasts')}
            </Button>
          </Link>

          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">{episode.title}</CardTitle>
                  {show && (
                    <CardDescription className="text-green-100 text-lg">
                      {show.title}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {/* Info métadonnées */}
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(episode.publishedAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {Math.floor(episode.duration / 60)} min
                </span>
              </div>

              {/* Description */}
              {episode.description && (
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                    {t('radio.description', 'Description')}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {episode.description}
                  </p>
                </div>
              )}

              {/* Player Audio */}
              <Card className="bg-gray-50 dark:bg-gray-800 border-2 border-green-200 dark:border-green-800">
                <CardContent className="p-6">
                  {/* Bouton Play/Pause */}
                  <div className="flex items-center gap-4 mb-4">
                    <Button
                      size="lg"
                      onClick={togglePlay}
                      disabled={isLoading}
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                      ) : isPlaying ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="h-8 w-8 ml-1" />
                      )}
                    </Button>

                    <div className="flex-1">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {formatTime(currentTime)} / {formatTime(duration || episode.duration)}
                      </div>
                      <Slider
                        value={[currentTime]}
                        onValueChange={handleSeek}
                        max={duration || episode.duration}
                        step={1}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Contrôles volume */}
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
                      className="flex-1 max-w-xs"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {volume[0]}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 mt-6">
                <Button onClick={handleDownload} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  {t('radio.download', 'Télécharger')}
                </Button>
                <Button onClick={handleShare} variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  {t('radio.share', 'Partager')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Audio Element */}
          <audio
            ref={audioRef}
            src={episode.audioUrl}
            preload="metadata"
            onError={() => toast.error(t('radio.audio_error', 'Erreur de chargement audio'))}
          />
        </div>
      </div>

    </RadioLayout>
  );
}
