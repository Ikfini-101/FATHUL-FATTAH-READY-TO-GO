import { APP_TITLE } from "@/const";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SEOHead } from "@/components/SEOHead";
import { useTranslation } from "react-i18next";

export default function Portal() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={t('portal.title')}
        description={t('portal.home.description')}
        type="website"
      />
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-5xl font-bold mb-4">{APP_TITLE}</h1>
              <p className="text-xl">{t('portal.subtitle')}</p>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('portal.home.welcome')}</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t('portal.home.description')}
          </p>
        </section>

        {/* Cards Grid */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('portal.home.news')}</h3>
            <p className="text-gray-700 mb-4">{t('portal.home.newsDescription')}</p>
            <a href="/portal/articles" className="text-amber-600 hover:text-amber-700 font-semibold">
              {t('portal.home.viewArticles')} →
            </a>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('portal.home.events')}</h3>
            <p className="text-gray-700 mb-4">{t('portal.home.eventsDescription')}</p>
            <a href="/portal/events" className="text-amber-600 hover:text-amber-700 font-semibold">
              {t('portal.home.viewEvents')} →
            </a>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('portal.home.contact')}</h3>
            <p className="text-gray-700 mb-4">{t('portal.home.contactDescription')}</p>
            <a href="/portal/contact" className="text-amber-600 hover:text-amber-700 font-semibold">
              {t('portal.home.contactUs')} →
            </a>
          </div>
        </section>
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
