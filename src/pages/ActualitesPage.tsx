import React, { useState } from 'react';
import { Calendar, User, Tag, Search, Filter, ChevronRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useNews } from '../contexts/NewsContext';
import { useEvents } from '../contexts/EventsContext';

export const ActualitesPage: React.FC = () => {
  const { getPublishedArticles } = useNews();
  const { getUpcomingEvents } = useEvents();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const news = getPublishedArticles();
  const upcomingEvents = getUpcomingEvents().slice(0, 3); // Show only first 3 events

  const categories = [
    { id: 'all', label: 'Toutes les actualités', count: news.length },
    { id: 'events', label: 'Événements', count: news.filter(n => n.category === 'Événements').length },
    { id: 'research', label: 'Recherche', count: news.filter(n => n.category === 'Recherche').length },
    { id: 'students', label: 'Vie étudiante', count: news.filter(n => n.category === 'Formation').length },
    { id: 'partnerships', label: 'Partenariats', count: news.filter(n => n.category === 'Partenariats').length },
    { id: 'awards', label: 'Distinctions', count: news.filter(n => n.category === 'Distinctions').length }
  ];

  const featuredNews = news[0] || {
    title: 'Aucune actualité disponible',
    excerpt: 'Aucune actualité n\'est actuellement publiée.',
    date: new Date().toLocaleDateString('fr-FR'),
    author: 'ESST',
    category: 'Information',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
    readTime: '1 min'
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Formation': 'bg-blue-100 text-blue-800',
      'Partenariats': 'bg-green-100 text-green-800',
      'Événements': 'bg-purple-100 text-purple-800',
      'Recherche': 'bg-orange-100 text-orange-800',
      'Campus': 'bg-pink-100 text-pink-800',
      'International': 'bg-indigo-100 text-indigo-800',
      'Distinctions': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-700 rounded-xl text-white p-12 mb-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">Actualités ESST</h1>
            <p className="text-xl mb-8 text-purple-100">
              Restez informé des dernières nouvelles, événements et innovations de notre école.
            </p>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher une actualité..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-purple-200 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                Rechercher
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Categories */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Catégories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-purple-100 text-purple-800 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.label}</span>
                      <span className="text-sm">{category.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Événements à venir</h3>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                    <div className="text-xs text-gray-500 mt-1">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {event.date} à {event.time}
                      </div>
                      <div className="mt-1">{event.location}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-purple-600 hover:text-purple-800 text-sm font-medium">
                Voir tous les événements →
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured News */}
            {featuredNews && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img 
                      src={featuredNews.image} 
                      alt={featuredNews.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(featuredNews.category)}`}>
                        {featuredNews.category}
                      </span>
                      <span className="text-sm text-gray-500">• {featuredNews.readTime || '3 min'} de lecture</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{featuredNews.title}</h2>
                    <p className="text-gray-600 mb-6">{featuredNews.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {featuredNews.publishDate || featuredNews.date}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {featuredNews.author}
                        </div>
                      </div>
                      <button className="text-purple-600 hover:text-purple-800 font-medium flex items-center">
                        Lire la suite
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* News Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {news.slice(1).map((article) => (
                <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img 
                    src={article.featuredImage} 
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">• 3 min de lecture</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {article.publishDate}
                        </div>
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {article.author}
                        </div>
                      </div>
                      <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                        Lire →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Charger plus d'actualités
              </button>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <section className="mt-16 bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Restez informé</h2>
          <p className="text-xl text-purple-100 mb-8">
            Abonnez-vous à notre newsletter pour recevoir les dernières actualités de l'ESST.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
              S'abonner
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};