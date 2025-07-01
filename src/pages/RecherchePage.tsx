import React, { useEffect, useState } from 'react';
import { Award, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const RecherchePage: React.FC = () => {
  const [laboratories, setLaboratories] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  // Utiliser la vraie route backend pour les laboratoires
  useEffect(() => {
    fetch('/api/project-categories')
      .then(res => res.json())
      .then(data => {
        setLaboratories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Typage exemple (à adapter selon votre modèle réel)
  // interface Laboratory {
  //   _id: string;
  //   name: string;
  //   // Ajoutez les autres champs selon votre schéma MongoDB
  // }

  const publications = [
    {
      title: 'Advanced Machine Learning Techniques for Medical Diagnosis',
      authors: 'M. Dubois, J. Laurent, P. Martin',
      journal: 'IEEE Transactions on Medical Imaging',
      year: '2025',
      citations: 45
    },
    {
      title: 'Quantum Cryptography in Modern Network Security',
      authors: 'J. Martin, S. Rousseau, A. Petit',
      journal: 'Journal of Cybersecurity',
      year: '2024',
      citations: 78
    },
    {
      title: 'Autonomous Navigation Systems for Industrial Robotics',
      authors: 'A. Chen, L. Moreau, F. Bernard',
      journal: 'Robotics and Autonomous Systems',
      year: '2024',
      citations: 62
    }
  ];

  const partnerships = [
    {
      name: 'Microsoft Research',
      type: 'Partenariat Technologique',
      domain: 'Intelligence Artificielle',
      since: '2022'
    },
    {
      name: 'Thales Group',
      type: 'Collaboration R&D',
      domain: 'Cybersécurité',
      since: '2021'
    },
    {
      name: 'Airbus',
      type: 'Projet Industriel',
      domain: 'Systèmes Embarqués',
      since: '2023'
    },
    {
      name: 'CNRS',
      type: 'Recherche Fondamentale',
      domain: 'Informatique Quantique',
      since: '2020'
    }
  ];

  const events = [
    {
      title: 'Conférence Internationale IA & Santé',
      date: '15-17 Mai 2025',
      location: 'Campus ESST',
      type: 'Conférence'
    },
    {
      title: 'Workshop Cybersécurité Industrielle',
      date: '8 Juin 2025',
      location: 'Amphithéâtre A',
      type: 'Workshop'
    },
    {
      title: 'Journée Portes Ouvertes Recherche',
      date: '22 Juin 2025',
      location: 'Tous laboratoires',
      type: 'Événement'
    }
  ];

  if (loading) return <div>Chargement des laboratoires...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-700 rounded-xl text-white p-12 mb-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">Recherche & Innovation</h1>
            <p className="text-xl mb-8 text-green-100">
              Découvrez nos laboratoires de recherche de pointe et nos projets innovants qui façonnent l'avenir technologique.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">8</div>
                <div className="text-green-200">Laboratoires</div>
              </div>
              <div>
                <div className="text-3xl font-bold">150+</div>
                <div className="text-green-200">Chercheurs</div>
              </div>
              <div>
                <div className="text-3xl font-bold">45</div>
                <div className="text-green-200">Projets actifs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Laboratoires */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Nos Laboratoires</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {laboratories.map((lab) => (
              <div key={lab.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img 
                  src={lab.image} 
                  alt={lab.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{lab.name}</h3>
                  <p className="text-gray-600 mb-4">{lab.focus}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Directeur:</span>
                      <span className="font-medium">{lab.director}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Membres:</span>
                      <span className="font-medium">{lab.members} chercheurs</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Projets actifs:</span>
                      <span className="font-medium">{lab.projects}</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Découvrir le laboratoire
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Publications récentes */}
        <section className="mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Publications Récentes</h2>
            <div className="space-y-6">
              {publications.map((pub, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-6 py-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{pub.title}</h3>
                  <p className="text-gray-600 mb-2">{pub.authors}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{pub.journal}</span>
                      <span>•</span>
                      <span>{pub.year}</span>
                      <span>•</span>
                      <span>{pub.citations} citations</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 flex items-center">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Lire
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Voir toutes les publications
              </button>
            </div>
          </div>
        </section>

        {/* Partenariats */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Partenariats Industriels</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerships.map((partner, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{partner.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{partner.type}</p>
                <p className="text-sm text-blue-600 font-medium mb-2">{partner.domain}</p>
                <p className="text-xs text-gray-500">Depuis {partner.since}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Événements à venir */}
        <section className="mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Événements à Venir</h2>
            <div className="space-y-6">
              {events.map((event, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-green-900 to-blue-900 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Rejoignez notre Communauté de Recherche</h2>
          <p className="text-xl text-green-100 mb-8">
            Participez à des projets innovants et contribuez aux avancées technologiques de demain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Postuler comme chercheur
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-900 transition-colors">
              Proposer un partenariat
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};