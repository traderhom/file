import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  FileText, 
  FolderOpen, 
  Users, 
  BookOpen, 
  Tag, 
  FileImage, 
  Settings,
  LogOut,
  Home,
  Calendar,
  Newspaper
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarItems = [
    { path: '/admin/dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { path: '/admin/content', label: 'Pages', icon: FileText },
    { path: '/admin/news', label: 'Actualités', icon: Newspaper },
    { path: '/admin/events', label: 'Événements', icon: Calendar },
    { path: '/admin/courses', label: 'Formations', icon: BookOpen },
    { path: '/admin/media', label: 'Médias', icon: FileImage },
    { path: '/admin/projects', label: 'Projets', icon: FolderOpen },
    { path: '/admin/users', label: 'Utilisateurs', icon: Users },
    { path: '/admin/settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-blue-600 hover:text-blue-800">
                <Home className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                ESST - Administration du Contenu
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Admin • {user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Gestion de Contenu
            </h2>
            <div className="h-0.5 bg-blue-400 mb-6"></div>
            
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-900 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};