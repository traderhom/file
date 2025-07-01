
import { useState, useEffect, useCallback } from 'react';
import { AnalyticsData, AnalyticsFilters } from '../types/analytics';
import AnalyticsService from '../services/AnalyticsService';

interface UseRealTimeStatsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  filters?: AnalyticsFilters;
}

interface UseRealTimeStatsReturn {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  lastUpdated: Date | null;
}

export const useRealTimeStats = (options: UseRealTimeStatsOptions = {}): UseRealTimeStatsReturn => {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 secondes par défaut
    filters
  } = options;

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const analyticsService = AnalyticsService.getInstance();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const analyticsData = analyticsService.getAnalyticsData(filters);
      
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
  }, [analyticsService, filters]);

  const refresh = useCallback(() => {
    analyticsService.recalculateAllStats();
    fetchData();
  }, [analyticsService, fetchData]);

  // Effet pour charger les données initiales
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Effet pour l'auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  // Effet pour s'abonner aux mises à jour en temps réel
  useEffect(() => {
    const unsubscribe = analyticsService.subscribe((newData: AnalyticsData) => {
      setData(newData);
      setLastUpdated(new Date());
    });

    return unsubscribe;
  }, [analyticsService]);

  // Effet pour tracker les vues de page
  useEffect(() => {
    const trackPageView = () => {
      analyticsService.trackEvent({
        type: 'page_view',
        data: {
          page: window.location.pathname,
          referrer: document.referrer,
          userAgent: navigator.userAgent
        }
      });
    };

    // Tracker la vue de page initiale
    trackPageView();

    // Tracker les changements de page (pour les SPAs)
    const handlePopState = () => {
      trackPageView();
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [analyticsService]);

  return {
    data,
    loading,
    error,
    refresh,
    lastUpdated
  };
};

// Hook spécialisé pour les statistiques utilisateurs
export const useUserStats = () => {
  const { data, loading, error, refresh } = useRealTimeStats();
  
  return {
    userStats: data?.users || null,
    loading,
    error,
    refresh
  };
};

// Hook spécialisé pour les statistiques de projets
export const useProjectStats = () => {
  const { data, loading, error, refresh } = useRealTimeStats();
  
  return {
    projectStats: data?.projects || null,
    loading,
    error,
    refresh
  };
};

// Hook spécialisé pour les statistiques de cours
export const useCourseStats = () => {
  const { data, loading, error, refresh } = useRealTimeStats();
  
  return {
    courseStats: data?.courses || null,
    loading,
    error,
    refresh
  };
};

// Hook spécialisé pour les statistiques de visiteurs
export const useVisitorStats = () => {
  const { data, loading, error, refresh } = useRealTimeStats();
  
  return {
    visitorStats: data?.visitors || null,
    loading,
    error,
    refresh
  };
};

// Hook spécialisé pour les métriques en temps réel
export const useRealTimeMetrics = () => {
  const { data, loading, error, lastUpdated } = useRealTimeStats({
    autoRefresh: true,
    refreshInterval: 10000 // Mise à jour plus fréquente pour les métriques temps réel
  });
  
  return {
    realTimeMetrics: data?.realTime || null,
    loading,
    error,
    lastUpdated
  };
};

// Hook pour tracker des événements personnalisés
export const useAnalyticsTracker = () => {
  const analyticsService = AnalyticsService.getInstance();

  const trackEvent = useCallback((
    type: 'page_view' | 'user_action' | 'system_event',
    data: Record<string, any>,
    userId?: string
  ) => {
    analyticsService.trackEvent({
      type,
      userId,
      data
    });
  }, [analyticsService]);

  const trackUserAction = useCallback((action: string, details?: Record<string, any>) => {
    trackEvent('user_action', { action, ...details });
  }, [trackEvent]);

  const trackPageView = useCallback((page: string, additionalData?: Record<string, any>) => {
    trackEvent('page_view', { page, ...additionalData });
  }, [trackEvent]);

  return {
    trackEvent,
    trackUserAction,
    trackPageView
  };
};
