import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Users, Calendar, FolderOpen, Plus, X, Upload, FileText, Link as LinkIcon } from 'lucide-react';

interface ProjectData {
  id?: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'draft' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  members: string[];
  progress: number;
  priority: 'low' | 'medium' | 'high';
  budget?: number;
  tags: string[];
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: string;
  }>;
  links: Array<{
    id: string;
    title: string;
    url: string;
  }>;
  objectives: string[];
  requirements: string[];
  deliverables: string[];
  risks: string[];
  notes: string;
  createdBy: string;
  createdAt: string;
  lastModified: string;
}

interface ProjectEditorProps {
  projectId?: string;
  onSave: (projectData: ProjectData) => void;
  onCancel: () => void;
  initialData?: ProjectData;
  isAdminMode?: boolean;
}

export const ProjectEditor: React.FC<ProjectEditorProps> = ({
  projectId,
  onSave,
  onCancel,
  initialData,
  isAdminMode = false
}) => {
  const [projectData, setProjectData] = useState<ProjectData>({
    id: projectId || '',
    title: '',
    description: '',
    category: 'Développement Web',
    status: 'draft',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    members: [],
    progress: 0,
    priority: 'medium',
    budget: 0,
    tags: [],
    attachments: [],
    links: [],
    objectives: [],
    requirements: [],
    deliverables: [],
    risks: [],
    notes: '',
    createdBy: 'Utilisateur actuel',
    createdAt: new Date().toLocaleDateString('fr-FR'),
    lastModified: new Date().toLocaleDateString('fr-FR'),
    ...initialData
  });

  const [newMember, setNewMember] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newDeliverable, setNewDeliverable] = useState('');
  const [newRisk, setNewRisk] = useState('');
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const categories = [
    'Développement Web', 
    'IA & Machine Learning', 
    'Data Science', 
    'Cybersécurité', 
    'Électronique',
    'Recherche',
    'Formation',
    'Innovation',
    'Consulting'
  ];

  const availableMembers = [
    'Sophie Laurent', 'Thomas Lambert', 'Marie Dubois', 'Alex Chen', 
    'Emma Rousseau', 'Lucas Moreau', 'Camille Bernard', 'Pierre Martin',
    'Julie Petit', 'Nicolas Blanc', 'Sarah Durand', 'Antoine Leroy'
  ];

  const tabs = [
    { id: 'general', label: 'Général', icon: FolderOpen },
    { id: 'team', label: 'Équipe', icon: Users },
    { id: 'planning', label: 'Planning', icon: Calendar },
    { id: 'details', label: 'Détails', icon: FileText },
    { id: 'resources', label: 'Ressources', icon: LinkIcon }
  ];

  useEffect(() => {
    if (initialData) {
      setProjectData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof ProjectData, value: any) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value,
      lastModified: new Date().toLocaleDateString('fr-FR')
    }));
  };

  const addMember = () => {
    if (newMember.trim() && !projectData.members.includes(newMember.trim())) {
      setProjectData(prev => ({
        ...prev,
        members: [...prev.members, newMember.trim()]
      }));
      setNewMember('');
    }
  };

  const removeMember = (memberToRemove: string) => {
    setProjectData(prev => ({
      ...prev,
      members: prev.members.filter(member => member !== memberToRemove)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !projectData.tags.includes(newTag.trim())) {
      setProjectData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProjectData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setProjectData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setProjectData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setProjectData(prev => ({
        ...prev,
        deliverables: [...prev.deliverables, newDeliverable.trim()]
      }));
      setNewDeliverable('');
    }
  };

  const removeDeliverable = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }));
  };

  const addRisk = () => {
    if (newRisk.trim()) {
      setProjectData(prev => ({
        ...prev,
        risks: [...prev.risks, newRisk.trim()]
      }));
      setNewRisk('');
    }
  };

  const removeRisk = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      risks: prev.risks.filter((_, i) => i !== index)
    }));
  };

  const addLink = () => {
    if (newLink.title.trim() && newLink.url.trim()) {
      setProjectData(prev => ({
        ...prev,
        links: [...prev.links, {
          id: Date.now().toString(),
          title: newLink.title.trim(),
          url: newLink.url.trim()
        }]
      }));
      setNewLink({ title: '', url: '' });
    }
  };

  const removeLink = (linkId: string) => {
    setProjectData(prev => ({
      ...prev,
      links: prev.links.filter(link => link.id !== linkId)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSave = {
        ...projectData,
        id: projectId || Date.now().toString()
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(dataToSave);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onCancel}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {projectId ? 'Modifier le projet' : 'Nouveau projet'}
            </h1>
            {isAdminMode && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                Mode Admin
              </span>
            )}
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'general' && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre du projet *
                    </label>
                    <input
                      type="text"
                      value={projectData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nom du projet"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={projectData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Description détaillée du projet..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie
                      </label>
                      <select
                        value={projectData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priorité
                      </label>
                      <select
                        value={projectData.priority}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="low">Faible</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Élevée</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ajouter un tag..."
                      />
                      <button
                        onClick={addTag}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {projectData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <select
                      value={projectData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="draft">Brouillon</option>
                      <option value="active">Actif</option>
                      <option value="completed">Terminé</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget (€)
                    </label>
                    <input
                      type="number"
                      value={projectData.budget || 0}
                      onChange={(e) => handleInputChange('budget', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Progression ({projectData.progress}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={projectData.progress}
                      onChange={(e) => handleInputChange('progress', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>0%</span>
                      <span className="font-medium">{projectData.progress}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={projectData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Notes et commentaires..."
                    />
                  </div>

                  {/* Project Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Résumé du projet</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Catégorie:</span>
                        <span className="font-medium">{projectData.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Statut:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(projectData.status)}`}>
                          {projectData.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priorité:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(projectData.priority)}`}>
                          {projectData.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Membres:</span>
                        <span className="font-medium">{projectData.members.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Progression:</span>
                        <span className="font-medium">{projectData.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Membres de l'équipe
                  </label>
                  <div className="flex items-center space-x-2 mb-4">
                    <select
                      value={newMember}
                      onChange={(e) => setNewMember(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionner un membre...</option>
                      {availableMembers.filter(member => !projectData.members.includes(member)).map(member => (
                        <option key={member} value={member}>{member}</option>
                      ))}
                    </select>
                    <button
                      onClick={addMember}
                      disabled={!newMember}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {projectData.members.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {member.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{member}</span>
                        </div>
                        <button
                          onClick={() => removeMember(member)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {projectData.members.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-8">
                      Aucun membre ajouté
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'planning' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={projectData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de fin prévue
                    </label>
                    <input
                      type="date"
                      value={projectData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Informations de planning</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Créé le:</span>
                      <span className="font-medium">{projectData.createdAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Créé par:</span>
                      <span className="font-medium">{projectData.createdBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dernière modification:</span>
                      <span className="font-medium">{projectData.lastModified}</span>
                    </div>
                    {projectData.startDate && projectData.endDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Durée prévue:</span>
                        <span className="font-medium">
                          {Math.ceil((new Date(projectData.endDate).getTime() - new Date(projectData.startDate).getTime()) / (1000 * 60 * 60 * 24))} jours
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Objectives */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objectifs
                    </label>
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="text"
                        value={newObjective}
                        onChange={(e) => setNewObjective(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ajouter un objectif..."
                      />
                      <button
                        onClick={addObjective}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {projectData.objectives.map((objective, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-sm text-gray-900">{objective}</span>
                          <button
                            onClick={() => removeObjective(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exigences
                    </label>
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="text"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ajouter une exigence..."
                      />
                      <button
                        onClick={addRequirement}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {projectData.requirements.map((requirement, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-sm text-gray-900">{requirement}</span>
                          <button
                            onClick={() => removeRequirement(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Deliverables */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Livrables
                    </label>
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="text"
                        value={newDeliverable}
                        onChange={(e) => setNewDeliverable(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDeliverable())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ajouter un livrable..."
                      />
                      <button
                        onClick={addDeliverable}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {projectData.deliverables.map((deliverable, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-sm text-gray-900">{deliverable}</span>
                          <button
                            onClick={() => removeDeliverable(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risks */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Risques
                    </label>
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="text"
                        value={newRisk}
                        onChange={(e) => setNewRisk(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRisk())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ajouter un risque..."
                      />
                      <button
                        onClick={addRisk}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {projectData.risks.map((risk, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-sm text-gray-900">{risk}</span>
                          <button
                            onClick={() => removeRisk(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-6">
                {/* Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Liens utiles
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <input
                      type="text"
                      value={newLink.title}
                      onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Titre du lien..."
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="url"
                        value={newLink.url}
                        onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://..."
                      />
                      <button
                        onClick={addLink}
                        disabled={!newLink.title || !newLink.url}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {projectData.links.map((link) => (
                      <div key={link.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <LinkIcon className="h-4 w-4 text-gray-500" />
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {link.title}
                          </a>
                        </div>
                        <button
                          onClick={() => removeLink(link.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* File Upload Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fichiers joints
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Choisir des fichiers
                    </button>
                  </div>
                  
                  {projectData.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {projectData.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-900">{attachment.name}</span>
                            <span className="text-xs text-gray-500">({attachment.size})</span>
                          </div>
                          <button className="text-red-600 hover:text-red-800">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};