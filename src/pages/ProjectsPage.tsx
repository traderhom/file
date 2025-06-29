import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Users, 
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../contexts/ProjectsContext';
import { Navbar } from '../components/Navbar';

export const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const { projects } = useProjects();

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    
    const labels = {
      active: 'Actif',
      draft: 'Brouillon',
      completed: 'Terminé'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Projets collaboratifs</h1>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Créer un projet
          </button>
        </div>

        {/* Projects List View */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          {/* Filter Bar */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg">
              <option>Catégorie</option>
              <option>Développement Web</option>
              <option>IA & ML</option>
              <option>Data Science</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg">
              <option>Statut</option>
              <option>Actif</option>
              <option>Brouillon</option>
              <option>Terminé</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg">
              <option>Trier par</option>
              <option>Date de création</option>
              <option>Échéance</option>
              <option>Progression</option>
            </select>
          </div>

          {/* Project Cards */}
          <div className="grid lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                    {getStatusBadge(project.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{project.category}</p>
                  <div className="h-0.5 bg-gray-200 mb-3"></div>
                  <p className="text-sm text-gray-700">{project.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Progression: {project.progress}%</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{project.members} membres</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {project.status === 'completed' ? 'Achevé le:' : 'Échéance:'} {project.deadline}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};