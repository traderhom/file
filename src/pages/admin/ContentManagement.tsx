import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Eye, Trash2, ArrowLeft } from 'lucide-react';
import { PageEditor } from '../../components/PageEditor';
import { usePages } from '../../contexts/PageContext';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  status: 'published' | 'draft' | 'review';
  lastModified: string;
  author: string;
  publishDate?: string;
  featuredImage?: string;
  seoTitle?: string;
}

export const ContentManagement: React.FC = () => {
  const { pages, updatePage, createPage, deletePage } = usePages();
  const [currentView, setCurrentView] = useState<'list' | 'edit' | 'create'>('list');
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      review: 'bg-blue-100 text-blue-800'
    };
    
    const labels = {
      published: 'Publié',
      draft: 'Brouillon',
      review: 'Révision'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleEditPage = (pageId: string) => {
    setSelectedPageId(pageId);
    setCurrentView('edit');
  };

  const handleCreatePage = () => {
    setSelectedPageId(null);
    setCurrentView('create');
  };

  const handleSavePage = (pageData: Page) => {
    if (selectedPageId) {
      // Update existing page
      updatePage(pageData);
    } else {
      // Create new page
      createPage(pageData);
    }
    setCurrentView('list');
    setSelectedPageId(null);
  };

  const handleDeletePage = (pageId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) {
      deletePage(pageId);
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedPageId(null);
  };

  const handlePreviewPage = (page: Page) => {
    if (page.status === 'published') {
      window.open(`/pages/${page.slug}`, '_blank');
    } else {
      alert('Cette page n\'est pas encore publiée et ne peut pas être prévisualisée.');
    }
  };

  const selectedPage = selectedPageId ? pages.find(p => p.id === selectedPageId) : undefined;

  if (currentView === 'edit' || currentView === 'create') {
    return (
      <PageEditor
        pageId={selectedPageId || undefined}
        onSave={handleSavePage}
        onCancel={handleCancel}
        initialData={selectedPage}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Gestion des Pages</h1>
        <button 
          onClick={handleCreatePage}
          className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Page
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
              placeholder="Rechercher une page..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="review">Révision</option>
          </select>
          
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>Toutes les sections</option>
            <option>Accueil</option>
            <option>Formation</option>
            <option>Recherche</option>
            <option>Actualités</option>
          </select>
          
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </button>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière modif.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Auteur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPages.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{page.title}</div>
                      {page.metaDescription && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {page.metaDescription}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  /pages/{page.slug}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(page.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {page.lastModified}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {page.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditPage(page.id)}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                      title="Éditer"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handlePreviewPage(page)}
                      className="text-green-600 hover:text-green-900 flex items-center"
                      title="Aperçu"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeletePage(page.id)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune page trouvée</p>
          </div>
        )}

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Précédent
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">1</span> à{' '}
                <span className="font-medium">{filteredPages.length}</span> sur{' '}
                <span className="font-medium">{pages.length}</span> résultats
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  ‹
                </button>
                <button className="bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </button>
                <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  2
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  ›
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};