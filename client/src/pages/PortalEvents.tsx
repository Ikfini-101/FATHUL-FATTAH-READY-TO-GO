import { APP_TITLE } from "@/const";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function PortalEvents() {
  // Événements fictifs pour démonstration
  const events = [
    {
      id: 1,
      title: "Conférence sur l'Histoire du Mouridisme",
      date: "15 Décembre 2025",
      time: "14h00 - 17h00",
      location: "Grande Mosquée de Touba",
      description: "Une conférence enrichissante sur l'histoire et les enseignements du Mouridisme.",
    },
    {
      id: 2,
      title: "Exposition d'Artisanat Sénégalais",
      date: "20 Décembre 2025",
      time: "10h00 - 18h00",
      location: "Centre Culturel Fathul Fattah",
      description: "Découvrez les créations des artisans locaux et les techniques traditionnelles.",
    },
    {
      id: 3,
      title: "Cours de Langue Wolof",
      date: "Tous les Samedis",
      time: "09h00 - 11h00",
      location: "Salle de Formation",
      description: "Apprenez ou perfectionnez votre wolof avec nos enseignants qualifiés.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Événements</h1>
          <a href="/portal" className="text-white/80 hover:text-white">
            ← Retour au portail
          </a>
        </div>
      </header>

      {/* Events List */}
      <main className="container mx-auto px-4 py-12">
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Agenda</h2>
          <p className="text-lg text-gray-700">
            Consultez nos prochains événements et rejoignez-nous !
          </p>
        </section>

        <div className="space-y-6">
          {events.map((event) => (
            <article 
              key={event.id} 
              className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 mr-3 text-amber-600" />
                  <span>{event.date}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 mr-3 text-amber-600" />
                  <span>{event.time}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-3 text-amber-600" />
                  <span>{event.location}</span>
                </div>
              </div>
              
              <p className="text-gray-700">{event.description}</p>
            </article>
          ))}
        </div>
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
