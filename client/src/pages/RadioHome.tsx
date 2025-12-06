import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Play, Calendar, Headphones, Radio as RadioIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RadioLayout from "@/components/RadioLayout";

export default function RadioHome() {
  const { t } = useTranslation();
  const { data: shows, isLoading } = trpc.radioShows.list.useQuery();
  const { data: episodes } = trpc.radioEpisodes.list.useQuery();

  // Filtrer les émissions publiées
  const publishedShows = shows?.filter(show => show.status === "published") || [];
  const latestEpisodes = episodes?.filter(ep => ep.status === "published").slice(0, 6) || [];

  return (
    <RadioLayout>

      {/* Hero Section avec Player Live */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-green-600 to-green-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/cheikh-bamba-historic.png')] bg-cover bg-center opacity-20"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <RadioIcon className="w-16 h-16 mx-auto mb-6 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('radio.title', 'Radio Fathul Fattah')}
            </h1>
            <p className="text-xl mb-8 text-green-100">
              {t('radio.subtitle', 'Diffusion spirituelle et culturelle 24/7')}
            </p>
            
            {/* Boutons CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 w-full sm:w-auto" asChild>
                <Link href="/radio/live">
                  <Play className="mr-2 h-5 w-5" />
                  {t('radio.listen_live', 'Écouter en Direct')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto" asChild>
                <Link href="/radio/grille">
                  <Calendar className="mr-2 h-5 w-5" />
                  {t('radio.schedule', 'Grille des Programmes')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto" asChild>
                <Link href="/radio/podcasts">
                  <Headphones className="mr-2 h-5 w-5" />
                  {t('radio.podcasts', 'Podcasts & Replays')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Émissions Vedettes */}
      <section className="py-16 px-4">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('radio.featured_shows', 'Nos Émissions')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('radio.featured_shows_desc', 'Découvrez nos programmes spirituels, culturels et éducatifs')}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <CardHeader>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : publishedShows.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {t('radio.no_shows', 'Aucune émission disponible pour le moment')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedShows.map(show => (
                <Card key={show.id} className="hover:shadow-lg transition-shadow">
                  {show.coverImage && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={show.coverImage} 
                        alt={show.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{show.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {show.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      {show.hostName && (
                        <span className="flex items-center gap-1">
                          <RadioIcon className="h-4 w-4" />
                          {show.hostName}
                        </span>
                      )}
                      {show.category && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs">
                          {show.category}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Derniers Podcasts */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('radio.latest_podcasts', 'Derniers Podcasts')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('radio.latest_podcasts_desc', 'Rattrapez les émissions que vous avez manquées')}
            </p>
          </div>

          {latestEpisodes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {t('radio.no_episodes', 'Aucun podcast disponible pour le moment')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestEpisodes.map(episode => (
                <Link key={episode.id} href={`/radio/podcasts/${episode.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">{episode.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {episode.description || t('radio.no_description', 'Pas de description')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>{Math.floor(episode.duration / 60)} min</span>
                        <span>{new Date(episode.publishedAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link href="/radio/podcasts">
                {t('radio.view_all_podcasts', 'Voir tous les podcasts')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </RadioLayout>
  );
}
