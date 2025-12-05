import { APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function PortalArticles() {
  const { data: articles, isLoading } = trpc.portal.articles.useQuery();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Actualités</h1>
          <a href="/portal" className="text-white/80 hover:text-white">
            ← Retour au portail
          </a>
        </div>
      </header>

      {/* Articles List */}
      <main className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => (
              <article key={article.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-gray-700 mb-4">{article.excerpt || article.content?.substring(0, 150) + '...'}</p>
                  <a href={`/portal/articles/${article.slug}`} className="text-amber-600 hover:text-amber-700 font-semibold">
                    Lire la suite →
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucun article publié pour le moment.</p>
          </div>
        )}
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
