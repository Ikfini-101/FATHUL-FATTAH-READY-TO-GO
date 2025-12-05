import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { trpc } from "@/lib/trpc";
import { Calendar, MapPin, Clock, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PortalEvents() {
  const { t, i18n } = useTranslation();
  const { data: events, isLoading } = trpc.portal.events.useQuery();

  const currentLang = i18n.language as 'fr' | 'ar' | 'en';

  // Fonction pour formater les dates
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(i18n.language, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (startAt: Date, endAt: Date) => {
    const start = new Date(startAt).toLocaleTimeString(i18n.language, {
      hour: '2-digit',
      minute: '2-digit'
    });
    const end = new Date(endAt).toLocaleTimeString(i18n.language, {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${start} - ${end}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec image de fond */}
      <header className="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white py-12 overflow-hidden">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0 opacity-15">
          <img
            src="/images/cheikh-bamba-historic.png"
            alt="Cheikh Ahmadou Bamba"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/85 to-orange-500/85" />
        
        {/* Contenu du header */}
        <div className="relative container mx-auto px-4">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-4xl font-bold">{t('portal.events.title')}</h1>
            <LanguageSwitcher />
          </div>
          <a href="/portal" className="text-white/80 hover:text-white">
            {t('portal.events.backToPortal')} ←
          </a>
        </div>
      </header>

      {/* Events List */}
      <main className="container mx-auto px-4 py-12">
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('portal.events.agenda')}</h2>
          <p className="text-lg text-gray-700">
            {t('portal.events.description')}
          </p>
        </section>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        ) : events && events.length > 0 ? (
          <div className="space-y-6">
            {events.map((event: any) => {
              const title = event.titleI18n?.[currentLang] || event.titleI18n?.fr || 'Sans titre';
              const description = event.bodyI18n?.[currentLang] || event.bodyI18n?.fr || '';
              
              return (
                <article 
                  key={event.id} 
                  className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-amber-600" />
                      <span>{formatDate(event.startAt)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-3 text-amber-600" />
                      <span>{formatTime(event.startAt, event.endAt)}</span>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-5 h-5 mr-3 text-amber-600" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-700">{description}</p>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">{t('portal.events.noEvents')}</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>{t('portal.footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
