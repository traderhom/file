import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Edit, 
  Users, 
  CheckCircle,
  Circle,
  FileText,
  MessageCircle,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const project = {
    id: '1',
    title: 'Développement d\'une application web avec Django',
    description: 'Projet de fin d\'études visant à créer une application web complète avec Django',
    category: 'Développement Web',
    status: 'active',
    progress: 50,
    startDate: '16/04/2025',
    endDate: '16/06/2025',
    members: [
      { id: '1', name: 'John Doe', role: 'Responsable', avatar: 'JD', color: 'bg-blue-600' },
      { id: '2', name: 'Marie Martin', role: 'Membre', avatar: 'MM', color: 'bg-teal-600' },
      { id: '3', name: 'Alex Dubois', role: 'Membre', avatar: 'AD', color: 'bg-orange-600' },
      { id: '4', name: 'Sophie Laurent', role: 'Membre', avatar: 'SL', color: 'bg-purple-600' }
    ],
    milestones: [
      { id: '1', title: 'Analyse et conception', deadline: '30/04/2025', status: 'completed' },
      { id: '2', title: 'Développement des modèles et backend', deadline: '20/05/2025', status: 'active' },
      { id: '3', title: 'Développement frontend et interfaces', deadline: '05/06/2025', status: 'pending' },
      { id: '4', title: 'Tests et déploiement', deadline: '15/06/2025', status: 'pending' }
    ],
    recentActivity: [
      'John Doe a ajouté un document "Documentation API" - il y a 2 heures',
      'Marie Martin a complété l\'étape "Analyse et conception" - il y a 1 jour',
      'Alex Dubois a créé une discussion "Architecture backend" - il y a 2 jours'
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: FileText },
    { id: 'members', label: 'Membres', icon: Users },
    { id: 'milestones', label: 'Étapes', icon: CheckCircle },
    { id: 'resources', label: 'Ressources', icon: FileText },
    { id: 'discussions', label: 'Discussions', icon: MessageCircle },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{project.title}</h1>
              <p className="text-gray-600">{project.description}</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </button>
          </div>
        </div>

        {/* Project Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
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

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                    <p className="text-gray-700 mb-4">
                      Ce projet a pour objectif de développer une application web complète en utilisant le framework Django. 
                      Les étudiants travailleront en équipe pour concevoir et mettre en œuvre une solution répondant à un besoin réel.
                    </p>
                    <p className="text-gray-700">
                      L'application devra inclure une gestion des utilisateurs, des interfaces adaptatives, et une base de données relationnelle.
                    </p>
                  </div>

                  {/* Milestones */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Étapes du projet</h3>
                    <div className="space-y-4">
                      {project.milestones.map((milestone, index) => (
                        <div key={milestone.id} className="flex items-start space-x-3">
                          <div className="relative">
                            {milestone.status === 'completed' ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                            ) : milestone.status === 'active' ? (
                              <Circle className="h-5 w-5 text-blue-500 mt-0.5" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-300 mt-0.5" />
                            )}
                            {index < project.milestones.length - 1 && (
                              <div className={`absolute top-6 left-2.5 w-0.5 h-8 ${
                                milestone.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                              }`}></div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                            <p className="text-sm text-gray-600">
                              Échéance: {milestone.deadline} - {
                                milestone.status === 'completed' ? 'Complété' :
                                milestone.status === 'active' ? 'En cours' : 'À venir'
                              }
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
                    <div className="space-y-3">
                      {project.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5"></div>
                          <p className="text-sm text-gray-700">{activity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Project Info */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Catégorie</span>
                        <p className="text-sm text-gray-900">{project.category}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Statut</span>
                        <p className="text-sm text-gray-900">Actif</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Date de début</span>
                        <p className="text-sm text-gray-900">{project.startDate}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Date de fin prévue</span>
                        <p className="text-sm text-gray-900">{project.endDate}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Progression globale</span>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 text-right">{project.progress}%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Équipe</h3>
                    
                    <div className="space-y-3">
                      {project.members.map((member) => (
                        <div key={member.id} className="flex items-center space-x-3">
                          <div className={`w-9 h-9 ${member.color} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                            {member.avatar}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-600">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="w-full mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      Inviter un membre
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'overview' && (
              <div className="text-center py-12">
                <p className="text-gray-500">Contenu de l'onglet "{tabs.find(t => t.id === activeTab)?.label}" à implémenter</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};