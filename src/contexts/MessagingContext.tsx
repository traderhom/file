import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  type: 'individual' | 'group';
  participants: Participant[];
  lastMessage?: Message;
  unreadCount: number;
  avatar: string;
  isOnline?: boolean;
  lastSeen?: Date;
  createdAt: Date;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface MessagingContextType {
  conversations: Conversation[];
  messages: { [conversationId: string]: Message[] };
  activeConversation: string | null;
  isTyping: { [conversationId: string]: string[] };
  
  // Actions
  setActiveConversation: (conversationId: string | null) => void;
  sendMessage: (conversationId: string, content: string, type?: 'text' | 'file' | 'image', fileData?: any) => void;
  createConversation: (participants: string[], name?: string, type?: 'individual' | 'group') => string;
  markAsRead: (conversationId: string, messageId?: string) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  editMessage: (conversationId: string, messageId: string, newContent: string) => void;
  addParticipant: (conversationId: string, participantId: string) => void;
  removeParticipant: (conversationId: string, participantId: string) => void;
  setTyping: (conversationId: string, isTyping: boolean) => void;
  searchMessages: (query: string) => Message[];
  getConversationMessages: (conversationId: string) => Message[];
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};

interface MessagingProviderProps {
  children: ReactNode;
}

export const MessagingProvider: React.FC<MessagingProviderProps> = ({ children }) => {
  const { user } = useAuth();

  // Mock users for demonstration
  const mockUsers: Participant[] = [
    {
      id: '1',
      name: 'Prof. Marie Dubois',
      email: 'marie.dubois@esst.edu',
      avatar: 'MD',
      role: 'Professeur',
      isOnline: true
    },
    {
      id: '2',
      name: 'Thomas Lambert',
      email: 'thomas.lambert@student.esst.edu',
      avatar: 'TL',
      role: 'Étudiant',
      isOnline: false,
      lastSeen: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
      id: '3',
      name: 'Sophie Martin',
      email: 'sophie.martin@student.esst.edu',
      avatar: 'SM',
      role: 'Étudiant',
      isOnline: true
    },
    {
      id: '4',
      name: 'Alex Chen',
      email: 'alex.chen@student.esst.edu',
      avatar: 'AC',
      role: 'Étudiant',
      isOnline: false,
      lastSeen: new Date(Date.now() - 7200000) // 2 hours ago
    },
    {
      id: '5',
      name: 'Dr. Jean Martin',
      email: 'jean.martin@esst.edu',
      avatar: 'JM',
      role: 'Docteur',
      isOnline: true
    }
  ];

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Prof. Marie Dubois',
      type: 'individual',
      participants: [mockUsers[0]],
      unreadCount: 2,
      avatar: 'MD',
      isOnline: true,
      createdAt: new Date(Date.now() - 86400000) // 1 day ago
    },
    {
      id: '2',
      name: 'Groupe Projet IA',
      type: 'group',
      participants: [mockUsers[1], mockUsers[2], mockUsers[3]],
      unreadCount: 0,
      avatar: 'GIA',
      createdAt: new Date(Date.now() - 172800000) // 2 days ago
    },
    {
      id: '3',
      name: 'Thomas Lambert',
      type: 'individual',
      participants: [mockUsers[1]],
      unreadCount: 0,
      avatar: 'TL',
      isOnline: false,
      lastSeen: mockUsers[1].lastSeen,
      createdAt: new Date(Date.now() - 259200000) // 3 days ago
    },
    {
      id: '4',
      name: 'Équipe Cybersécurité',
      type: 'group',
      participants: [mockUsers[4], mockUsers[2]],
      unreadCount: 1,
      avatar: 'EC',
      createdAt: new Date(Date.now() - 345600000) // 4 days ago
    }
  ]);

  const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>({
    '1': [
      {
        id: '1',
        conversationId: '1',
        senderId: '1',
        senderName: 'Prof. Marie Dubois',
        content: 'Bonjour Sophie, avez-vous avancé sur le projet final ?',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
        isRead: true
      },
      {
        id: '2',
        conversationId: '1',
        senderId: 'current',
        senderName: user?.name || 'Vous',
        content: 'Bonjour Professeur, oui j\'ai terminé la première partie.',
        timestamp: new Date(Date.now() - 3000000),
        type: 'text',
        isRead: true
      },
      {
        id: '3',
        conversationId: '1',
        senderId: '1',
        senderName: 'Prof. Marie Dubois',
        content: 'Très bien. Pourriez-vous me l\'envoyer pour révision ?',
        timestamp: new Date(Date.now() - 1800000),
        type: 'text',
        isRead: false
      },
      {
        id: '4',
        conversationId: '1',
        senderId: '1',
        senderName: 'Prof. Marie Dubois',
        content: 'J\'ai aussi quelques suggestions pour améliorer la méthodologie.',
        timestamp: new Date(Date.now() - 900000),
        type: 'text',
        isRead: false
      }
    ],
    '2': [
      {
        id: '5',
        conversationId: '2',
        senderId: '2',
        senderName: 'Thomas Lambert',
        content: 'Salut tout le monde ! J\'ai fini la partie sur les réseaux de neurones.',
        timestamp: new Date(Date.now() - 7200000),
        type: 'text',
        isRead: true
      },
      {
        id: '6',
        conversationId: '2',
        senderId: '3',
        senderName: 'Sophie Martin',
        content: 'Super ! Moi je travaille sur la partie visualisation des données.',
        timestamp: new Date(Date.now() - 6600000),
        type: 'text',
        isRead: true
      },
      {
        id: '7',
        conversationId: '2',
        senderId: '4',
        senderName: 'Alex Chen',
        content: 'Voici les références que j\'ai trouvées pour notre bibliographie.',
        timestamp: new Date(Date.now() - 5400000),
        type: 'text',
        isRead: true
      }
    ],
    '3': [
      {
        id: '8',
        conversationId: '3',
        senderId: '2',
        senderName: 'Thomas Lambert',
        content: 'Tu as reçu les documents pour le cours de demain ?',
        timestamp: new Date(Date.now() - 10800000),
        type: 'text',
        isRead: true
      },
      {
        id: '9',
        conversationId: '3',
        senderId: 'current',
        senderName: user?.name || 'Vous',
        content: 'Oui, je les ai téléchargés. Merci !',
        timestamp: new Date(Date.now() - 9000000),
        type: 'text',
        isRead: true
      }
    ],
    '4': [
      {
        id: '10',
        conversationId: '4',
        senderId: '5',
        senderName: 'Dr. Jean Martin',
        content: 'N\'oubliez pas la réunion de demain à 14h pour discuter du projet de sécurité.',
        timestamp: new Date(Date.now() - 1200000),
        type: 'text',
        isRead: false
      }
    ]
  });

  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [isTyping, setIsTypingState] = useState<{ [conversationId: string]: string[] }>({});

  // Update last message for conversations
  React.useEffect(() => {
    setConversations(prev => prev.map(conv => {
      const convMessages = messages[conv.id] || [];
      const lastMessage = convMessages[convMessages.length - 1];
      const unreadCount = convMessages.filter(msg => !msg.isRead && msg.senderId !== 'current').length;
      
      return {
        ...conv,
        lastMessage,
        unreadCount
      };
    }));
  }, [messages]);

  const sendMessage = (conversationId: string, content: string, type: 'text' | 'file' | 'image' = 'text', fileData?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      senderId: 'current',
      senderName: user?.name || 'Vous',
      content,
      timestamp: new Date(),
      type,
      fileUrl: fileData?.url,
      fileName: fileData?.name,
      isRead: true
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));

    // Simulate response for demo
    if (type === 'text' && content.toLowerCase().includes('bonjour')) {
      setTimeout(() => {
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation && conversation.participants.length > 0) {
          const participant = conversation.participants[0];
          const responseMessage: Message = {
            id: (Date.now() + 1).toString(),
            conversationId,
            senderId: participant.id,
            senderName: participant.name,
            content: 'Bonjour ! Comment allez-vous ?',
            timestamp: new Date(),
            type: 'text',
            isRead: false
          };

          setMessages(prev => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] || []), responseMessage]
          }));
        }
      }, 2000);
    }
  };

  const createConversation = (participantIds: string[], name?: string, type: 'individual' | 'group' = 'individual'): string => {
    const participants = mockUsers.filter(user => participantIds.includes(user.id));
    const conversationId = Date.now().toString();
    
    const newConversation: Conversation = {
      id: conversationId,
      name: name || (type === 'group' ? 'Nouvelle conversation' : participants[0]?.name || 'Conversation'),
      type,
      participants,
      unreadCount: 0,
      avatar: type === 'group' ? 'GC' : participants[0]?.avatar || 'U',
      createdAt: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);
    setMessages(prev => ({ ...prev, [conversationId]: [] }));
    
    return conversationId;
  };

  const markAsRead = (conversationId: string, messageId?: string) => {
    setMessages(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map(msg => 
        messageId ? (msg.id === messageId ? { ...msg, isRead: true } : msg) : { ...msg, isRead: true }
      )
    }));
  };

  const deleteMessage = (conversationId: string, messageId: string) => {
    setMessages(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).filter(msg => msg.id !== messageId)
    }));
  };

  const editMessage = (conversationId: string, messageId: string, newContent: string) => {
    setMessages(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map(msg => 
        msg.id === messageId ? { ...msg, content: newContent } : msg
      )
    }));
  };

  const addParticipant = (conversationId: string, participantId: string) => {
    const participant = mockUsers.find(u => u.id === participantId);
    if (!participant) return;

    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, participants: [...conv.participants, participant] }
        : conv
    ));
  };

  const removeParticipant = (conversationId: string, participantId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, participants: conv.participants.filter(p => p.id !== participantId) }
        : conv
    ));
  };

  const setTyping = (conversationId: string, isTyping: boolean) => {
    const userId = user?.id || 'current';
    
    setIsTypingState(prev => {
      const currentTyping = prev[conversationId] || [];
      
      if (isTyping) {
        return {
          ...prev,
          [conversationId]: currentTyping.includes(userId) ? currentTyping : [...currentTyping, userId]
        };
      } else {
        return {
          ...prev,
          [conversationId]: currentTyping.filter(id => id !== userId)
        };
      }
    });

    // Auto-clear typing after 3 seconds
    if (isTyping) {
      setTimeout(() => setTyping(conversationId, false), 3000);
    }
  };

  const searchMessages = (query: string): Message[] => {
    const allMessages = Object.values(messages).flat();
    return allMessages.filter(msg => 
      msg.content.toLowerCase().includes(query.toLowerCase()) ||
      msg.senderName.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getConversationMessages = (conversationId: string): Message[] => {
    return messages[conversationId] || [];
  };

  return (
    <MessagingContext.Provider value={{
      conversations,
      messages,
      activeConversation,
      isTyping,
      setActiveConversation,
      sendMessage,
      createConversation,
      markAsRead,
      deleteMessage,
      editMessage,
      addParticipant,
      removeParticipant,
      setTyping,
      searchMessages,
      getConversationMessages
    }}>
      {children}
    </MessagingContext.Provider>
  );
};