import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Project {
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
  priority?: 'low' | 'medium' | 'high';
  budget?: number;
  tags?: string[];
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: string;
  }>;
  links?: Array<{
    id: string;
    title: string;
    url: string;
  }>;
  objectives?: string[];
  requirements?: string[];
  deliverables?: string[];
  risks?: string[];
  notes?: string;
  createdBy?: string;
  createdAt?: string;
  lastModified?: string;
}

interface ProjectsContextType {
  projects: Project[];
  getActiveProjects: () => Project[];
  getProjectById: (id: string) => Project | undefined;
  updateProject: (projectData: any) => void;
  createProject: (projectData: any) => void;
  deleteProject: (projectId: string) => void;
  getProjectsByCategory: (category: string) => Project[];
  getProjectsByStatus: (status: string) => Project[];
  searchProjects: (query: string) => Project[];
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
      description: 'Création d\'une application web avec framework Django et Bootstrap pour la gestion des étudiants',
      category: 'Développement Web',
      status: 'active',
      progress: 65,
      members: 5,
      deadline: '16/06/2025',
      startDate: '2025-04-16',
      endDate: '2025-06-16',
      membersList: ['Sophie Laurent', 'Thomas Lambert', 'Marie Dubois', 'Alex Chen', 'Emma Rousseau'],
      priority: 'high',
      budget: 5000,
      tags: ['Django', 'Python', 'Web', 'Bootstrap'],
      objectives: [
        'Créer une interface utilisateur intuitive',
        'Implémenter un système d\'authentification',
        'Développer les fonctionnalités CRUD',
        'Optimiser les performances'
      ],
      requirements: [
        'Python 3.9+',
        'Django 4.0+',
        'Base de données PostgreSQL',
        'Interface responsive'
      ],
      deliverables: [
        'Application web fonctionnelle',
        'Documentation technique',
        'Tests unitaires',
        'Guide d\'installation'
      ],
      risks: [
        'Retard dans le développement',
        'Problèmes de compatibilité',
        'Surcharge de travail'
      ],
      notes: 'Projet prioritaire pour le semestre. Collaboration étroite avec l\'équipe backend.',
      createdBy: 'Prof. Marie Dubois',
      createdAt: '15/04/2025',
      lastModified: '20/04/2025',
      links: [
        { id: '1', title: 'Repository GitHub', url: 'https://github.com/esst/django-project' },
        { id: '2', title: 'Documentation Django', url: 'https://docs.djangoproject.com/' }
      ]
    },
    {
      id: '2',
      title: 'Intelligence artificielle: Classification d\'images',
      description: 'Développement d\'un modèle de deep learning pour la classification automatique d\'images médicales',
      category: 'IA & Machine Learning',
      status: 'active',
      progress: 40,
      members: 4,
      deadline: '28/05/2025',
      startDate: '2025-03-20',
      endDate: '2025-05-28',
      membersList: ['Alex Chen', 'Sophie Laurent', 'Lucas Moreau', 'Camille Bernard'],
      priority: 'high',
      budget: 8000,
      tags: ['IA', 'Deep Learning', 'TensorFlow', 'Classification'],
      objectives: [
        'Collecter et préparer le dataset',
        'Entraîner le modèle CNN',
        'Optimiser la précision',
        'Déployer le modèle'
      ],
      requirements: [
        'TensorFlow 2.0+',
        'GPU pour l\'entraînement',
        'Dataset d\'images médicales',
        'Python 3.8+'
      ],
      deliverables: [
        'Modèle entraîné',
        'API de prédiction',
        'Interface web de test',
        'Rapport de performance'
      ],
      risks: [
        'Qualité insuffisante du dataset',
        'Temps d\'entraînement trop long',
        'Overfitting du modèle'
      ],
      notes: 'Collaboration avec le département de médecine pour la validation des résultats.',
      createdBy: 'Dr. Jean Martin',
      createdAt: '10/03/2025',
      lastModified: '18/04/2025'
    },
    {
      id: '3',
      title: 'Analyse de données biomédicales',
      description: 'Utilisation de Python et R pour l\'analyse statistique de données biomédicales complexes',
      category: 'Data Science',
      status: 'draft',
      progress: 15,
      members: 3,
      deadline: '01/07/2025',
      startDate: '2025-04-10',
      endDate: '2025-07-01',
      membersList: ['Pierre Martin', 'Julie Petit', 'Nicolas Blanc'],
      priority: 'medium',
      budget: 3000,
      tags: ['Data Science', 'Python', 'R', 'Biomédicale'],
      objectives: [
        'Nettoyer et préparer les données',
        'Effectuer l\'analyse exploratoire',
        'Appliquer des modèles statistiques',
        'Visualiser les résultats'
      ],
      requirements: [
        'Python avec pandas/numpy',
        'R avec tidyverse',
        'Jupyter Notebook',
        'Accès aux données biomédicales'
      ],
      deliverables: [
        'Rapport d\'analyse',
        'Visualisations interactives',
        'Code source documenté',
        'Présentation des résultats'
      ],
      risks: [
        'Données manquantes ou incomplètes',
        'Problèmes de confidentialité',
        'Complexité des analyses'
      ],
      notes: 'Projet en phase de démarrage. Attente de l\'autorisation d\'accès aux données.',
      createdBy: 'Prof. Sarah Durand',
      createdAt: '05/04/2025',
      lastModified: '15/04/2025'
    },
    {
      id: '4',
      title: 'Sécurité des réseaux IoT',
      description: 'Analyse et implémentation de protocoles de sécurité pour les réseaux d\'objets connectés',
      category: 'Cybersécurité',
      status: 'completed',
      progress: 100,
      members: 6,
      deadline: '05/03/2025',
      startDate: '2025-01-15',
      endDate: '2025-03-05',
      membersList: ['Jean Dupont', 'Marie Claire', 'Alex Chen', 'Thomas Lambert', 'Sophie Martin', 'Lucas Moreau'],
      priority: 'high',
      budget: 12000,
      tags: ['Cybersécurité', 'IoT', 'Réseaux', 'Protocoles'],
      objectives: [
        'Analyser les vulnérabilités IoT',
        'Développer des protocoles sécurisés',
        'Tester la résistance aux attaques',
        'Documenter les bonnes pratiques'
      ],
      requirements: [
        'Équipements IoT de test',
        'Outils de pentesting',
        'Environnement de simulation',
        'Expertise en sécurité réseau'
      ],
      deliverables: [
        'Protocoles de sécurité',
        'Outils de test',
        'Guide de sécurisation',
        'Rapport de vulnérabilités'
      ],
      risks: [],
      notes: 'Projet terminé avec succès. Résultats publiés dans une conférence internationale.',
      createdBy: 'Dr. Jean Martin',
      createdAt: '10/01/2025',
      lastModified: '05/03/2025'
    },
    {
      id: '5',
      title: 'Plateforme e-learning interactive',
      description: 'Développement d\'une plateforme d\'apprentissage en ligne avec fonctionnalités interactives',
      category: 'Développement Web',
      status: 'active',
      progress: 30,
      members: 7,
      deadline: '15/08/2025',
      startDate: '2025-04-01',
      endDate: '2025-08-15',
      membersList: ['Emma Rousseau', 'Thomas Lambert', 'Camille Bernard', 'Pierre Martin', 'Julie Petit', 'Nicolas Blanc', 'Sarah Durand'],
      priority: 'medium',
      budget: 15000,
      tags: ['E-learning', 'React', 'Node.js', 'MongoDB'],
      objectives: [
        'Créer l\'interface utilisateur',
        'Développer le système de cours',
        'Implémenter les quiz interactifs',
        'Ajouter le suivi de progression'
      ],
      requirements: [
        'React 18+',
        'Node.js avec Express',
        'Base de données MongoDB',
        'Système d\'authentification'
      ],
      deliverables: [
        'Plateforme web complète',
        'Application mobile',
        'Tableau de bord admin',
        'Documentation utilisateur'
      ],
      risks: [
        'Complexité de l\'interface',
        'Performance avec beaucoup d\'utilisateurs',
        'Intégration des contenus multimédias'
      ],
      notes: 'Projet ambitieux avec potentiel de commercialisation. Collaboration avec le service pédagogique.',
      createdBy: 'Prof. Marie Dubois',
      createdAt: '25/03/2025',
      lastModified: '19/04/2025'
    },
    {
      id: '6',
      title: 'Système de recommandation intelligent',
      description: 'Développement d\'un système de recommandation basé sur l\'apprentissage automatique',
      category: 'IA & Machine Learning',
      status: 'draft',
      progress: 5,
      members: 4,
      deadline: '30/09/2025',
      startDate: '2025-05-01',
      endDate: '2025-09-30',
      membersList: ['Alex Chen', 'Sophie Laurent', 'Lucas Moreau', 'Emma Rousseau'],
      priority: 'low',
      budget: 6000,
      tags: ['Recommandation', 'ML', 'Python', 'Collaborative Filtering'],
      objectives: [
        'Étudier les algorithmes de recommandation',
        'Collecter les données utilisateur',
        'Implémenter les modèles ML',
        'Évaluer les performances'
      ],
      requirements: [
        'Scikit-learn',
        'Pandas et NumPy',
        'Données utilisateur anonymisées',
        'Infrastructure de calcul'
      ],
      deliverables: [
        'Modèles de recommandation',
        'API de recommandation',
        'Évaluation comparative',
        'Documentation technique'
      ],
      risks: [
        'Manque de données d\'entraînement',
        'Problèmes de cold start',
        'Biais dans les recommandations'
      ],
      notes: 'Projet de recherche exploratoire. Collaboration possible avec des entreprises partenaires.',
      createdBy: 'Dr. Jean Martin',
      createdAt: '20/04/2025',
      lastModified: '20/04/2025'
    }
  ]);

  const getActiveProjects = () => {
    return projects.filter(project => project.status === 'active');
  };

  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  const updateProject = (projectData: any) => {
    setProjects(prev => prev.map(project => 
      project.id === projectData.id ? {
        ...project,
        ...projectData,
        members: projectData.membersList?.length || projectData.members || project.members,
        membersList: projectData.membersList || project.membersList,
        lastModified: new Date().toLocaleDateString('fr-FR')
      } : project
    ));
  };

  const createProject = (projectData: any) => {
    const newProject = {
      ...projectData,
      id: Date.now().toString(),
      members: projectData.membersList?.length || projectData.members || 0,
      membersList: projectData.membersList || [],
      createdAt: new Date().toLocaleDateString('fr-FR'),
      lastModified: new Date().toLocaleDateString('fr-FR')
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const getProjectsByCategory = (category: string) => {
    return projects.filter(project => project.category === category);
  };

  const getProjectsByStatus = (status: string) => {
    return projects.filter(project => project.status === status);
  };

  const searchProjects = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return projects.filter(project =>
      project.title.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.category.toLowerCase().includes(lowercaseQuery) ||
      project.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  return (
    <ProjectsContext.Provider value={{
      projects,
      getActiveProjects,
      getProjectById,
      updateProject,
      createProject,
      deleteProject,
      getProjectsByCategory,
      getProjectsByStatus,
      searchProjects
    }}>
      {children}
    </ProjectsContext.Provider>
  );
};