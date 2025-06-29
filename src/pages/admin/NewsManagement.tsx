import React, { useState } from 'react';
import { Search, Plus, Edit, Eye, Trash2, Calendar, User, Tag } from 'lucide-react';
import { NewsEditor } from '../../components/admin/NewsEditor';
import { useNews } from '../../contexts/NewsContext';

export const NewsManagement: React.FC = () => {
  const { articles, updateArticle, createArticle, deleteArticle } = useNews();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentView, setCurrentView] = useState<'list' | 'edit' | 'create'>('list');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const categories = ['Distinctions', 'Formation', 'Partenariats', 'Recherche', 'Événements'];

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-blue-100 text-blue-800'
    };
    
    const labels = {
      published: 'Publié',
      draft: 'Brouillon',
      scheduled: 'Programmé'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreateArticle = () => {
    setSelectedArticleId(null);
    setCurrentView('create');
  };

  const handleEditArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setCurrentView('edit');
  };

  const handleSaveArticle = (articleData: any) => {
    if (selectedArticleId) {
      updateArticle(articleData);
    } else {
      createArticle(articleData);
    }
    setCurrentView('list');
    setSelectedArticleId(null);
  };

  const handleDeleteArticle = (articleId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      deleteArticle(articleId);
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedArticleId(null);
  };

  const selectedArticle = selectedArticleId ? articles.find(a => a.id === selectedArticleId) : undefined;

  if (currentView === 'edit' || currentView === 'create') {
    return (
      <NewsEditor
        newsId={selectedArticleId || undefined}
        onSave={handleSaveArticle}
        onCancel={handleCancel}
        initialData={selectedArticle}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Gestion des Actualités</h1>
        <button 
          onClick={handleCreateArticle}
          className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Article
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filtrer par:</span>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="scheduled">Programmé</option>
          </select>
          
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <img 
              src={article.featuredImage} 
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                {getStatusBadge(article.status)}
                <span className="text-xs text-gray-500">{article.category}</span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {article.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {article.publishDate}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {article.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleEditArticle(article.id)}
                    className="text-blue-600 hover:text-blue-900" 
                    title="Éditer"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900" title="Aperçu">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteArticle(article.id)}
                    className="text-red-600 hover:text-red-900" 
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  {article.content.split(' ').length} mots
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun article trouvé</p>
        </div>
      )}
    </div>
  );
};