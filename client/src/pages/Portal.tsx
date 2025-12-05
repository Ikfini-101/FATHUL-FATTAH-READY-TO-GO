import { APP_TITLE } from "@/const";

export default function Portal() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">{APP_TITLE}</h1>
          <p className="text-xl">Portail Institutionnel</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Bienvenue</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Découvrez notre institution, nos actualités et nos événements.
          </p>
        </section>

        {/* Cards Grid */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Actualités</h3>
            <p className="text-gray-700 mb-4">Restez informé de nos dernières nouvelles</p>
            <a href="/portal/articles" className="text-amber-600 hover:text-amber-700 font-semibold">
              Voir les articles →
            </a>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Événements</h3>
            <p className="text-gray-700 mb-4">Consultez notre agenda</p>
            <a href="/portal/events" className="text-amber-600 hover:text-amber-700 font-semibold">
              Voir l&apos;agenda →
            </a>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Contact</h3>
            <p className="text-gray-700 mb-4">Contactez-nous facilement</p>
            <a href="/portal/contact" className="text-amber-600 hover:text-amber-700 font-semibold">
              Nous contacter →
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 {APP_TITLE}. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
