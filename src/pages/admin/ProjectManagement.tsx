import React, { useState } from 'react';
import { Plus, Search, Download, Archive, Trash2, Edit, X } from 'lucide-react';
import { ProjectEditor } from '../../components/admin/ProjectEditor';
import { useProjects } from '../../contexts/ProjectsContext';

export const ProjectManagement: React.FC = () => {
  const { projects, updateProject, createProject, deleteProject } = useProjects();

  const [categories] = useState([
    'Développement Web',
    'IA & Machine Learning',
    'Data Science',
    'Cybersécurité',
    'Électronique'
  ]);

  const [statuses] = useState([
    { id: 'active', label: 'Actif', color: 'bg-green-500' },
    { id: 'draft', label: 'Brouillon', color: 'bg-yellow-500' },
    { id: 'completed', label: 'Terminé', color: 'bg-blue-500' },
    { id: 'cancelled', label: 'Annulé', color: 'bg-red-500' }
  ]);

  const [currentView, setCurrentView] = useState<'list' | 'edit' | 'create'>('list');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateProject = () => {
    setSelectedProjectId(null);
    setCurrentView('create');
  };

  const handleEditProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('edit');
  };

  const handleSaveProject = (projectData: any) => {
    if (selectedProjectId) {
      updateProject(projectData);
    } else {
      createProject(projectData);
    }
    setCurrentView('list');
    setSelectedProjectId(null);
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      deleteProject(projectId);
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedProjectId(null);
  };

  const selectedProject = selectedProjectId ? projects.find(p => p.id === selectedProjectId) : undefined;

  const getStatusBadge = (status: string) => {
    const statusConfig = statuses.find(s => s.id === status);
    if (!statusConfig) return null;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${statusConfig.color}`}>
        {statusConfig.label}
      </span>
    );
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (currentView === 'edit' || currentView === 'create') {
    return (
      <ProjectEditor
        projectId={selectedProjectId || undefined}
        onSave={handleSaveProject}
        onCancel={handleCancel}
        initialData={selectedProject}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-600">Administration des projets</h1>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">AD</span>
          </div>
          <span className="text-sm text-gray-600">Admin</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg">
          <option>Catégorie</option>
          {categories.map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg">
          <option>Statut</option>
          {statuses.map(status => (
            <option key={status.id}>{status.label}</option>
          ))}
        </select>
        <button 
          onClick={handleCreateProject}
          className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau
        </button>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Archive className="h-4 w-4 mr-2" />
            Archiver
          </button>
          <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </button>
        </div>
        <span className="text-sm text-gray-600">Afficher 10 par page</span>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre du projet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de création
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProjects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(project.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.deadline}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditProject(project.id)}
                      className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                    >
                      <Edit className="h-3 w-3 text-gray-600" />
                    </button>
                    <button className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                      <Search className="h-3 w-3 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                    >
                      <Trash2 className="h-3 w-3 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-center border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Page</span>
            <button className="px-3 py-1 bg-gray-100 rounded text-sm font-medium text-blue-900">1</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50">2</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50">3</button>
            <span className="text-sm text-gray-600">...</span>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50">10</button>
          </div>
        </div>
      </div>

      {/* Configuration Section */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">Configuration des projets</h2>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Category Management */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">Gestion des catégories</h3>
          <div className="h-0.5 bg-gray-200 mb-4"></div>
          
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              placeholder="Nouvelle catégorie..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
            <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
              +
            </button>
          </div>
          
          <div className="space-y-1 max-h-48 overflow-y-auto border border-gray-300 rounded-lg">
            {categories.map((category, index) => (
              <div key={category} className={`flex items-center justify-between px-4 py-2 ${index % 2 === 1 ? 'bg-gray-50' : ''}`}>
                <span className="text-sm text-gray-700">{category}</span>
                <button className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                  <X className="h-3 w-3 text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status Management */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">Statuts des projets</h3>
          <div className="h-0.5 bg-gray-200 mb-4"></div>
          
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              placeholder="Nouveau statut..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
            <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
              +
            </button>
          </div>
          
          <div className="space-y-1 max-h-48 overflow-y-auto border border-gray-300 rounded-lg">
            {statuses.map((status, index) => (
              <div key={status.id} className={`flex items-center justify-between px-4 py-2 ${index % 2 === 1 ? 'bg-gray-50' : ''}`}>
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${status.color}`}></div>
                  <span className="text-sm text-gray-700">{status.label}</span>
                </div>
                <button className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                  <X className="h-3 w-3 text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-600 mb-4">Paramètres généraux des projets</h3>
        <div className="h-0.5 bg-gray-200 mb-6"></div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Nombre max de membres par projet
            </label>
            <input
              type="number"
              defaultValue="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Durée max d'un projet (jours)
            </label>
            <input
              type="number"
              defaultValue="180"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Visibilité par défaut
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option>Public</option>
              <option>Privé</option>
              <option>Restreint</option>
            </select>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">Notifications automatiques</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 mr-2" />
                <span className="text-sm text-gray-700">Échéances approchantes</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 mr-2" />
                <span className="text-sm text-gray-700">Nouveau membre ajouté</span>
              </label>
            </div>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 mr-2" />
                <span className="text-sm text-gray-700">Changement de statut</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 mr-2" />
                <span className="text-sm text-gray-700">Nouveau document ajouté</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};