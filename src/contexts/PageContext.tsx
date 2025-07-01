import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PageData {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  status: 'published' | 'draft' | 'review';
  lastModified: string;
  author: string;
  publishDate?: string;
  featuredImage?: string;
  seoTitle?: string;
}

interface PageContextType {
  pages: PageData[];
  getPageBySlug: (slug: string) => PageData | undefined;
  updatePage: (pageData: PageData) => void;
  createPage: (pageData: PageData) => void;
  deletePage: (pageId: string) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const usePages = () => {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('usePages must be used within a PageProvider');
  }
  return context;
};

interface PageProviderProps {
  children: ReactNode;
}

export const PageProvider: React.FC<PageProviderProps> = ({ children }) => {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les pages depuis l'API au montage
  useEffect(() => {
    fetch('/api/pages')
      .then(res => res.json())
      .then(data => {
        setPages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getPageBySlug = (slug: string) => {
    return pages.find(page => page.slug === slug);
  };

  const updatePage = async (pageData: PageData) => {
    const res = await fetch(`/api/pages/${pageData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pageData)
    });
    if (res.ok) {
      const updated = await res.json();
      setPages(prev => prev.map(page => page.id === updated._id ? { ...updated, id: updated._id } : page));
    }
  };

  const createPage = async (pageData: PageData) => {
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pageData)
    });
    if (res.ok) {
      const created = await res.json();
      setPages(prev => [...prev, { ...created, id: created._id }]);
    }
  };

  const deletePage = async (pageId: string) => {
    const res = await fetch(`/api/pages/${pageId}`, { method: 'DELETE' });
    if (res.ok) {
      setPages(prev => prev.filter(page => page.id !== pageId));
    }
  };


  if (loading) return <div>Chargement des pages...</div>;

  return (
    <PageContext.Provider value={{
      pages,
      getPageBySlug,
      updatePage,
      createPage,
      deletePage
    }}>
      {children}
    </PageContext.Provider>
  );
};