import { createContext, useContext, useState, ReactNode } from 'react';
import { EmailService } from '../services/EmailService';

interface NewsletterSubscription {
  email: string;
  firstName?: string;
  lastName?: string;
  preferences: {
    news: boolean;
    events: boolean;
    research: boolean;
    admissions: boolean;
  };
  frequency: 'daily' | 'weekly' | 'monthly';
  status?: 'active' | 'unsubscribed';
}

interface NewsletterContextType {
  subscriptions: NewsletterSubscription[];
  subscribe: (data: NewsletterSubscription) => Promise<void>;
  unsubscribe: (email: string, token: string) => Promise<void>;
  getSubscriptionByEmail: (email: string) => NewsletterSubscription | undefined;
}

const NewsletterContext = createContext<NewsletterContextType | undefined>(undefined);

export const NewsletterProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);

  const subscribe = async (data: NewsletterSubscription) => {
    await EmailService.subscribeToNewsletter(data.email, data.preferences);
    setSubscriptions(prev => [
      ...prev.filter(sub => sub.email !== data.email),
      { ...data, status: 'active' }
    ]);
  };

  const unsubscribe = async (email: string, token: string) => {
    await EmailService.unsubscribeFromNewsletter(email, token);
    setSubscriptions(prev => prev.map(sub =>
      sub.email === email ? { ...sub, status: 'unsubscribed' } : sub
    ));
  };

  const getSubscriptionByEmail = (email: string) => {
    return subscriptions.find(sub => sub.email === email);
  };

  return (
    <NewsletterContext.Provider value={{ subscriptions, subscribe, unsubscribe, getSubscriptionByEmail }}>
      {children}
    </NewsletterContext.Provider>
  );
};

export const useNewsletter = () => {
  const context = useContext(NewsletterContext);
  if (!context) {
    throw new Error('useNewsletter must be used within a NewsletterProvider');
  }
  return context;
};
