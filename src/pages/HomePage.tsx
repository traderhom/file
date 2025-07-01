import React from 'react';
import { useUserStats, useProjectStats, useCourseStats, useVisitorStats } from '../hooks/useRealTimeStats';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Users, GraduationCap, FlaskRound as Flask, Newspaper, ChevronRight, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePages } from '../contexts/PageContext';
import { Navbar } from '../components/Navbar';

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { getPageBySlug } = usePages();

  // Get the home page content from the page context
  const homePage = getPageBySlug('accueil');

  const renderHomeContent = (content: string) => {
    const lines = content.split('\n');
    let title = '';
    let description = '';
    
    // Extract title and description from content
    for (const line of lines) {
      if (line.startsWith('# ') && !title) {
        title = line.slice(2);
      } else if (line.trim() && !line.startsWith('#') && !line.startsWith('-') && !description) {
        description = line.trim();
        break;
      }
    }

    return { title, description };
  };

  const { title, description } = homePage ? renderHomeContent(homePage.content) : {
    title: 'Bienvenue à l\'ESST',
    description: 'Découvrez notre plateforme collaborative dédiée à l\'excellence académique et à la recherche innovante.'
  };

  const { userStats } = useUserStats();
  const { projectStats } = useProjectStats();
  const { courseStats } = useCourseStats();
  const { visitorStats } = useVisitorStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl overflow-hidden mb-8 shadow-xl">
          <div className="px-8 py-16 lg:py-20">
            <div className="max-w-2xl">
              <div className="bg-white bg-opacity-95 rounded-xl p-8 shadow-lg">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  {title}
                </h2>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  {description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {homePage && (
                    <Link
                      to={`/pages/${homePage.slug}`}
                      className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                    >
                      En savoir plus
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  )}
                  {!isAuthenticated && (
                    <Link
                      to="/login"
                      className="border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white px-8 py-3 rounded-full font-medium transition-all duration-200 flex items-center justify-center"
                    >
                      Se connecter
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Formation */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 ml-4">Formation</h3>
            </div>
            <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mb-6"></div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center group-hover:text-blue-700 transition-colors">
                <ChevronRight className="h-5 w-5 mr-3 text-blue-500" />
                <Link to="/formation" className="hover:underline">Parcours académiques</Link>
              </li>
              <li className="flex items-center group-hover:text-blue-700 transition-colors">
                <ChevronRight className="h-5 w-5 mr-3 text-blue-500" />
                <Link to="/pages/admission-2025-2026" className="hover:underline">Admissions 2025/2026</Link>
              </li>
              <li className="flex items-center group-hover:text-blue-700 transition-colors">
                <ChevronRight className="h-5 w-5 mr-3 text-blue-500" />
                <Link to="/formation" className="hover:underline">Vie étudiante</Link>
              </li>
              <li className="flex items-center group-hover:text-blue-700 transition-colors">
                <ChevronRight className="h-5 w-5 mr-3 text-blue-500" />
                <Link to="/pages/relations-internationales" className="hover:underline">Relations internationales</Link>
              </li>
            </ul>
          </div>

          {/* Recherche */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <Flask className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 ml-4">Recherche</h3>
            </div>
            <div className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-6"></div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center group-hover:text-green-700 transition-colors">
                <ChevronRight className="h-5 w-5 mr-3 text-green-500" />
                <Link to="/recherche" className="hover:underline">Laboratoires de recherche</Link>
              </li>
              <li className="flex items-center group-hover:text-green-700 transition-colors">
                <ChevronRight className="h-5 w-5 mr-3 text-green-500" />
                <Link to="/recherche" className="hover:underline">Publications scientifiques</Link>
              </li>
              <li className="flex items-center group-hover:text-green-700 transition-colors">
                <ChevronRight className="h-5 w-5 mr-3 text-green-500" />
                <Link to="/recherche" className="hover:underline">Projets collaboratifs</Link>
              </li>
              <li className="flex items-center group-hover:text-green-700 transition-colors">
                <ChevronRight className="h-5 w-5 mr-3 text-green-500" />
                <Link to="/recherche" className="hover:underline">Partenariats industriels</Link>
              </li>
            </ul>
          </div>

          {/* Actualités */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                <Newspaper className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 ml-4">Actualités</h3>
            </div>
            <div className="h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mb-6"></div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center group-hover:text-purple-700 transition-colors">
                <ChevronRight className="h-5 w-5 mr-3 text-purple-500" />
                <Link to="/actualites" className="hover:underline">Événements à venir</Link>
              </li>
              <li className="flex items-center group-hover:text-purple-700 transition-colors">
                <ChevronRight className="h-5 w-5 mr-3 text-purple-500" />
                <Link to="/actualites" className="hover:underline">Annonces importantes</Link>
              </li>
              <li className="flex items-center group-hover:text-purple-700 transition-colors">
                <ChevronRight className="h-5 w-5 mr-3 text-purple-500" />
                <Link to="/actualites" className="hover:underline">Newsletter mensuelle</Link>
              </li>
              <li className="flex items-center group-hover:text-purple-700 transition-colors">
                <ChevronRight className="h-5 w-5 mr-3 text-purple-500" />
                <Link to="/actualites" className="hover:underline">Réussites étudiantes</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Access for Authenticated Users */}
        {isAuthenticated && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Accès rapide</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                to="/projects"
                className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group border border-blue-200"
              >
                <div className="p-4 bg-blue-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Projets</h4>
                <p className="text-sm text-gray-600 text-center">Collaboratifs</p>
              </Link>

              <Link
                to="/messaging"
                className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 group border border-green-200"
              >
                <div className="p-4 bg-green-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Messagerie</h4>
                <p className="text-sm text-gray-600 text-center">Conversations</p>
              </Link>

              <Link
                to="/cours"
                className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 group border border-purple-200"
              >
                <div className="p-4 bg-purple-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Cours</h4>
                <p className="text-sm text-gray-600 text-center">Ressources</p>
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex flex-col items-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl hover:from-red-100 hover:to-red-200 transition-all duration-300 group border border-red-200"
                >
                  <div className="p-4 bg-red-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Administration</h4>
                  <p className="text-sm text-gray-600 text-center">Gestion</p>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Statistics Section dynamique */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold text-center mb-8">L'ESST en chiffres</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{userStats?.totalUsers ?? '-'}</div>
              <div className="text-blue-200">Étudiants</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{projectStats?.activeProjects ?? '-'}</div>
              <div className="text-blue-200">Projets actifs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{courseStats?.totalCourses ?? '-'}</div>
              <div className="text-blue-200">Formations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{visitorStats?.monthlyVisitors ?? '-'}</div>
              <div className="text-blue-200">Visiteurs/mois</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">Formation</h4>
              <ul className="space-y-2 text-blue-200">
                <li><Link to="/formation" className="hover:text-white transition-colors">Licences</Link></li>
                <li><Link to="/formation" className="hover:text-white transition-colors">Masters</Link></li>
                <li><Link to="/formation" className="hover:text-white transition-colors">Doctorats</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Recherche</h4>
              <ul className="space-y-2 text-blue-200">
                <li><Link to="/recherche" className="hover:text-white transition-colors">Laboratoires</Link></li>
                <li><Link to="/recherche" className="hover:text-white transition-colors">Publications</Link></li>
                <li><Link to="/recherche" className="hover:text-white transition-colors">Partenariats</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Campus</h4>
              <ul className="space-y-2 text-blue-200">
                <li><Link to="/formation" className="hover:text-white transition-colors">Vie étudiante</Link></li>
                <li><Link to="/formation" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link to="/formation" className="hover:text-white transition-colors">Logement</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-blue-200">
                <li>123 Avenue de la Science</li>
                <li>75000 Paris, France</li>
                <li>+33 1 23 45 67 89</li>
                <li>contact@esst.edu</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 flex justify-between items-center">
            <p className="text-blue-200">© 2025 ESST - Tous droits réservés</p>
            <div className="flex space-x-6 text-blue-200">
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};