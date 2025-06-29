import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'draft' | 'completed' | 'cancelled';
  progress: number;
  members: number;
  deadline: string;
  startDate?: string;
  endDate?: string;
  membersList?: string[];
}

interface ProjectsContextType {
  projects: Project[];
  getActiveProjects: () => Project[];
  updateProject: (projectData: any) => void;
  createProject: (projectData: any) => void;
  deleteProject: (projectId: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};

interface ProjectsProviderProps {
  children: ReactNode;
}

export const ProjectsProvider: React.FC<ProjectsProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Développement web avec Django',
      description: 'Création d\'une application web avec framework Django et Bootstrap',
      category: 'Développement Web',
      status: 'active',
      progress: 50,
      members: 5,
      deadline: '16/06/2025',
      startDate: '2025-04-16',
      endDate: '2025-06-16',
      membersList: ['John Doe', 'Marie Martin']
    },
    {
      id: '2',
      title: 'Intelligence artificielle: bases',
      description: 'Introduction aux concepts de l\'IA et implémentation d\'algorithmes',
      category: 'IA & ML',
      status: 'active',
      progress: 70,
      members: 4,
      deadline: '28/05/2025',
      startDate: '2025-03-20',
      endDate: '2025-05-20',
      membersList: ['Alex Dubois', 'Sophie Laurent']
    },
    {
      id: '3',
      title: 'Analyse de données biomédicales',
      description: 'Utilisation de Python pour l\'analyse de données médicales',
      category: 'Data Science',
      status: 'draft',
      progress: 10,
      members: 3,
      deadline: '01/07/2025',
      startDate: '2025-04-10',
      endDate: '2025-07-01',
      membersList: ['Pierre Martin']
    },
    {
      id: '4',
      title: 'Sécurité des réseaux',
      description: 'Analyse et implémentation de protocoles de sécurité réseau',
      category: 'Cybersécurité',
      status: 'completed',
      progress: 100,
      members: 6,
      deadline: '05/03/2025',
      startDate: '2025-02-01',
      endDate: '2025-03-05',
      membersList: ['Jean Dupont', 'Marie Claire', 'Alex Chen']
    }
  ]);

  const getActiveProjects = () => {
    return projects.filter(project => project.status === 'active');
  };

  const updateProject = (projectData: any) => {
    setProjects(prev => prev.map(project => 
      project.id === projectData.id ? {
        ...project,
        ...projectData,
        members: projectData.members?.length || projectData.membersList?.length || project.members,
        membersList: projectData.members || projectData.membersList || project.membersList
      } : project
    ));
  };

  const createProject = (projectData: any) => {
    const newProject = {
      ...projectData,
      members: projectData.members?.length || projectData.membersList?.length || 0,
      membersList: projectData.members || projectData.membersList || []
    };
    setProjects(prev => [...prev, newProject]);
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  return (
    <ProjectsContext.Provider value={{
      projects,
      getActiveProjects,
      updateProject,
      createProject,
      deleteProject
    }}>
      {children}
    </ProjectsContext.Provider>
  );
};