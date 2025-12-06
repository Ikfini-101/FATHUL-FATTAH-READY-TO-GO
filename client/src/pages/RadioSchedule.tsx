import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { ArrowLeft, Clock, Radio as RadioIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const DAYS_OF_WEEK = [
  { id: 0, name: 'Dimanche', nameAr: 'الأحد', nameEn: 'Sunday' },
  { id: 1, name: 'Lundi', nameAr: 'الإثنين', nameEn: 'Monday' },
  { id: 2, name: 'Mardi', nameAr: 'الثلاثاء', nameEn: 'Tuesday' },
  { id: 3, name: 'Mercredi', nameAr: 'الأربعاء', nameEn: 'Wednesday' },
  { id: 4, name: 'Jeudi', nameAr: 'الخميس', nameEn: 'Thursday' },
  { id: 5, name: 'Vendredi', nameAr: 'الجمعة', nameEn: 'Friday' },
  { id: 6, name: 'Samedi', nameAr: 'السبت', nameEn: 'Saturday' },
];

export default function RadioSchedule() {
  const { t, i18n } = useTranslation();
  const { data: schedules, isLoading: schedulesLoading } = trpc.radioSchedule.list.useQuery();
  const { data: shows } = trpc.radioShows.list.useQuery();

  // Grouper les horaires par jour
  const schedulesByDay = DAYS_OF_WEEK.map(day => ({
    ...day,
    programs: schedules?.filter(s => s.dayOfWeek === day.id).sort((a, b) => 
      a.startTime.localeCompare(b.startTime)
    ) || []
  }));

  const getShowById = (showId: number) => {
    return shows?.find(s => s.id === showId);
  };

  const getDayName = (day: typeof DAYS_OF_WEEK[0]) => {
    if (i18n.language === 'ar') return day.nameAr;
    if (i18n.language === 'en') return day.nameEn;
    return day.name;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <PublicNav />

      <div className="flex-1 px-4 py-12">
        <div className="container max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" className="mb-4" asChild>
              <Link href="/radio">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('common.back', 'Retour')}
              </Link>
            </Button>

            <div className="text-center">
              <RadioIcon className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {t('radio.schedule_title', 'Grille des Programmes')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('radio.schedule_subtitle', 'Retrouvez tous vos programmes préférés organisés par jour de la semaine')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {t('radio.timezone_info', 'Tous les horaires sont en heure locale (Africa/Dakar)')}
              </p>
            </div>
          </div>

          {/* Grille hebdomadaire */}
          {schedulesLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : schedules?.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                {t('radio.no_schedule', 'Aucun programme planifié pour le moment')}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {schedulesByDay.map(day => (
                <Card key={day.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Clock className="h-6 w-6" />
                      {getDayName(day)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {day.programs.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        {t('radio.no_programs_day', 'Aucun programme ce jour')}
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {day.programs.map(program => {
                          const show = getShowById(program.showId);
                          return (
                            <div 
                              key={program.id}
                              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              {/* Horaire */}
                              <div className="shrink-0 text-center min-w-[100px]">
                                <div className="text-lg font-bold text-green-700 dark:text-green-400">
                                  {program.startTime}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {program.endTime}
                                </div>
                              </div>

                              {/* Séparateur */}
                              <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>

                              {/* Info émission */}
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {show?.title || t('radio.unknown_show', 'Émission inconnue')}
                                </h3>
                                {show?.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                    {show.description}
                                  </p>
                                )}
                                {show?.hostName && (
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    {t('radio.host', 'Animé par')}: {show.hostName}
                                  </p>
                                )}
                              </div>

                              {/* Badge catégorie */}
                              {show?.category && (
                                <div className="shrink-0">
                                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                                    {show.category}
                                  </span>
                                </div>
                              )}

                              {/* Badge récurrence */}
                              {!program.isRecurring && (
                                <div className="shrink-0">
                                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">
                                    {t('radio.special', 'Spécial')}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-700" asChild>
              <Link href="/radio/live">
                <RadioIcon className="mr-2 h-5 w-5" />
                {t('radio.listen_now', 'Écouter maintenant')}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
