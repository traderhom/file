import React, { useState } from 'react';
import { Save, ArrowLeft, User, Mail, Shield } from 'lucide-react';

interface UserData {
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'inactive' | 'pending';
  department?: string;
  avatar: string;
  joinDate: string;
  lastLogin: string;
}

interface UserEditorProps {
  userId?: string;
  onSave: (userData: UserData) => void;
  onCancel: () => void;
  initialData?: UserData;
}

export const UserEditor: React.FC<UserEditorProps> = ({
  userId,
  onSave,
  onCancel,
  initialData
}) => {
  const [userData, setUserData] = useState<UserData>({
    id: userId || '',
    name: '',
    email: '',
    role: 'student',
    status: 'active',
    department: '',
    avatar: '',
    joinDate: new Date().toLocaleDateString('fr-FR'),
    lastLogin: 'Jamais',
    ...initialData
  });

  const [isSaving, setIsSaving] = useState(false);

  const roles = [
    { value: 'admin', label: 'Administrateur' },
    { value: 'teacher', label: 'Enseignant' },
    { value: 'student', label: 'Étudiant' }
  ];

  const departments = [
    'Administration',
    'Intelligence Artificielle',
    'Cybersécurité',
    'Data Science',
    'Électronique',
    'Master Data Science',
    'Licence Informatique'
  ];

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate avatar from name
    if (field === 'name' && value.trim()) {
      const nameParts = value.trim().split(' ');
      const avatar = nameParts.length > 1 
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : `${nameParts[0][0]}${nameParts[0][1] || ''}`.toUpperCase();
      setUserData(prev => ({ ...prev, avatar }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSave = {
        ...userData,
        id: userId || Date.now().toString()
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
              {userId ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
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

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="space-y-6">
            {/* Avatar Preview */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">
                  {userData.avatar || 'U'}
                </span>
              </div>
              <p className="text-sm text-gray-500">Avatar généré automatiquement</p>
            </div>

            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Prénom Nom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@esst.edu"
                />
              </div>
            </div>

            {/* Role and Status */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <select
                  value={userData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={userData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="pending">En attente</option>
                </select>
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Département/Formation
              </label>
              <select
                value={userData.department || ''}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner un département</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Informations supplémentaires</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Date d'inscription:</span>
                  <p className="font-medium">{userData.joinDate}</p>
                </div>
                <div>
                  <span className="text-gray-600">Dernière connexion:</span>
                  <p className="font-medium">{userData.lastLogin}</p>
                </div>
              </div>
            </div>

            {/* Permissions */}
            {userData.role === 'admin' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 text-red-600 mr-2" />
                  <h4 className="text-sm font-medium text-red-800">Privilèges Administrateur</h4>
                </div>
                <p className="text-sm text-red-700">
                  Cet utilisateur aura accès à toutes les fonctions d'administration du système.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};