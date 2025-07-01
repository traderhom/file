import React, { useState, useEffect } from 'react';
import { ProjectConfigService } from '../../services/ProjectConfigService';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Download, Archive, Trash2, Edit, X, Eye, Users, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { ProjectEditor } from '../../components/projects/ProjectEditor';
import { useProjects } from '../../contexts/ProjectsContext';

export const ProjectManagement: React.FC = () => {
  const { projects, updateProject, createProject, deleteProject } = useProjects();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<{ id: string, label: string, color: string }[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [configError, setConfigError] = useState('');

  // Charger catégories/statuts au montage
  useEffect(() => {
    setLoadingConfig(true);
    setConfigError('');
    Promise.all([
      ProjectConfigService.getCategories(),
      ProjectConfigService.getStatuses()
    ])
      .then(([cats, stats]) => {
        setCategories(cats.map((c: any) => c.name));
        setStatuses(stats);
      })
      .catch(() => setConfigError('Erreur de chargement des catégories/statuts'))
      .finally(() => setLoadingConfig(false));
  }, []);

  // State for new category and status inputs
  const [newCategory, setNewCategory] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newStatusColor, setNewStatusColor] = useState('bg-green-500');
  const [statusError, setStatusError] = useState('');

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim())) return;
    try {
      const cat = await ProjectConfigService.addCategory(newCategory.trim());
      setCategories([...categories, cat.name]);
      setNewCategory('');
    } catch (e) {
      setConfigError('Erreur lors de l\'ajout de la catégorie');
    }
  };

  // Remove category
  const handleRemoveCategory = async (cat: string) => {
    try {
      // On doit trouver l'id de la catégorie (requête à l'API pour tout récupérer)
      const all = await ProjectConfigService.getCategories();
      const found = all.find((c: any) => c.name === cat);
      if (!found) return;
      await ProjectConfigService.removeCategory(found._id);
      setCategories(categories.filter(c => c !== cat));
    } catch (e) {
      setConfigError('Erreur lors de la suppression de la catégorie');
    }
  };

  // Add new status
  const handleAddStatus = async () => {
    setStatusError('');
    if (!newStatus.trim()) {
      setStatusError('Le nom du statut est requis.');
      return;
    }
    if (statuses.some(s => s.label.toLowerCase() === newStatus.trim().toLowerCase())) {
      setStatusError('Ce statut existe déjà.');
      return;
    }
    const id = newStatus.trim().toLowerCase().replace(/\s+/g, '-');
    try {
      const status = await ProjectConfigService.addStatus({ id, label: newStatus.trim(), color: newStatusColor });
      setStatuses([...statuses, status]);
      setNewStatus('');
      setNewStatusColor('bg-green-500');
      setShowAddStatusModal(false);
    } catch (e) {
      setStatusError('Erreur lors de l\'ajout du statut');
    }
  };

  // Remove status
  const handleRemoveStatus = async (id: string) => {
    try {
      await ProjectConfigService.removeStatus(id);
      setStatuses(statuses.filter(s => s.id !== id));
    } catch (e) {
      setConfigError('Erreur lors de la suppression du statut');
    }
  };
  // ...existing code...
  if (loadingConfig) return <div className="p-8 text-center text-gray-600">Chargement des catégories/statuts…</div>;
  if (configError) return <div className="p-8 text-center text-red-600">{configError}</div>;

  const [priorities] = useState([
    { id: 'high', label: 'Élevée', color: 'bg-red-500' },
    { id: 'medium', label: 'Moyenne', color: 'bg-yellow-500' },
    { id: 'low', label: 'Faible', color: 'bg-green-500' }
  ]);

  const [currentView, setCurrentView] = useState<'list' | 'edit' | 'create'>('list');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [showAddStatusModal, setShowAddStatusModal] = useState(false);

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

  const handleBulkDelete = () => {
    if (selectedProjects.length > 0 && confirm(`Êtes-vous sûr de vouloir supprimer ${selectedProjects.length} projet(s) ?`)) {
      selectedProjects.forEach(id => deleteProject(id));
      setSelectedProjects([]);
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedProjectId(null);
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map(p => p.id));
    }
  };

  const selectedProject = selectedProjectId ? fixProjectForEditor(projects.find(p => p.id === selectedProjectId)) : undefined;

  // Helper to ensure Project matches ProjectData (startDate/endDate always string)
  function fixProjectForEditor(project?: any): any {
    if (!project) return undefined;
    return {
      ...project,
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      members: Array.isArray(project.members) ? project.members : [],
      tags: Array.isArray(project.tags) ? project.tags : [],
      attachments: Array.isArray(project.attachments) ? project.attachments : [],
      links: Array.isArray(project.links) ? project.links : [],
      objectives: Array.isArray(project.objectives) ? project.objectives : [],
      requirements: Array.isArray(project.requirements) ? project.requirements : [],
      deliverables: Array.isArray(project.deliverables) ? project.deliverables : [],
      risks: Array.isArray(project.risks) ? project.risks : [],
    };
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = statuses.find(s => s.id === status);
    if (!statusConfig) return null;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${statusConfig.color}`}>
        {statusConfig.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = priorities.find(p => p.id === priority);
    if (!priorityConfig) return null;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${priorityConfig.color}`}>
        {priorityConfig.label}
      </span>
    );
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const getProjectStats = () => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'active').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const avgProgress = projects.reduce((sum, p) => sum + (p.progress || 0), 0) / total || 0;
    
    return { total, active, completed, avgProgress };
  };

  const stats = getProjectStats();

  if (currentView === 'edit' || currentView === 'create') {
    return (
      <ProjectEditor
        projectId={selectedProjectId || undefined}
        onSave={handleSaveProject}
        onCancel={handleCancel}
        initialData={selectedProject}
        isAdminMode={true}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Gestion des Projets</h1>
          <p className="text-sm text-gray-600 mt-1">Administration et supervision de tous les projets</p>
        </div>
        <button 
          onClick={handleCreateProject}
          className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Projet
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Terminés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Progression moy.</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(stats.avgProgress)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-4 flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700">Filtrer par:</span>
          
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
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
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Tous les statuts</option>
            {statuses.map(status => (
              <option key={status.id} value={status.id}>{status.label}</option>
            ))}
          </select>
          
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Toutes les priorités</option>
            {priorities.map(priority => (
              <option key={priority.id} value={priority.id}>{priority.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Bar */}
      {selectedProjects.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedProjects.length} projet(s) sélectionné(s)
            </span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => console.log('Export selected')}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Download className="h-4 w-4 mr-1" />
                Exporter
              </button>
              <button 
                onClick={() => console.log('Archive selected')}
                className="flex items-center px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
              >
                <Archive className="h-4 w-4 mr-1" />
                Archiver
              </button>
              <button 
                onClick={handleBulkDelete}
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300"
                  checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Projet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priorité
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progression
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Équipe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Échéance
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
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={selectedProjects.includes(project.id)}
                    onChange={() => handleSelectProject(project.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{project.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{project.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(project.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPriorityBadge(project.priority || 'medium')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900">{project.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-400" />
                    {project.membersList?.length || project.members}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.deadline}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditProject(project.id)}
                      className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                      title="Modifier"
                    >
                      <Edit className="h-3 w-3 text-gray-600" />
                    </button>
                    <button 
                      className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                      title="Voir"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <Eye className="h-3 w-3 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3 w-3 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun projet trouvé</p>
          </div>
        )}

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
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddCategory(); }}
            />
            <button
              className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
              onClick={handleAddCategory}
            >
              +
            </button>
      {/* Modale d'ajout de statut */}
      {showAddStatusModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded shadow-lg p-6 min-w-[350px]">
            <h2 className="text-lg font-bold mb-4">Ajouter un statut</h2>
            <form
              onSubmit={e => { e.preventDefault(); handleAddStatus(); }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du statut</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={newStatusColor}
                  onChange={e => setNewStatusColor(e.target.value)}
                >
                  <option value="bg-green-500">Vert</option>
                  <option value="bg-yellow-500">Jaune</option>
                  <option value="bg-blue-500">Bleu</option>
                  <option value="bg-red-500">Rouge</option>
                  <option value="bg-purple-500">Violet</option>
                  <option value="bg-gray-500">Gris</option>
                </select>
              </div>
              {statusError && <div className="text-red-600 text-sm">{statusError}</div>}
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => { setShowAddStatusModal(false); setStatusError(''); }}>Annuler</button>
                <button type="submit" className="px-4 py-2 bg-blue-900 text-white rounded">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}
          </div>
          
          <div className="space-y-1 max-h-48 overflow-y-auto border border-gray-300 rounded-lg">
            {categories.map((category, index) => (
              <div key={category} className={`flex items-center justify-between px-4 py-2 ${index % 2 === 1 ? 'bg-gray-50' : ''}`}>
                <span className="text-sm text-gray-700">{category}</span>
                <button className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300" onClick={() => handleRemoveCategory(category)}>
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
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') setShowAddStatusModal(true); }}
            />
            <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800" onClick={() => setShowAddStatusModal(true)}>
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
                <button className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300" onClick={() => handleRemoveStatus(status.id)}>
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