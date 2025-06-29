import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { FormationPage } from './pages/FormationPage';
import { RecherchePage } from './pages/RecherchePage';
import { ActualitesPage } from './pages/ActualitesPage';
import { CoursPage } from './pages/CoursPage';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ContentManagement } from './pages/admin/ContentManagement';
import { ProjectManagement } from './pages/admin/ProjectManagement';
import { NewsManagement } from './pages/admin/NewsManagement';
import { EventsManagement } from './pages/admin/EventsManagement';
import { CoursesManagement } from './pages/admin/CoursesManagement';
import { MediaManagement } from './pages/admin/MediaManagement';
import { UsersManagement } from './pages/admin/UsersManagement';
import { SettingsManagement } from './pages/admin/SettingsManagement';
import { MessagingPage } from './pages/MessagingPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { DynamicPage } from './pages/DynamicPage';
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { PageProvider } from './contexts/PageContext';
import { NewsProvider } from './contexts/NewsContext';
import { EventsProvider } from './contexts/EventsContext';
import { CoursesProvider } from './contexts/CoursesContext';
import { ProjectsProvider } from './contexts/ProjectsContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <PageProvider>
          <NewsProvider>
            <EventsProvider>
              <CoursesProvider>
                <ProjectsProvider>
                  <Router>
                    <div className="min-h-screen bg-gray-50">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/formation" element={<FormationPage />} />
                        <Route path="/recherche" element={<RecherchePage />} />
                        <Route path="/actualites" element={<ActualitesPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegistrationPage />} />
                        <Route path="/cours" element={
                          <ProtectedRoute>
                            <CoursPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/messaging" element={
                          <ProtectedRoute>
                            <MessagingPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/projects" element={
                          <ProtectedRoute>
                            <ProjectsPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/projects/:id" element={
                          <ProtectedRoute>
                            <ProjectDetailPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/pages/:slug" element={<DynamicPage />} />
                        <Route path="/admin" element={
                          <ProtectedRoute adminOnly>
                            <AdminLayout />
                          </ProtectedRoute>
                        }>
                          <Route index element={<Navigate to="/admin/dashboard" replace />} />
                          <Route path="dashboard" element={<AdminDashboard />} />
                          <Route path="content" element={<ContentManagement />} />
                          <Route path="news" element={<NewsManagement />} />
                          <Route path="events" element={<EventsManagement />} />
                          <Route path="courses" element={<CoursesManagement />} />
                          <Route path="media" element={<MediaManagement />} />
                          <Route path="projects" element={<ProjectManagement />} />
                          <Route path="users" element={<UsersManagement />} />
                          <Route path="settings" element={<SettingsManagement />} />
                        </Route>
                      </Routes>
                    </div>
                  </Router>
                </ProjectsProvider>
              </CoursesProvider>
            </EventsProvider>
          </NewsProvider>
        </PageProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;