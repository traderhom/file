import React, { useState } from 'react';
import { Save, ArrowLeft, Users, Calendar, FolderOpen } from 'lucide-react';

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
}

interface ProjectEditorProps {
  projectId?: string;
  onSave: (projectData: ProjectData) => void;
  onCancel: () => void;
  initialData?: ProjectData;
}

export const ProjectEditor: React.FC<ProjectEditorProps> = ({
  projectId,
  onSave,
  onCancel,
  initialData
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
    ...initialData
  });

  const [newMember, setNewMember] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const categories = ['Développement Web', 'IA & Machine Learning', 'Data Science', 'Cybersécurité', 'Électronique'];

  const handleInputChange = (field: keyof ProjectData, value: string | number | string[]) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
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

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du projet
                </label>
                <input
                  type="text"
                  value={projectData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom du projet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={projectData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Description du projet..."
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
              </div>

              <div className="grid grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progression (%)
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
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Membres de l'équipe
                </label>
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="text"
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMember())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom du membre..."
                  />
                  <button
                    onClick={addMember}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Users className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {projectData.members.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                    >
                      <span className="text-sm text-gray-900">{member}</span>
                      <button
                        onClick={() => removeMember(member)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {projectData.members.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Aucun membre ajouté
                  </p>
                )}
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
                    <span className="font-medium">{projectData.status}</span>
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
        </div>
      </div>
    </div>
  );
};