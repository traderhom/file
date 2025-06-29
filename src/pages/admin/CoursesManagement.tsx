import React, { useState } from 'react';
import { Search, Plus, Edit, Eye, Trash2, BookOpen, Users, Clock, Star } from 'lucide-react';
import { CourseEditor } from '../../components/admin/CourseEditor';
import { useCourses } from '../../contexts/CoursesContext';

export const CoursesManagement: React.FC = () => {
  const { courses, updateCourse, createCourse, deleteCourse } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [currentView, setCurrentView] = useState<'list' | 'edit' | 'create'>('list');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const categories = ['Programmation', 'Intelligence Artificielle', 'Cybersécurité', 'Data Science', 'Robotique'];
  const levels = ['Débutant', 'Intermédiaire', 'Avancé'];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      active: 'Actif',
      draft: 'Brouillon',
      archived: 'Archivé'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'Débutant': 'bg-green-100 text-green-800',
      'Intermédiaire': 'bg-yellow-100 text-yellow-800',
      'Avancé': 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesLevel;
  });

  const handleCreateCourse = () => {
    setSelectedCourseId(null);
    setCurrentView('create');
  };

  const handleEditCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('edit');
  };

  const handleSaveCourse = (courseData: any) => {
    if (selectedCourseId) {
      updateCourse(courseData);
    } else {
      createCourse(courseData);
    }
    setCurrentView('list');
    setSelectedCourseId(null);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      deleteCourse(courseId);
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedCourseId(null);
  };

  const selectedCourse = selectedCourseId ? courses.find(c => c.id === selectedCourseId) : undefined;

  if (currentView === 'edit' || currentView === 'create') {
    return (
      <CourseEditor
        courseId={selectedCourseId || undefined}
        onSave={handleSaveCourse}
        onCancel={handleCancel}
        initialData={selectedCourse}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Gestion des Formations</h1>
        <button 
          onClick={handleCreateCourse}
          className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Formation
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-4 flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700">Filtrer par:</span>
          
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="draft">Brouillon</option>
            <option value="archived">Archivé</option>
          </select>
          
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select 
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Tous les niveaux</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
              </div>
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {course.lessons} leçons
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                {getStatusBadge(course.status)}
                <span className="text-xs text-gray-500">{course.category}</span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center space-x-1 mr-3">
                  {renderStars(course.rating)}
                </div>
                <span className="text-sm text-gray-600">({course.rating})</span>
              </div>
              
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Instructeur:</span>
                  <span className="font-medium">{course.instructor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Durée:</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Étudiants:</span>
                  <span className="font-medium">{course.students}/{course.maxStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Prix:</span>
                  <span className="font-medium text-blue-600">{course.price}€</span>
                </div>
              </div>
              
              {/* Progress Bar for Enrollment */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Inscriptions</span>
                  <span className="text-sm text-gray-600">{Math.round((course.students / course.maxStudents) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(course.students / course.maxStudents) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleEditCourse(course.id)}
                    className="text-blue-600 hover:text-blue-900 p-2" 
                    title="Éditer"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900 p-2" title="Aperçu">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-red-600 hover:text-red-900 p-2" 
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  {course.students} inscrits
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune formation trouvée</p>
        </div>
      )}
    </div>
  );
};