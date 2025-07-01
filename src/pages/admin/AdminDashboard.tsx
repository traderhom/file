import React from 'react';
import { BarChart3, Users, FileText, FolderOpen } from 'lucide-react';
import { useUserStats, useProjectStats, useVisitorStats } from '../../hooks/useRealTimeStats';
import { usePages } from '../../contexts/PageContext';

export const AdminDashboard: React.FC = () => {
  const { userStats } = useUserStats();
  const { projectStats } = useProjectStats();
  const { visitorStats } = useVisitorStats();
  const { pages } = usePages();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h1>

      {/* Stats Cards dynamiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pages</p>
              <p className="text-2xl font-bold text-gray-900">{pages?.length ?? '-'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{userStats?.totalUsers ?? '-'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FolderOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Projets</p>
              <p className="text-2xl font-bold text-gray-900">{projectStats?.totalProjects ?? '-'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Visiteurs</p>
              <p className="text-2xl font-bold text-gray-900">{visitorStats?.monthlyVisitors ?? '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <p className="text-sm text-gray-600">
                Nouvelle page "Admission 2025/2026" créée - il y a 2 heures
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <p className="text-sm text-gray-600">
                Projet "IA & Machine Learning" mis à jour - il y a 4 heures
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              <p className="text-sm text-gray-600">
                15 nouveaux utilisateurs inscrits - il y a 1 jour
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};