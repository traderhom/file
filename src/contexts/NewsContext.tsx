import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  status: 'published' | 'draft' | 'scheduled';
  publishDate: string;
  featuredImage: string;
  tags: string[];
}

interface NewsContextType {
  articles: NewsArticle[];
  getPublishedArticles: () => NewsArticle[];
  updateArticle: (articleData: NewsArticle) => void;
  createArticle: (articleData: NewsArticle) => void;
  deleteArticle: (articleId: string) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const useNews = () => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

interface NewsProviderProps {
  children: ReactNode;
}

export const NewsProvider: React.FC<NewsProviderProps> = ({ children }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([
    {
      id: '1',
      title: 'L\'ESST remporte le Prix National d\'Innovation Technologique 2025',
      excerpt: 'Notre laboratoire d\'IA a été récompensé pour ses travaux révolutionnaires en diagnostic médical assisté par intelligence artificielle.',
      content: 'Notre laboratoire d\'IA a été récompensé pour ses travaux révolutionnaires en diagnostic médical assisté par intelligence artificielle. Cette reconnaissance prestigieuse souligne l\'excellence de nos recherches et notre engagement envers l\'innovation technologique.',
      author: 'Direction de la Communication',
      category: 'Distinctions',
      status: 'published',
      publishDate: '15/04/2025',
      featuredImage: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
      tags: ['Innovation', 'Prix', 'IA']
    },
    {
      id: '2',
      title: 'Nouvelle formation en Cybersécurité Quantique',
      excerpt: 'L\'ESST lance un programme pionnier combinant cybersécurité et informatique quantique pour répondre aux défis de demain.',
      content: 'L\'ESST lance un programme pionnier combinant cybersécurité et informatique quantique pour répondre aux défis de demain. Cette formation unique en France prépare nos étudiants aux technologies de sécurité du futur.',
      author: 'Prof. Jean Martin',
      category: 'Formation',
      status: 'published',
      publishDate: '12/04/2025',
      featuredImage: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
      tags: ['Formation', 'Cybersécurité', 'Quantique']
    },
    {
      id: '3',
      title: 'Partenariat stratégique avec Google DeepMind',
      excerpt: 'Un accord de collaboration pour développer des solutions d\'IA éthique et responsable dans le domaine de la santé.',
      content: 'Un accord de collaboration pour développer des solutions d\'IA éthique et responsable dans le domaine de la santé. Ce partenariat permettra à nos étudiants et chercheurs d\'accéder aux dernières technologies d\'intelligence artificielle.',
      author: 'Direction des Partenariats',
      category: 'Partenariats',
      status: 'published',
      publishDate: '10/04/2025',
      featuredImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      tags: ['Partenariat', 'Google', 'IA']
    }
  ]);

  const getPublishedArticles = () => {
    return articles.filter(article => article.status === 'published');
  };

  const updateArticle = (articleData: NewsArticle) => {
    setArticles(prev => prev.map(article => 
      article.id === articleData.id ? articleData : article
    ));
  };

  const createArticle = (articleData: NewsArticle) => {
    setArticles(prev => [...prev, articleData]);
  };

  const deleteArticle = (articleId: string) => {
    setArticles(prev => prev.filter(article => article.id !== articleId));
  };

  return (
    <NewsContext.Provider value={{
      articles,
      getPublishedArticles,
      updateArticle,
      createArticle,
      deleteArticle
    }}>
      {children}
    </NewsContext.Provider>
  );
};