import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { settings } = useSettings();

  const navigationItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Formation', href: '/formation' },
    { name: 'Recherche', href: '/recherche' },
    { name: 'Actualités', href: '/actualites' },
    { name: 'Newsletter', href: '/newsletter' },
  ];

  const authenticatedItems = [
    { name: 'Cours', href: '/cours' },
    { name: 'Projets', href: '/projects' },
    { name: 'Messages', href: '/messaging' },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const LogoComponent = () => {
    if (settings.logoUrl) {
      return (
        <img
          src={settings.logoUrl}
          alt={settings.siteName}
          className="h-10 w-auto max-w-[200px] object-contain"
          onError={(e) => {
            // Fallback to default logo if image fails to load
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
      );
    }
    
    return (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-[#1A4B8C] font-bold text-xl">E</span>
        </div>
        <span className="text-white font-bold text-lg lg:text-xl">
          {settings.siteName}
        </span>
      </div>
    );
  };

  return (
    <nav className="bg-[#1A4B8C] shadow-lg" style={{ backgroundColor: settings.primaryColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Title */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <LogoComponent />
              {/* Fallback logo (hidden by default, shown if image fails) */}
              {settings.logoUrl && (
                <div className="hidden items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <span className="text-[#1A4B8C] font-bold text-xl">E</span>
                  </div>
                  <span className="text-white font-bold text-lg lg:text-xl">
                    {settings.siteName}
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1 bg-[#1A4B8C] border border-white rounded-md px-4 py-2" style={{ backgroundColor: settings.primaryColor }}>
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded ${
                    isActivePath(item.href)
                      ? 'text-[#1A4B8C] bg-white'
                      : 'text-white hover:text-gray-200'
                  }`}
                  style={isActivePath(item.href) ? { color: settings.primaryColor } : {}}
                >
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated && authenticatedItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded ${
                    isActivePath(item.href)
                      ? 'text-[#1A4B8C] bg-white'
                      : 'text-white hover:text-gray-200'
                  }`}
                  style={isActivePath(item.href) ? { color: settings.primaryColor } : {}}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="p-2 rounded-md text-white hover:text-gray-200 hover:bg-blue-700 transition-colors duration-200"
                      title="Administration"
                    >
                      <Settings size={18} />
                    </Link>
                  )}
                  <div className="relative group">
                    <button 
                      className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full font-medium hover:bg-gray-100 transition-colors duration-200"
                      style={{ color: settings.primaryColor }}
                    >
                      <User size={16} />
                      <span className="text-sm">{user?.name}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors duration-200"
                      >
                        <LogOut size={16} />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                  style={{ 
                    backgroundColor: settings.secondaryColor,
                    color: '#2D3748'
                  }}
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-white hover:text-gray-200 hover:bg-blue-700 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-blue-600" style={{ backgroundColor: settings.primaryColor, borderColor: `${settings.primaryColor}CC` }}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActivePath(item.href)
                    ? 'bg-white'
                    : 'text-white hover:text-gray-200 hover:bg-blue-700'
                }`}
                style={isActivePath(item.href) ? { color: settings.primaryColor } : {}}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated && authenticatedItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActivePath(item.href)
                    ? 'bg-white'
                    : 'text-white hover:text-gray-200 hover:bg-blue-700'
                }`}
                style={isActivePath(item.href) ? { color: settings.primaryColor } : {}}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Mobile User Menu */}
          <div className="pt-4 pb-3 border-t border-blue-600" style={{ borderColor: `${settings.primaryColor}CC` }}>
            <div className="px-2 space-y-1">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-white text-sm">
                    Connecté en tant que: <span className="font-medium">{user?.name}</span>
                  </div>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Settings size={18} />
                      <span>Administration</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-blue-700 w-full text-left transition-colors duration-200"
                  >
                    <LogOut size={18} />
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 mx-3 text-center"
                  style={{ 
                    backgroundColor: settings.secondaryColor,
                    color: '#2D3748'
                  }}
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};