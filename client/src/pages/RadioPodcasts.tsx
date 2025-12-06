import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { ArrowLeft, Search, Filter, Play, Calendar, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

export default function RadioPodcasts() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShow, setSelectedShow] = useState<string>("all");

  const { data: episodes, isLoading: episodesLoading } = trpc.radioEpisodes.list.useQuery();
  const { data: shows } = trpc.radioShows.list.useQuery();

  // Filtrer les épisodes publiés
  const publishedEpisodes = episodes?.filter(ep => ep.status === "published") || [];

  // Appliquer les filtres
  const filteredEpisodes = publishedEpisodes.filter(episode => {
    const matchesSearch = episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         episode.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesShow = selectedShow === "all" || episode.showId === parseInt(selectedShow);
    return matchesSearch && matchesShow;
  });

  const getShowById = (showId: number) => {
    return shows?.find(s => s.id === showId);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}min`;
    }
    return `${minutes}min`;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <PublicNav />

      <div className="flex-1 px-4 py-12">
        <div className="container max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/radio">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('common.back', 'Retour')}
              </Button>
            </Link>

            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {t('radio.podcasts_title', 'Podcasts & Replays')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('radio.podcasts_subtitle', 'Écoutez ou téléchargez vos émissions préférées à tout moment')}
              </p>
            </div>

            {/* Filtres */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Recherche */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder={t('radio.search_podcasts', 'Rechercher un podcast...')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Filtre par émission */}
                  <div className="w-full md:w-64">
                    <Select value={selectedShow} onValueChange={setSelectedShow}>
                      <SelectTrigger>
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder={t('radio.all_shows', 'Toutes les émissions')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {t('radio.all_shows', 'Toutes les émissions')}
                        </SelectItem>
                        {shows?.filter(s => s.status === "published").map(show => (
                          <SelectItem key={show.id} value={show.id.toString()}>
                            {show.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Compteur résultats */}
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {filteredEpisodes.length} {t('radio.episodes_found', 'épisode(s) trouvé(s)')}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des podcasts */}
          {episodesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : filteredEpisodes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                {searchQuery || selectedShow !== "all" 
                  ? t('radio.no_results', 'Aucun podcast ne correspond à votre recherche')
                  : t('radio.no_podcasts', 'Aucun podcast disponible pour le moment')}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredEpisodes.map(episode => {
                const show = getShowById(episode.showId);
                return (
                  <Link key={episode.id} href={`/radio/podcasts/${episode.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2 hover:text-green-600 transition-colors">
                              {episode.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {episode.description || t('radio.no_description', 'Pas de description')}
                            </CardDescription>
                          </div>
                          <Button size="icon" variant="ghost" className="shrink-0 text-green-600 hover:text-green-700 hover:bg-green-50">
                            <Play className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          {/* Émission */}
                          {show && (
                            <span className="flex items-center gap-1">
                              <span className="font-medium text-green-600 dark:text-green-400">
                                {show.title}
                              </span>
                            </span>
                          )}

                          {/* Date */}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(episode.publishedAt).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>

                          {/* Durée */}
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDuration(episode.duration)}
                          </span>

                          {/* Taille fichier */}
                          {episode.fileSize && (
                            <span className="text-xs">
                              {formatFileSize(episode.fileSize)}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
