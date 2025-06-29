import React, { useState } from 'react';
import { BookOpen, Clock, Users, Star, Play, Download, CheckCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useCourses } from '../contexts/CoursesContext';

export const CoursPage: React.FC = () => {
  const { getActiveCourses } = useCourses();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const courses = getActiveCourses();

  const categories = [
    { id: 'all', label: 'Tous les cours' },
    { id: 'programming', label: 'Programmation' },
    { id: 'ai', label: 'Intelligence Artificielle' },
    { id: 'cybersecurity', label: 'Cybersécurité' },
    { id: 'data', label: 'Data Science' },
    { id: 'robotics', label: 'Robotique' }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => {
        const categoryMap: { [key: string]: string } = {
          'programming': 'Programmation',
          'ai': 'Intelligence Artificielle',
          'cybersecurity': 'Cybersécurité',
          'data': 'Data Science',
          'robotics': 'Robotique'
        };
        return course.category === categoryMap[selectedCategory];
      });

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'Débutant': 'bg-green-100 text-green-800',
      'Intermédiaire': 'bg-yellow-100 text-yellow-800',
      'Avancé': 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl text-white p-12 mb-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">Plateforme de Cours</h1>
            <p className="text-xl mb-8 text-indigo-100">
              Accédez à nos cours en ligne de haute qualité et développez vos compétences technologiques.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">{courses.length}+</div>
                <div className="text-indigo-200">Cours disponibles</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{courses.reduce((sum, course) => sum + course.students, 0)}+</div>
                <div className="text-indigo-200">Étudiants actifs</div>
              </div>
              <div>
                <div className="text-3xl font-bold">95%</div>
                <div className="text-indigo-200">Taux de satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Catégories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {course.lessons} leçons
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center space-x-1 mr-3">
                    {renderStars(course.rating)}
                  </div>
                  <span className="text-sm text-gray-600">({course.rating})</span>
                </div>
                
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Instructeur:</span>
                    <span className="font-medium">{course.instructor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Durée:</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Étudiants:</span>
                    <span className="font-medium">{course.students}</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progression</span>
                    <span className="text-sm text-gray-600">0/{course.lessons} leçons</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">0% complété</span>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
                    <Play className="h-4 w-4 mr-2" />
                    Commencer
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun cours trouvé dans cette catégorie</p>
          </div>
        )}

        {/* Learning Path Section */}
        <section className="mt-16 bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Parcours d'Apprentissage Recommandés</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Développeur Full-Stack</h3>
              <p className="text-gray-600 mb-4">
                Maîtrisez le développement web complet, du frontend au backend.
              </p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>• HTML/CSS/JavaScript</li>
                <li>• React/Vue.js</li>
                <li>• Node.js/Python</li>
                <li>• Bases de données</li>
              </ul>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Voir le parcours →
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Data Scientist</h3>
              <p className="text-gray-600 mb-4">
                Analysez et exploitez les données pour prendre des décisions éclairées.
              </p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>• Python/R</li>
                <li>• Machine Learning</li>
                <li>• Statistiques</li>
                <li>• Visualisation</li>
              </ul>
              <button className="text-green-600 hover:text-green-800 font-medium">
                Voir le parcours →
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Cybersécurité</h3>
              <p className="text-gray-600 mb-4">
                Protégez les systèmes et données contre les menaces numériques.
              </p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>• Sécurité réseau</li>
                <li>• Cryptographie</li>
                <li>• Audit sécurité</li>
                <li>• Forensique</li>
              </ul>
              <button className="text-purple-600 hover:text-purple-800 font-medium">
                Voir le parcours →
              </button>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-16 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer votre apprentissage ?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Rejoignez des milliers d'étudiants qui développent leurs compétences avec nos cours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Explorer tous les cours
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-900 transition-colors">
              Créer un compte
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};