import React from 'react';
import { GraduationCap, BookOpen, Users, Calendar, MapPin, Clock, ChevronRight, Star } from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const FormationPage: React.FC = () => {
  const formations = [
    {
      id: '1',
      title: 'Licence Informatique',
      level: 'Licence (Bac+3)',
      duration: '3 ans',
      students: 120,
      description: 'Formation complète en informatique couvrant la programmation, les bases de données, les réseaux et l\'intelligence artificielle.',
      specializations: ['Développement Web', 'Intelligence Artificielle', 'Cybersécurité'],
      nextSession: '15 septembre 2025',
      image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'Master Data Science',
      level: 'Master (Bac+5)',
      duration: '2 ans',
      students: 45,
      description: 'Programme avancé en science des données, machine learning et analyse statistique pour les entreprises.',
      specializations: ['Machine Learning', 'Big Data', 'Analyse Prédictive'],
      nextSession: '20 septembre 2025',
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Ingénieur Électronique',
      level: 'Ingénieur (Bac+5)',
      duration: '5 ans',
      students: 80,
      description: 'Formation d\'ingénieur en électronique et systèmes embarqués avec une forte composante pratique.',
      specializations: ['Systèmes Embarqués', 'IoT', 'Robotique'],
      nextSession: '1er septembre 2025',
      image: 'https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const admissionSteps = [
    {
      step: 1,
      title: 'Candidature en ligne',
      description: 'Remplissez le formulaire de candidature sur notre plateforme',
      deadline: '30 juin 2025'
    },
    {
      step: 2,
      title: 'Dossier académique',
      description: 'Soumettez vos relevés de notes et lettres de recommandation',
      deadline: '15 juillet 2025'
    },
    {
      step: 3,
      title: 'Entretien',
      description: 'Participez à un entretien avec notre commission d\'admission',
      deadline: '31 juillet 2025'
    },
    {
      step: 4,
      title: 'Résultats',
      description: 'Recevez votre réponse d\'admission par email',
      deadline: '15 août 2025'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl text-white p-12 mb-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">Formation d'Excellence</h1>
            <p className="text-xl mb-8 text-blue-100">
              Découvrez nos programmes de formation innovants conçus pour préparer les leaders technologiques de demain.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Candidater maintenant
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Télécharger la brochure
              </button>
            </div>
          </div>
        </div>

        {/* Formations disponibles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Nos Formations</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {formations.map((formation) => (
              <div key={formation.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img 
                  src={formation.image} 
                  alt={formation.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {formation.level}
                    </span>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{formation.title}</h3>
                  <p className="text-gray-600 mb-4">{formation.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      Durée: {formation.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      {formation.students} étudiants
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      Prochaine session: {formation.nextSession}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Spécialisations:</h4>
                    <div className="flex flex-wrap gap-2">
                      {formation.specializations.map((spec, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    En savoir plus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Processus d'admission */}
        <section className="mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Processus d'Admission 2025/2026</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {admissionSteps.map((step, index) => (
                <div key={step.step} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                    <span className="text-blue-600 font-semibold text-sm">{step.deadline}</span>
                  </div>
                  {index < admissionSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-full w-full">
                      <ChevronRight className="h-6 w-6 text-gray-400 mx-auto" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Commencer ma candidature
              </button>
            </div>
          </div>
        </section>

        {/* Vie étudiante */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Vie Étudiante</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Associations Étudiantes</h3>
              <p className="text-gray-600 mb-4">
                Plus de 20 associations actives pour développer vos passions et créer des liens durables.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Club Robotique</li>
                <li>• Association IA & Data</li>
                <li>• Bureau des Étudiants</li>
                <li>• Club Entrepreneuriat</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Campus & Installations</h3>
              <p className="text-gray-600 mb-4">
                Un campus moderne avec des équipements de pointe pour votre réussite académique.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Laboratoires high-tech</li>
                <li>• Bibliothèque 24h/24</li>
                <li>• Espaces de coworking</li>
                <li>• Résidence étudiante</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Support Académique</h3>
              <p className="text-gray-600 mb-4">
                Un accompagnement personnalisé pour maximiser votre potentiel et réussir vos projets.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Tutorat personnalisé</li>
                <li>• Mentorat professionnel</li>
                <li>• Aide à l'orientation</li>
                <li>• Support psychologique</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à rejoindre l'ESST ?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Donnez une nouvelle dimension à votre avenir avec nos formations d'excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
              Candidater maintenant
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors">
              Prendre rendez-vous
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};