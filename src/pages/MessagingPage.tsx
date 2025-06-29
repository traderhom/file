import React, { useState } from 'react';
import { Search, Plus, Send, Paperclip } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  type: 'individual' | 'group';
  avatar: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isOwn: boolean;
}

export const MessagingPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [newMessage, setNewMessage] = useState('');

  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Pr. Dubois',
      lastMessage: 'Concernant le projet final...',
      time: '10:30',
      unread: 2,
      type: 'individual',
      avatar: 'PD'
    },
    {
      id: '2',
      name: 'Groupe Projet IA',
      lastMessage: 'Marie: Voici les références...',
      time: 'Hier',
      unread: 0,
      type: 'group',
      avatar: 'GIA'
    },
    {
      id: '3',
      name: 'Thomas Lambert',
      lastMessage: 'Tu as reçu les documents ?',
      time: 'Lun.',
      unread: 0,
      type: 'individual',
      avatar: 'TL'
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      sender: 'Pr. Dubois',
      content: 'Bonjour Sophie, avez-vous avancé sur le projet final ?',
      time: '10:15',
      isOwn: false
    },
    {
      id: '2',
      sender: 'Vous',
      content: 'Bonjour Professeur, oui j\'ai terminé la première partie.',
      time: '10:20',
      isOwn: true
    },
    {
      id: '3',
      sender: 'Pr. Dubois',
      content: 'Très bien. Pourriez-vous me l\'envoyer pour révision ?',
      time: '10:30',
      isOwn: false
    }
  ];

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex h-screen pt-0">
        {/* Sidebar - Conversations List */}
        <div className="w-80 bg-gray-100 border-r">
          <div className="p-4">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* New Message Button */}
            <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors mb-4">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Message
            </button>

            {/* Conversations List */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Conversations</h3>
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedConversation === conversation.id
                        ? 'bg-blue-100 border-blue-500 border'
                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        conversation.type === 'group' ? 'bg-blue-600' : 'bg-blue-900'
                      } text-white text-sm font-medium`}>
                        {conversation.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {conversation.name}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{conversation.time}</span>
                            {conversation.unread > 0 && (
                              <span className="bg-blue-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
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
              <div className="bg-gray-100 border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentConversation.type === 'group' ? 'bg-blue-600' : 'bg-blue-900'
                    } text-white text-sm font-medium`}>
                      {currentConversation.avatar}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {currentConversation.name}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">En ligne</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isOwn
                          ? 'bg-blue-900 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isOwn ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t bg-gray-50 p-4">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Votre message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Sélectionnez une conversation pour commencer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};