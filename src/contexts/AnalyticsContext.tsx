
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { AnalyticsData, AnalyticsFilters } from '../types/analytics';
import AnalyticsService from '../services/AnalyticsService';

interface AnalyticsContextType {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  filters: AnalyticsFilters | null;
  setFilters: (filters: AnalyticsFilters | null) => void;
  refresh: () => void;
  trackEvent: (type: 'page_view' | 'user_action' | 'system_event', data: Record<string, any>, userId?: string) => void;
  lastUpdated: Date | null;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilters | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const analyticsService = AnalyticsService.getInstance();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const analyticsData = analyticsService.getAnalyticsData(filters || undefined);
      
      if (analyticsData) {
        setData(analyticsData);
        setLastUpdated(new Date());
      } else {
        throw new Error('Impossible de récupérer les données d\'analytics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur lors de la récupération des statistiques:', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    analyticsService.recalculateAllStats();
    fetchData();
  };

  const trackEvent = (
    type: 'page_view' | 'user_action' | 'system_event',
    data: Record<string, any>,
    userId?: string
  ) => {
    analyticsService.trackEvent({
      type,
      userId,
      data
    });
  };

  // Charger les données initiales
  useEffect(() => {
    fetchData();
  }, [filters]);

  // S'abonner aux mises à jour en temps réel
  useEffect(() => {
    const unsubscribe = analyticsService.subscribe((newData: AnalyticsData) => {
      setData(newData);
      setLastUpdated(new Date());
    });

    return unsubscribe;
  }, []);

  // Tracker automatiquement les vues de page
  useEffect(() => {
    const trackPageView = () => {
      trackEvent('page_view', {
        page: window.location.pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      });
    };

    // Tracker la vue de page initiale
    trackPageView();

    // Tracker les changements de page pour les SPAs
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(trackPageView, 0);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(trackPageView, 0);
    };

    window.addEventListener('popstate', trackPageView);

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', trackPageView);
    };
  }, []);

  // Nettoyer les ressources lors du démontage
  useEffect(() => {
    return () => {
      analyticsService.destroy();
    };
  }, []);

  const value: AnalyticsContextType = {
    data,
    loading,
    error,
    filters,
    setFilters,
    refresh,
    trackEvent,
    lastUpdated
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Hook pour obtenir des statistiques spécifiques
export const useSpecificStats = () => {
  const { data } = useAnalytics();
  
  return {
    totalUsers: data?.users.totalUsers || 0,
    activeUsers: data?.users.activeUsers || 0,
    totalProjects: data?.projects.totalProjects || 0,
    activeProjects: data?.projects.activeProjects || 0,
    totalCourses: data?.courses.totalCourses || 0,
    monthlyVisitors: data?.visitors.monthlyVisitors || 0,
    onlineUsers: data?.realTime.onlineUsers || 0,
    systemUptime: data?.system.systemUptime || 0
  };
};

// Hook pour les métriques de croissance
export const useGrowthMetrics = () => {
  const { data } = useAnalytics();
  
  return {
    userGrowthRate: data?.users.userGrowthRate || 0,
    projectsCompletedThisMonth: data?.projects.projectsCompletedThisMonth || 0,
    newUsersThisMonth: data?.users.newUsersThisMonth || 0,
    averageProgress: data?.projects.averageProgress || 0,
    completionRate: data?.courses.completionRate || 0
  };
};

// Hook pour les données de tableau de bord
export const useDashboardData = () => {
  const { data, loading, error, lastUpdated } = useAnalytics();
  
  const dashboardStats = data ? {
    // Statistiques principales
    totalUsers: data.users.totalUsers,
    activeProjects: data.projects.activeProjects,
    totalPages: data.system.totalPages,
    monthlyVisitors: data.visitors.monthlyVisitors,
    
    // Métriques de performance
    systemUptime: data.system.systemUptime,
    averageRating: data.courses.averageRating,
    completionRate: data.courses.completionRate,
    
    // Données en temps réel
    onlineUsers: data.realTime.onlineUsers,
    messagesExchanged: data.realTime.messagesExchanged,
    
    // Tendances
    userGrowthRate: data.users.userGrowthRate,
    projectsCompletedThisMonth: data.projects.projectsCompletedThisMonth
  } : null;
  
  return {
    dashboardStats,
    loading,
    error,
    lastUpdated
  };
};
