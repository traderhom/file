import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  Edit3,
  Trash2,
  Reply,
  Download,
  Image as ImageIcon,
  File,
  X,
  UserPlus,
  Settings,
  PhoneCall,
  VideoIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMessaging, Message, Conversation } from '../contexts/MessagingContext';
import { Navbar } from '../components/Navbar';
import { CallModal } from '../components/messaging/CallModal';
import { NewConversationModal } from '../components/messaging/NewConversationModal';
import { StickerPicker } from '../components/messaging/StickerPicker';

export const MessagingPage: React.FC = () => {
  const { user } = useAuth();
  const {
    conversations,
    activeConversation,
    isTyping,
    setActiveConversation,
    sendMessage,
    createConversation,
    markAsRead,
    deleteMessage,
    editMessage,
    setTyping,
    getConversationMessages
  } = useMessaging();

  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showConversationInfo, setShowConversationInfo] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  
  // Call states
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [callParticipant, setCallParticipant] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const stickerPickerRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(c => c.id === activeConversation);
  const currentMessages = activeConversation ? getConversationMessages(activeConversation) : [];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (activeConversation) {
      markAsRead(activeConversation);
    }
  }, [activeConversation, markAsRead]);

  // Handle typing indicator
  useEffect(() => {
    if (activeConversation && newMessage.trim()) {
      if (!isUserTyping) {
        setIsUserTyping(true);
        setTyping(activeConversation, true);
      }
    } else if (isUserTyping) {
      setIsUserTyping(false);
      setTyping(activeConversation!, false);
    }
  }, [newMessage, activeConversation, isUserTyping, setTyping]);

  // Close sticker picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stickerPickerRef.current && !stickerPickerRef.current.contains(event.target as Node)) {
        setShowStickerPicker(false);
      }
    };

    if (showStickerPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStickerPicker]);

  // Simulate incoming call (demo)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (conversations.length > 0 && !showCallModal) {
        const randomConv = conversations[Math.floor(Math.random() * conversations.length)];
        if (randomConv.participants.length > 0) {
          setCallParticipant({
            id: randomConv.participants[0].id,
            name: randomConv.participants[0].name,
            avatar: randomConv.participants[0].avatar,
            isOnline: randomConv.participants[0].isOnline
          });
          setCallType(Math.random() > 0.5 ? 'video' : 'audio');
          setIsIncomingCall(true);
          setShowCallModal(true);
        }
      }
    }, 30000); // Simulate incoming call after 30 seconds

    return () => clearTimeout(timer);
  }, [conversations, showCallModal]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && activeConversation) {
      sendMessage(activeConversation, newMessage.trim());
      setNewMessage('');
      setIsUserTyping(false);
      setTyping(activeConversation, false);
    }
  };

  const handleStickerSelect = (sticker: { id: string; emoji: string; name: string; category: string }) => {
    if (activeConversation) {
      sendMessage(activeConversation, sticker.emoji, 'text');
      setShowStickerPicker(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeConversation) {
      const fileUrl = URL.createObjectURL(file);
      const fileType = file.type.startsWith('image/') ? 'image' : 'file';
      
      sendMessage(activeConversation, `Fichier partagé: ${file.name}`, fileType, {
        url: fileUrl,
        name: file.name
      });
    }
  };

  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessage(messageId);
    setEditContent(content);
  };

  const saveEditMessage = () => {
    if (editingMessage && activeConversation && editContent.trim()) {
      editMessage(activeConversation, editingMessage, editContent.trim());
      setEditingMessage(null);
      setEditContent('');
    }
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setEditContent('');
  };

  const handleDeleteMessage = (messageId: string) => {
    if (activeConversation && confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      deleteMessage(activeConversation, messageId);
    }
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    if (currentConversation && currentConversation.participants.length > 0) {
      setCallParticipant({
        id: currentConversation.participants[0].id,
        name: currentConversation.participants[0].name,
        avatar: currentConversation.participants[0].avatar,
        isOnline: currentConversation.participants[0].isOnline
      });
      setCallType(type);
      setIsIncomingCall(false);
      setShowCallModal(true);
    }
  };

  const handleCreateConversation = (participants: string[], name?: string, type?: 'individual' | 'group', conversationType?: string) => {
    const newConvId = createConversation(participants, name, type);
    setActiveConversation(newConvId);
    setShowNewConversation(false);
    return newConvId;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const getOnlineStatus = (conversation: Conversation) => {
    if (conversation.type === 'group') {
      const onlineCount = conversation.participants.filter(p => p.isOnline).length;
      return `${onlineCount} en ligne`;
    } else {
      const participant = conversation.participants[0];
      if (participant?.isOnline) {
        return 'En ligne';
      } else if (participant?.lastSeen) {
        const diffInMinutes = (new Date().getTime() - participant.lastSeen.getTime()) / (1000 * 60);
        if (diffInMinutes < 60) {
          return `Vu il y a ${Math.floor(diffInMinutes)} min`;
        } else if (diffInMinutes < 1440) {
          return `Vu il y a ${Math.floor(diffInMinutes / 60)}h`;
        } else {
          return `Vu il y a ${Math.floor(diffInMinutes / 1440)}j`;
        }
      }
      return 'Hors ligne';
    }
  };

  const MessageComponent = ({ message }: { message: Message }) => {
    const isOwn = message.senderId === 'current';
    const isEditing = editingMessage === message.id;

    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
        <div className={`max-w-xs lg:max-w-md relative ${isOwn ? 'order-2' : 'order-1'}`}>
          {!isOwn && currentConversation?.type === 'group' && (
            <p className="text-xs text-gray-500 mb-1 px-1">{message.senderName}</p>
          )}
          
          <div
            className={`px-4 py-2 rounded-lg relative ${
              isOwn
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-2 py-1 text-sm bg-white text-gray-900 border border-gray-300 rounded"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') saveEditMessage();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={saveEditMessage}
                    className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Sauvegarder
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <>
                {message.type === 'image' && message.fileUrl && (
                  <div className="mb-2">
                    <img
                      src={message.fileUrl}
                      alt={message.fileName}
                      className="max-w-full h-auto rounded"
                    />
                  </div>
                )}
                
                {message.type === 'file' && message.fileUrl && (
                  <div className="flex items-center space-x-2 mb-2 p-2 bg-white bg-opacity-20 rounded">
                    <File className="h-4 w-4" />
                    <span className="text-sm">{message.fileName}</span>
                    <button className="ml-auto">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                <p className="text-sm">{message.content}</p>
                
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-xs ${isOwn ? 'text-blue-200' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                  
                  {isOwn && (
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditMessage(message.id, message.content)}
                        className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                        title="Modifier"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                        title="Supprimer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex h-[calc(100vh-5rem)]">
        {/* Sidebar - Conversations List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* New Message Button */}
            <button
              onClick={() => setShowNewConversation(true)}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle conversation
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 px-2">Conversations</h3>
              <div className="space-y-1">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setActiveConversation(conversation.id)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      activeConversation === conversation.id
                        ? 'bg-blue-50 border-blue-200 border'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          conversation.type === 'group' ? 'bg-purple-600' : 'bg-blue-600'
                        }`}>
                          {conversation.avatar}
                        </div>
                        {conversation.type === 'individual' && conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {conversation.name}
                          </p>
                          <div className="flex items-center space-x-2">
                            {conversation.lastMessage && (
                              <span className="text-xs text-gray-500">
                                {formatTime(conversation.lastMessage.timestamp)}
                              </span>
                            )}
                            {conversation.unreadCount > 0 && (
                              <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-600 truncate">
                            {conversation.lastMessage?.content || 'Aucun message'}
                          </p>
                          {isTyping[conversation.id]?.length > 0 && (
                            <span className="text-xs text-blue-600 italic">En train d'écrire...</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        currentConversation.type === 'group' ? 'bg-purple-600' : 'bg-blue-600'
                      }`}>
                        {currentConversation.avatar}
                      </div>
                      {currentConversation.type === 'individual' && currentConversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {currentConversation.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {getOnlineStatus(currentConversation)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleStartCall('audio')}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                      title="Appel audio"
                    >
                      <Phone className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleStartCall('video')}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                      title="Appel vidéo"
                    >
                      <Video className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setShowConversationInfo(!showConversationInfo)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Info className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {currentMessages.map((message) => (
                  <MessageComponent key={message.id} message={message} />
                ))}
                
                {/* Typing indicator */}
                {isTyping[activeConversation]?.filter(id => id !== 'current').length > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t bg-white p-4 relative">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  
                  <input
                    ref={messageInputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Votre message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  <div className="relative" ref={stickerPickerRef}>
                    <button
                      type="button"
                      onClick={() => setShowStickerPicker(!showStickerPicker)}
                      className={`p-2 rounded-full transition-colors ${
                        showStickerPicker 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Smile className="h-5 w-5" />
                    </button>
                    
                    <StickerPicker
                      isOpen={showStickerPicker}
                      onClose={() => setShowStickerPicker(false)}
                      onStickerSelect={handleStickerSelect}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune conversation sélectionnée</h3>
                <p className="text-gray-500 mb-4">Choisissez une conversation ou créez-en une nouvelle</p>
                <button
                  onClick={() => setShowNewConversation(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Nouvelle conversation
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Conversation Info Sidebar */}
        {showConversationInfo && currentConversation && (
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Informations</h3>
              <button
                onClick={() => setShowConversationInfo(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Conversation Details */}
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-medium mx-auto mb-3 ${
                  currentConversation.type === 'group' ? 'bg-purple-600' : 'bg-blue-600'
                }`}>
                  {currentConversation.avatar}
                </div>
                <h4 className="text-lg font-semibold">{currentConversation.name}</h4>
                <p className="text-sm text-gray-600">{getOnlineStatus(currentConversation)}</p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleStartCall('audio')}
                  className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Phone className="h-6 w-6 text-gray-600 mb-2" />
                  <span className="text-sm text-gray-700">Appeler</span>
                </button>
                <button 
                  onClick={() => handleStartCall('video')}
                  className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Video className="h-6 w-6 text-gray-600 mb-2" />
                  <span className="text-sm text-gray-700">Vidéo</span>
                </button>
              </div>

              {/* Participants */}
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-3">
                  Participants ({currentConversation.participants.length})
                </h5>
                <div className="space-y-3">
                  {currentConversation.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {participant.avatar}
                        </div>
                        {participant.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{participant.name}</p>
                        <p className="text-xs text-gray-500">{participant.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {currentConversation.type === 'group' && (
                  <button className="w-full mt-3 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ajouter un participant
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
                  <Search className="h-4 w-4 mr-3" />
                  Rechercher dans la conversation
                </button>
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
                  <Settings className="h-4 w-4 mr-3" />
                  Paramètres de la conversation
                </button>
                <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center">
                  <Trash2 className="h-4 w-4 mr-3" />
                  Supprimer la conversation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      <NewConversationModal
        isOpen={showNewConversation}
        onClose={() => setShowNewConversation(false)}
        onCreateConversation={handleCreateConversation}
      />

      {/* Call Modal */}
      <CallModal
        isOpen={showCallModal}
        onClose={() => {
          setShowCallModal(false);
          setIsIncomingCall(false);
          setCallParticipant(null);
        }}
        callType={callType}
        isIncoming={isIncomingCall}
        participant={callParticipant}
        onAccept={() => setIsIncomingCall(false)}
        onDecline={() => {
          setShowCallModal(false);
          setIsIncomingCall(false);
          setCallParticipant(null);
        }}
      />
    </div>
  );
};