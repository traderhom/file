import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  duration: string;
  students: number;
  maxStudents: number;
  rating: number;
  status: 'active' | 'draft' | 'archived';
  price: number;
  image: string;
  lessons: number;
}

interface CoursesContextType {
  courses: Course[];
  getActiveCourses: () => Course[];
  updateCourse: (courseData: Course) => void;
  createCourse: (courseData: Course) => void;
  deleteCourse: (courseId: string) => void;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export const useCourses = () => {
  const context = useContext(CoursesContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
};

interface CoursesProviderProps {
  children: ReactNode;
}

export const CoursesProvider: React.FC<CoursesProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Introduction à Python',
      description: 'Apprenez les bases de la programmation Python avec des exercices pratiques.',
      instructor: 'Prof. Marie Dubois',
      category: 'Programmation',
      level: 'Débutant',
      duration: '8 semaines',
      students: 245,
      maxStudents: 300,
      rating: 4.8,
      status: 'active',
      price: 299,
      image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
      lessons: 24
    },
    {
      id: '2',
      title: 'Machine Learning Avancé',
      description: 'Techniques avancées de machine learning et deep learning.',
      instructor: 'Dr. Jean Martin',
      category: 'Intelligence Artificielle',
      level: 'Avancé',
      duration: '12 semaines',
      students: 89,
      maxStudents: 150,
      rating: 4.9,
      status: 'active',
      price: 599,
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
      lessons: 36
    },
    {
      id: '3',
      title: 'Sécurité des Réseaux',
      description: 'Principes et pratiques de la sécurité informatique moderne.',
      instructor: 'Prof. Alex Chen',
      category: 'Cybersécurité',
      level: 'Intermédiaire',
      duration: '10 semaines',
      students: 156,
      maxStudents: 200,
      rating: 4.7,
      status: 'active',
      price: 449,
      image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
      lessons: 30
    }
  ]);

  const getActiveCourses = () => {
    return courses.filter(course => course.status === 'active');
  };

  const updateCourse = (courseData: Course) => {
    setCourses(prev => prev.map(course => 
      course.id === courseData.id ? courseData : course
    ));
  };

  const createCourse = (courseData: Course) => {
    setCourses(prev => [...prev, courseData]);
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
  };

  return (
    <CoursesContext.Provider value={{
      courses,
      getActiveCourses,
      updateCourse,
      createCourse,
      deleteCourse
    }}>
      {children}
    </CoursesContext.Provider>
  );
};