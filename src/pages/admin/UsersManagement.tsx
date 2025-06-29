import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Mail, Shield, User, UserCheck, UserX } from 'lucide-react';
import { UserEditor } from '../../components/admin/UserEditor';

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  joinDate: string;
  avatar: string;
  department?: string;
}

export const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: '1',
      name: 'Pierre Dupont',
      email: 'pierre.dupont@esst.edu',
      role: 'admin',
      status: 'active',
      lastLogin: '15/04/2025',
      joinDate: '01/09/2020',
      avatar: 'PD',
      department: 'Administration'
    },
    {
      id: '2',
      name: 'Marie Dubois',
      email: 'marie.dubois@esst.edu',
      role: 'teacher',
      status: 'active',
      lastLogin: '14/04/2025',
      joinDate: '15/09/2021',
      avatar: 'MD',
      department: 'Intelligence Artificielle'
    },
    {
      id: '3',
      name: 'Jean Martin',
      email: 'jean.martin@esst.edu',
      role: 'teacher',
      status: 'active',
      lastLogin: '13/04/2025',
      joinDate: '01/02/2022',
      avatar: 'JM',
      department: 'Cybersécurité'
    },
    {
      id: '4',
      name: 'Sophie Laurent',
      email: 'sophie.laurent@student.esst.edu',
      role: 'student',
      status: 'active',
      lastLogin: '15/04/2025',
      joinDate: '01/09/2024',
      avatar: 'SL',
      department: 'Master Data Science'
    },
    {
      id: '5',
      name: 'Alex Chen',
      email: 'alex.chen@student.esst.edu',
      role: 'student',
      status: 'pending',
      lastLogin: 'Jamais',
      joinDate: '10/04/2025',
      avatar: 'AC',
      department: 'Licence Informatique'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentView, setCurrentView] = useState<'list' | 'edit' | 'create'>('list');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-red-100 text-red-800',
      teacher: 'bg-blue-100 text-blue-800',
      student: 'bg-green-100 text-green-800'
    };
    
    const labels = {
      admin: 'Administrateur',
      teacher: 'Enseignant',
      student: 'Étudiant'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[role as keyof typeof styles]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      active: 'Actif',
      inactive: 'Inactif',
      pending: 'En attente'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = () => {
    setSelectedUserId(null);
    setCurrentView('create');
  };

  const handleEditUser = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentView('edit');
  };

  const handleSaveUser = (userData: UserAccount) => {
    if (selectedUserId) {
      // Update existing user
      setUsers(prev => prev.map(user => 
        user.id === selectedUserId ? { ...userData, id: selectedUserId } : user
      ));
    } else {
      // Create new user
      const newUser = {
        ...userData,
        id: (users.length + 1).toString()
      };
      setUsers(prev => [...prev, newUser]);
    }
    setCurrentView('list');
    setSelectedUserId(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive' | 'pending' }
        : user
    ));
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedUserId(null);
  };

  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : undefined;

  if (currentView === 'edit' || currentView === 'create') {
    return (
      <UserEditor
        userId={selectedUserId || undefined}
        onSave={handleSaveUser}
        onCancel={handleCancel}
        initialData={selectedUser}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Gestion des Utilisateurs</h1>
        <button 
          onClick={handleCreateUser}
          className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Utilisateur
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <UserX className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filtrer par:</span>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Administrateur</option>
            <option value="teacher">Enseignant</option>
            <option value="student">Étudiant</option>
          </select>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="pending">En attente</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière connexion
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {user.avatar}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {user.department && (
                        <div className="text-xs text-gray-400">{user.department}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditUser(user.id)}
                      className="text-blue-600 hover:text-blue-900" 
                      title="Éditer"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900" title="Envoyer un email">
                      <Mail className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(user.id)}
                      className="text-yellow-600 hover:text-yellow-900" 
                      title={user.status === 'active' ? 'Désactiver' : 'Activer'}
                    >
                      {user.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900" 
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};