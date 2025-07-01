import { AnalyticsData, AnalyticsFilters, AnalyticsEvent, UserStats, ProjectStats, CourseStats, VisitorStats, SystemStats, RealTimeMetrics } from '../types/analytics';

class AnalyticsService {
  private static instance: AnalyticsService;
  private analyticsData: AnalyticsData | null = null;
  private events: AnalyticsEvent[] = [];
  private updateInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Array<(data: AnalyticsData) => void> = [];

  private constructor() {
    this.initializeAnalytics();
    this.startRealTimeUpdates();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private initializeAnalytics(): void {
    // Initialiser avec des données de base qui seront calculées dynamiquement
    this.analyticsData = {
      users: this.calculateUserStats(),
      projects: this.calculateProjectStats(),
      courses: this.calculateCourseStats(),
      visitors: this.calculateVisitorStats(),
      system: this.calculateSystemStats(),
      realTime: this.calculateRealTimeMetrics(),
      lastCalculated: new Date()
    };
  }

  private calculateUserStats(): UserStats {
    // Récupérer les données des contextes existants
    const users = this.getUsersFromStorage();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const newUsersThisMonth = users.filter(user => {
      const joinDate = new Date(user.joinDate || new Date());
      return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
    }).length;

    const usersByRole = users.reduce((acc, user) => {
      const role = user.role === 'student' ? 'students' : 
                   user.role === 'teacher' ? 'teachers' : 'admins';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, { students: 0, teachers: 0, admins: 0 });

    // Calculer le taux de croissance (simulation basée sur les données)
    const lastMonthUsers = Math.max(1, users.length - newUsersThisMonth);
    const userGrowthRate = ((newUsersThisMonth / lastMonthUsers) * 100);

    return {
      totalUsers: users.length,
      activeUsers: users.filter(user => user.status === 'active').length,
      newUsersThisMonth,
      usersByRole,
      userGrowthRate: Math.round(userGrowthRate * 100) / 100
    };
  }

  private calculateProjectStats(): ProjectStats {
    const projects = this.getProjectsFromStorage();
    
    const projectsByCategory = projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalProgress = projects.reduce((sum, project) => sum + (project.progress || 0), 0);
    const averageProgress = projects.length > 0 ? totalProgress / projects.length : 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const projectsCompletedThisMonth = projects.filter(project => {
      if (project.status !== 'completed') return false;
      const endDate = new Date(project.endDate || project.lastModified || new Date());
      return endDate.getMonth() === currentMonth && endDate.getFullYear() === currentYear;
    }).length;

    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      projectsByCategory,
      averageProgress: Math.round(averageProgress * 100) / 100,
      projectsCompletedThisMonth
    };
  }

  private calculateCourseStats(): CourseStats {
    const courses = this.getCoursesFromStorage();
    
    const totalEnrollments = courses.reduce((sum, course) => sum + (course.students || 0), 0);
    const totalRating = courses.reduce((sum, course) => sum + (course.rating || 0), 0);
    const averageRating = courses.length > 0 ? totalRating / courses.length : 0;

    // Simuler un taux de completion basé sur les données
    const completionRate = Math.min(95, Math.max(60, 75 + (averageRating - 4) * 10));

    const popularCourses = courses
      .sort((a, b) => (b.students || 0) - (a.students || 0))
      .slice(0, 5)
      .map(course => ({
        id: course.id,
        title: course.title,
        enrollments: course.students || 0
      }));

    return {
      totalCourses: courses.length,
      activeCourses: courses.filter(c => c.status === 'active').length,
      totalEnrollments,
      averageRating: Math.round(averageRating * 100) / 100,
      completionRate: Math.round(completionRate * 100) / 100,
      popularCourses
    };
  }

  private calculateVisitorStats(): VisitorStats {
    // Simuler des statistiques de visiteurs basées sur l'activité réelle
    const baseVisitors = this.getBaseVisitorCount();
    const events = this.getRecentEvents();
    
    // Calculer les visiteurs basés sur l'activité
    const dailyVisitors = Math.max(50, events.filter(e => 
      e.type === 'page_view' && 
      new Date(e.timestamp).toDateString() === new Date().toDateString()
    ).length * 2);

    const monthlyVisitors = dailyVisitors * 30 + Math.floor(Math.random() * 1000);
    const pageViews = events.filter(e => e.type === 'page_view').length;
    
    // Calculer des métriques réalistes
    const bounceRate = Math.max(20, Math.min(80, 45 + Math.random() * 20));
    const averageSessionDuration = Math.max(120, Math.min(600, 180 + Math.random() * 200));

    const topPages = this.calculateTopPages(events);

    return {
      totalVisitors: baseVisitors + monthlyVisitors,
      monthlyVisitors,
      dailyVisitors,
      pageViews,
      bounceRate: Math.round(bounceRate * 100) / 100,
      averageSessionDuration: Math.round(averageSessionDuration),
      topPages
    };
  }

  private calculateSystemStats(): SystemStats {
    const pages = this.getPagesFromStorage();
    const news = this.getNewsFromStorage();
    const events = this.getEventsFromStorage();
    
    // Simuler l'uptime du système
    const systemUptime = Math.max(99.5, 99.9 - Math.random() * 0.4);
    
    // Simuler l'utilisation du stockage
    const storageTotal = 1000; // GB
    const storageUsed = Math.min(storageTotal * 0.8, 
      (pages.length * 0.1) + (news.length * 0.05) + (events.length * 0.02) + 50
    );

    return {
      totalPages: pages.length,
      totalNews: news.length,
      totalEvents: events.length,
      systemUptime: Math.round(systemUptime * 100) / 100,
      lastBackup: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      storageUsed: Math.round(storageUsed * 100) / 100,
      storageTotal
    };
  }

  private calculateRealTimeMetrics(): RealTimeMetrics {
    const users = this.getUsersFromStorage();
    const projects = this.getProjectsFromStorage();
    
    // Simuler des métriques en temps réel basées sur l'activité
    const onlineUsers = Math.max(1, Math.floor(users.length * (0.1 + Math.random() * 0.2)));
    const activeProjects = projects.filter(p => p.status === 'active').length;
    
    // Simuler l'activité récente
    const messagesExchanged = Math.floor(Math.random() * 50) + 10;
    const filesUploaded = Math.floor(Math.random() * 10) + 1;

    return {
      onlineUsers,
      activeProjects,
      messagesExchanged,
      filesUploaded,
      lastUpdated: new Date()
    };
  }

  private getUsersFromStorage(): any[] {
    // À remplacer par un appel à l'API backend
    // Exemple : return fetch('/api/users').then(res => res.json());
    return [];
  }

  private getProjectsFromStorage(): any[] {
    // À remplacer par un appel à l'API backend
    // Exemple : return fetch('/api/projects').then(res => res.json());
    return [];
  }

  private getCoursesFromStorage(): any[] {
    try {
      // Simuler des cours avec des données réalistes
      return [
        { id: '1', title: 'Python Basics', students: 245, rating: 4.8, status: 'active' },
        { id: '2', title: 'Machine Learning', students: 189, rating: 4.9, status: 'active' },
        { id: '3', title: 'Cybersecurity', students: 156, rating: 4.7, status: 'active' },
        { id: '4', title: 'Data Science', students: 203, rating: 4.6, status: 'active' },
        { id: '5', title: 'Web Development', students: 298, rating: 4.5, status: 'active' }
      ];
    } catch {
      return [];
    }
  }

  private getPagesFromStorage(): any[] {
    try {
      return JSON.parse(localStorage.getItem('pages') || '[]');
    } catch {
      return Array.from({ length: 24 }, (_, i) => ({ id: i + 1 }));
    }
  }

  private getNewsFromStorage(): any[] {
    try {
      return JSON.parse(localStorage.getItem('news') || '[]');
    } catch {
      return Array.from({ length: 15 }, (_, i) => ({ id: i + 1 }));
    }
  }

  private getEventsFromStorage(): any[] {
    try {
      return JSON.parse(localStorage.getItem('events') || '[]');
    } catch {
      return Array.from({ length: 8 }, (_, i) => ({ id: i + 1 }));
    }
  }

  private getBaseVisitorCount(): number {
    const stored = localStorage.getItem('totalVisitors');
    if (stored) {
      return parseInt(stored, 10);
    }
    const baseCount = 12000 + Math.floor(Math.random() * 5000);
    localStorage.setItem('totalVisitors', baseCount.toString());
    return baseCount;
  }

  private getRecentEvents(): AnalyticsEvent[] {
    // Simuler des événements récents
    const events: AnalyticsEvent[] = [];
    const now = new Date();
    
    for (let i = 0; i < 100; i++) {
      events.push({
        id: `event_${i}`,
        type: Math.random() > 0.7 ? 'user_action' : 'page_view',
        userId: `user_${Math.floor(Math.random() * 1000)}`,
        data: { page: ['/', '/formation', '/recherche', '/actualites'][Math.floor(Math.random() * 4)] },
        timestamp: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
    }
    
    return events;
  }

  private calculateTopPages(events: AnalyticsEvent[]): Array<{ path: string; views: number }> {
    const pageViews = events
      .filter(e => e.type === 'page_view')
      .reduce((acc, event) => {
        const path = event.data.page || '/';
        acc[path] = (acc[path] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(pageViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([path, views]) => ({ path, views }));
  }

  private startRealTimeUpdates(): void {
    // Mettre à jour les métriques en temps réel toutes les 30 secondes
    this.updateInterval = setInterval(() => {
      if (this.analyticsData) {
        this.analyticsData.realTime = this.calculateRealTimeMetrics();
        this.analyticsData.lastCalculated = new Date();
        this.notifyListeners();
      }
    }, 30000);

    // Recalculer toutes les statistiques toutes les 5 minutes
    setInterval(() => {
      this.recalculateAllStats();
    }, 5 * 60 * 1000);
  }

  public recalculateAllStats(): void {
    this.analyticsData = {
      users: this.calculateUserStats(),
      projects: this.calculateProjectStats(),
      courses: this.calculateCourseStats(),
      visitors: this.calculateVisitorStats(),
      system: this.calculateSystemStats(),
      realTime: this.calculateRealTimeMetrics(),
      lastCalculated: new Date()
    };
    this.notifyListeners();
  }

  public getAnalyticsData(filters?: AnalyticsFilters): AnalyticsData | null {
    if (!this.analyticsData) {
      this.recalculateAllStats();
    }
    
    // Appliquer les filtres si nécessaire
    if (filters) {
      return this.applyFilters(this.analyticsData!);
    }
    
    return this.analyticsData;
  }

  private applyFilters(data: AnalyticsData): AnalyticsData {
    // Implémenter la logique de filtrage
    // Pour l'instant, retourner les données non filtrées
    return data;
  }

  public trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): void {
    const fullEvent: AnalyticsEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    this.events.push(fullEvent);
    
    // Garder seulement les 1000 derniers événements
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
    
    // Recalculer les statistiques si nécessaire
    if (event.type === 'page_view') {
      this.analyticsData!.visitors = this.calculateVisitorStats();
      this.notifyListeners();
    }
  }

  public subscribe(callback: (data: AnalyticsData) => void): () => void {
    this.listeners.push(callback);
    
    // Retourner une fonction de désabonnement
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners(): void {
    if (this.analyticsData) {
      this.listeners.forEach(listener => listener(this.analyticsData!));
    }
  }

  public destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.listeners = [];
  }
}

export default AnalyticsService;
