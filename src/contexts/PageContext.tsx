import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  const [pages, setPages] = useState<PageData[]>([
    {
      id: '1',
      title: 'Accueil',
      slug: 'accueil',
      content: `# Bienvenue à l'ESST

Découvrez notre plateforme collaborative dédiée à l'excellence académique et à la recherche innovante. Rejoignez une communauté d'étudiants, d'enseignants et de chercheurs passionnés.

## Notre Mission

Nous formons les leaders technologiques de demain à travers:
- Des programmes d'excellence académique
- Une recherche de pointe et innovante  
- Un accompagnement personnalisé
- Des partenariats industriels stratégiques

## Nos Domaines d'Excellence

### Intelligence Artificielle & Machine Learning
Développez vos compétences dans les technologies d'IA les plus avancées.

### Cybersécurité & Réseaux
Maîtrisez la protection des systèmes et données numériques.

### Développement Logiciel
Créez des applications innovantes avec les dernières technologies.

## Rejoignez-nous

L'ESST vous offre un environnement d'apprentissage exceptionnel avec des infrastructures modernes et une équipe pédagogique de renommée internationale.`,
      metaDescription: 'École Supérieure des Sciences et Technologies - Formation d\'excellence en informatique, IA et technologies',
      status: 'published',
      lastModified: '15/03/2025',
      author: 'Admin',
      seoTitle: 'ESST - École Supérieure des Sciences et Technologies',
      featuredImage: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '2',
      title: 'Présentation ESST',
      slug: 'presentation-esst',
      content: `# À propos de l'ESST

L'École Supérieure des Sciences et Technologies est un établissement d'enseignement supérieur de référence dans le domaine des technologies avancées.

## Notre Histoire

Fondée en 1995, l'ESST s'est imposée comme un acteur majeur de la formation technologique en France et à l'international.

## Nos Valeurs

- **Excellence académique** : Des programmes rigoureux et innovants
- **Innovation pédagogique** : Méthodes d'enseignement modernes
- **Ouverture internationale** : Partenariats avec les meilleures universités mondiales
- **Insertion professionnelle** : 95% de nos diplômés trouvent un emploi dans les 6 mois`,
      metaDescription: 'Découvrez l\'histoire, les valeurs et la mission de l\'École Supérieure des Sciences et Technologies',
      status: 'published',
      lastModified: '10/04/2025',
      author: 'Admin',
      seoTitle: 'À propos de l\'ESST - Notre histoire et nos valeurs'
    },
    {
      id: '3',
      title: 'Admission 2025/2026',
      slug: 'admission-2025-2026',
      content: `# Admissions 2025/2026

Rejoignez l'ESST pour la rentrée 2025/2026 et donnez une nouvelle dimension à votre avenir.

## Processus d'admission

### Étape 1: Candidature en ligne
Remplissez le formulaire de candidature avant le **30 juin 2025**.

### Étape 2: Dossier académique
Soumettez vos relevés de notes et lettres de recommandation avant le **15 juillet 2025**.

### Étape 3: Entretien
Participez à un entretien avec notre commission d'admission avant le **31 juillet 2025**.

### Étape 4: Résultats
Recevez votre réponse d'admission par email le **15 août 2025**.

## Formations disponibles

- **Licence Informatique** (Bac+3)
- **Master Data Science** (Bac+5)  
- **Ingénieur Électronique** (Bac+5)
- **Doctorat en Sciences** (Bac+8)`,
      metaDescription: 'Processus d\'admission à l\'ESST pour l\'année 2025/2026. Découvrez les étapes et les dates importantes.',
      status: 'draft',
      lastModified: '14/04/2025',
      author: 'Pierre Dupont'
    },
    {
      id: '4',
      title: 'Relations Internationales',
      slug: 'relations-internationales',
      content: `# Relations Internationales

L'ESST développe des partenariats avec des universités prestigieuses du monde entier pour offrir à ses étudiants une expérience internationale enrichissante.

## Programmes d'échange

### Erasmus+
Programme d'échange européen permettant d'étudier dans plus de 30 pays partenaires.

### Partenariats bilatéraux
Accords spécifiques avec des universités de renommée mondiale.

### Stages à l'international
Opportunités de stages dans des entreprises internationales.

## Universités partenaires

- **MIT** (États-Unis) - Massachusetts Institute of Technology
- **ETH Zurich** (Suisse) - École Polytechnique Fédérale
- **Imperial College London** (Royaume-Uni)
- **University of Tokyo** (Japon)
- **Technical University of Munich** (Allemagne)

## Bourses disponibles

- Bourse Erasmus+ : jusqu'à 400€/mois
- Bourse de mobilité internationale : jusqu'à 600€/mois
- Aide au voyage : forfait selon la destination`,
      metaDescription: 'Découvrez les programmes d\'échange et les partenariats internationaux de l\'ESST',
      status: 'review',
      lastModified: '12/04/2025',
      author: 'Marie Martin'
    }
  ]);

  const getPageBySlug = (slug: string) => {
    return pages.find(page => page.slug === slug);
  };

  const updatePage = (pageData: PageData) => {
    setPages(prev => prev.map(page => 
      page.id === pageData.id ? pageData : page
    ));
  };

  const createPage = (pageData: PageData) => {
    const newPage = {
      ...pageData,
      id: Date.now().toString()
    };
    setPages(prev => [...prev, newPage]);
  };

  const deletePage = (pageId: string) => {
    setPages(prev => prev.filter(page => page.id !== pageId));
  };

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