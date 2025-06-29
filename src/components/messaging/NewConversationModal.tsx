import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Users, 
  MessageCircle, 
  Phone, 
  Video, 
  Globe,
  Lock,
  Hash,
  Briefcase,
  GraduationCap,
  UserCheck,
  Crown,
  Shield
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateConversation: (participants: string[], name?: string, type?: 'individual' | 'group', conversationType?: string) => string;
}

export const NewConversationModal: React.FC<NewConversationModalProps> = ({
  isOpen,
  onClose,
  onCreateConversation
}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [conversationName, setConversationName] = useState('');
  const [conversationType, setConversationType] = useState<'individual' | 'group'>('individual');
  const [conversationCategory, setConversationCategory] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [step, setStep] = useState(1); // 1: Type, 2: Participants, 3: Settings

  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Prof. Marie Dubois',
      email: 'marie.dubois@esst.edu',
      avatar: 'MD',
      role: 'Professeur',
      department: 'Intelligence Artificielle',
      isOnline: true
    },
    {
      id: '2',
      name: 'Thomas Lambert',
      email: 'thomas.lambert@student.esst.edu',
      avatar: 'TL',
      role: 'Étudiant',
      department: 'Master Data Science',
      isOnline: false,
      lastSeen: new Date(Date.now() - 3600000)
    },
    {
      id: '3',
      name: 'Sophie Martin',
      email: 'sophie.martin@student.esst.edu',
      avatar: 'SM',
      role: 'Étudiant',
      department: 'Licence Informatique',
      isOnline: true
    },
    {
      id: '4',
      name: 'Alex Chen',
      email: 'alex.chen@student.esst.edu',
      avatar: 'AC',
      role: 'Étudiant',
      department: 'Master Cybersécurité',
      isOnline: false,
      lastSeen: new Date(Date.now() - 7200000)
    },
    {
      id: '5',
      name: 'Dr. Jean Martin',
      email: 'jean.martin@esst.edu',
      avatar: 'JM',
      role: 'Docteur',
      department: 'Cybersécurité',
      isOnline: true
    },
    {
      id: '6',
      name: 'Emma Rousseau',
      email: 'emma.rousseau@student.esst.edu',
      avatar: 'ER',
      role: 'Étudiant',
      department: 'Master IA',
      isOnline: true
    },
    {
      id: '7',
      name: 'Lucas Moreau',
      email: 'lucas.moreau@esst.edu',
      avatar: 'LM',
      role: 'Assistant',
      department: 'Électronique',
      isOnline: false,
      lastSeen: new Date(Date.now() - 1800000)
    },
    {
      id: '8',
      name: 'Camille Bernard',
      email: 'camille.bernard@student.esst.edu',
      avatar: 'CB',
      role: 'Étudiant',
      department: 'Licence Informatique',
      isOnline: true
    }
  ];

  const conversationTypes = [
    {
      id: 'individual',
      title: 'Conversation individuelle',
      description: 'Discussion privée avec une seule personne',
      icon: MessageCircle,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'group',
      title: 'Groupe de discussion',
      description: 'Conversation avec plusieurs participants',
      icon: Users,
      color: 'bg-green-100 text-green-600'
    }
  ];

  const conversationCategories = [
    {
      id: 'general',
      title: 'Général',
      description: 'Discussion générale',
      icon: MessageCircle,
      color: 'bg-gray-100 text-gray-600'
    },
    {
      id: 'project',
      title: 'Projet',
      description: 'Collaboration sur un projet',
      icon: Briefcase,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'course',
      title: 'Cours',
      description: 'Discussion liée à un cours',
      icon: GraduationCap,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'study',
      title: 'Groupe d\'étude',
      description: 'Session d\'étude collaborative',
      icon: Users,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'announcement',
      title: 'Annonces',
      description: 'Canal d\'annonces importantes',
      icon: Hash,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'support',
      title: 'Support',
      description: 'Aide et assistance',
      icon: Shield,
      color: 'bg-red-100 text-red-600'
    }
  ];

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserToggle = (userId: string) => {
    if (conversationType === 'individual') {
      setSelectedUsers([userId]);
    } else {
      setSelectedUsers(prev =>
        prev.includes(userId)
          ? prev.filter(id => id !== userId)
          : [...prev, userId]
      );
    }
  };

  const handleCreateConversation = () => {
    if (selectedUsers.length > 0) {
      const name = conversationType === 'group' ? conversationName : undefined;
      const newConvId = onCreateConversation(selectedUsers, name, conversationType, conversationCategory);
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedUsers([]);
    setConversationName('');
    setConversationType('individual');
    setConversationCategory('general');
    setSearchTerm('');
    setIsPrivate(false);
    setStep(1);
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'professeur':
        return <Crown className="h-3 w-3 text-yellow-600" />;
      case 'docteur':
        return <Shield className="h-3 w-3 text-purple-600" />;
      case 'assistant':
        return <UserCheck className="h-3 w-3 text-blue-600" />;
      default:
        return <GraduationCap className="h-3 w-3 text-gray-600" />;
    }
  };

  const getOnlineStatus = (user: User) => {
    if (user.isOnline) {
      return 'En ligne';
    } else if (user.lastSeen) {
      const diffInMinutes = (new Date().getTime() - user.lastSeen.getTime()) / (1000 * 60);
      if (diffInMinutes < 60) {
        return `Vu il y a ${Math.floor(diffInMinutes)} min`;
      } else if (diffInMinutes < 1440) {
        return `Vu il y a ${Math.floor(diffInMinutes / 60)}h`;
      } else {
        return `Vu il y a ${Math.floor(diffInMinutes / 1440)}j`;
      }
    }
    return 'Hors ligne';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Nouvelle conversation</h3>
            <p className="text-sm text-gray-500 mt-1">
              Étape {step} sur 3 - {
                step === 1 ? 'Type de conversation' :
                step === 2 ? 'Sélection des participants' :
                'Configuration'
              }
            </p>
          </div>
          <button
            onClick={() => { onClose(); resetForm(); }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-2">
          <div className="flex space-x-2">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  stepNumber <= step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Type de conversation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {conversationTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setConversationType(type.id as 'individual' | 'group')}
                        className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-md ${
                          conversationType === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${type.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <h5 className="font-semibold text-gray-900 mb-2">{type.title}</h5>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {conversationType === 'group' && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Catégorie</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {conversationCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setConversationCategory(category.id)}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            conversationCategory === category.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${category.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <h6 className="font-medium text-gray-900 text-sm">{category.title}</h6>
                          <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Sélectionner les participants
                  {conversationType === 'individual' && ' (1 personne)'}
                  {conversationType === 'group' && ` (${selectedUsers.length} sélectionné${selectedUsers.length > 1 ? 's' : ''})`}
                </h4>
                
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email ou département..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Users list */}
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <label
                      key={user.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedUsers.includes(user.id)
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <input
                        type={conversationType === 'individual' ? 'radio' : 'checkbox'}
                        name={conversationType === 'individual' ? 'participant' : undefined}
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserToggle(user.id)}
                        className="rounded"
                      />
                      
                      <div className="relative">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.avatar}
                        </div>
                        {user.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          {getRoleIcon(user.role)}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">{user.department}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className={`text-xs ${user.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                            {getOnlineStatus(user)}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun utilisateur trouvé</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Configuration de la conversation</h4>
                
                {conversationType === 'group' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du groupe
                      </label>
                      <input
                        type="text"
                        value={conversationName}
                        onChange={(e) => setConversationName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nom du groupe"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">Conversation privée</h5>
                        <p className="text-xs text-gray-500">Seuls les membres invités peuvent rejoindre</p>
                      </div>
                      <button
                        onClick={() => setIsPrivate(!isPrivate)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isPrivate ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isPrivate ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Résumé</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">
                        {conversationType === 'individual' ? 'Individuelle' : 'Groupe'}
                      </span>
                    </div>
                    {conversationType === 'group' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Catégorie:</span>
                          <span className="font-medium">
                            {conversationCategories.find(c => c.id === conversationCategory)?.title}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Visibilité:</span>
                          <span className="font-medium">{isPrivate ? 'Privée' : 'Publique'}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Participants:</span>
                      <span className="font-medium">{selectedUsers.length}</span>
                    </div>
                  </div>
                </div>

                {/* Selected participants preview */}
                {selectedUsers.length > 0 && (
                  <div className="mt-4">
                    <h6 className="text-sm font-medium text-gray-900 mb-2">Participants sélectionnés</h6>
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers.map(userId => {
                        const user = mockUsers.find(u => u.id === userId);
                        if (!user) return null;
                        return (
                          <div key={userId} className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {user.avatar}
                            </div>
                            <span>{user.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Précédent
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => { onClose(); resetForm(); }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 2 && selectedUsers.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleCreateConversation}
                disabled={selectedUsers.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Créer la conversation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};