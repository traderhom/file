// Types pour le système d'analytics
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: {
    students: number;
    teachers: number;
    admins: number;
  };
  userGrowthRate: number;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  projectsByCategory: Record<string, number>;
  averageProgress: number;
  projectsCompletedThisMonth: number;
}

export interface CourseStats {
  totalCourses: number;
  activeCourses: number;
  totalEnrollments: number;
  averageRating: number;
  completionRate: number;
  popularCourses: Array<{
    id: string;
    title: string;
    enrollments: number;
  }>;
}

export interface VisitorStats {
  totalVisitors: number;
  monthlyVisitors: number;
  dailyVisitors: number;
  pageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
  topPages: Array<{
    path: string;
    views: number;
  }>;
}

export interface SystemStats {
  totalPages: number;
  totalNews: number;
  totalEvents: number;
  systemUptime: number;
  lastBackup: Date;
  storageUsed: number;
  storageTotal: number;
}

export interface RealTimeMetrics {
  onlineUsers: number;
  activeProjects: number;
  messagesExchanged: number;
  filesUploaded: number;
  lastUpdated: Date;
}

export interface AnalyticsData {
  users: UserStats;
  projects: ProjectStats;
  courses: CourseStats;
  visitors: VisitorStats;
  system: SystemStats;
  realTime: RealTimeMetrics;
  lastCalculated: Date;
}

export interface AnalyticsFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  userRole?: 'student' | 'teacher' | 'admin';
  projectCategory?: string;
  courseCategory?: string;
}

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'user_action' | 'system_event';
  userId?: string;
  data: Record<string, any>;
  timestamp: Date;
}
