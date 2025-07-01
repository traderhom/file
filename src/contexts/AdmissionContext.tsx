import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AdmissionApplication {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    nationality: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  academicInfo: {
    currentLevel: string;
    institution: string;
    field: string;
    graduationYear: string;
    gpa: string;
    transcripts: File[];
  };
  programInfo: {
    program: string;
    specialization: string;
    startDate: string;
    motivation: string;
    goals: string;
  };
  documents: {
    cv: File | null;
    motivationLetter: File | null;
    recommendations: File[];
    portfolio: File | null;
  };
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
  submittedAt?: Date;
  reviewedAt?: Date;
  notes?: string;
}

interface AdmissionContextType {
  applications: AdmissionApplication[];
  currentApplication: AdmissionApplication | null;
  createApplication: () => string;
  updateApplication: (id: string, data: Partial<AdmissionApplication>) => void;
  submitApplication: (id: string) => Promise<void>;
  getApplicationById: (id: string) => AdmissionApplication | undefined;
  deleteApplication: (id: string) => void;
}

const AdmissionContext = createContext<AdmissionContextType | undefined>(undefined);

export const useAdmission = () => {
  const context = useContext(AdmissionContext);
  if (context === undefined) {
    throw new Error('useAdmission must be used within an AdmissionProvider');
  }
  return context;
};

interface AdmissionProviderProps {
  children: ReactNode;
}

export const AdmissionProvider: React.FC<AdmissionProviderProps> = ({ children }) => {
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [currentApplication, setCurrentApplication] = useState<AdmissionApplication | null>(null);

  const createApplication = (): string => {
    const newApplication: AdmissionApplication = {
      id: Date.now().toString(),
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        nationality: '',
        address: '',
        city: '',
        postalCode: '',
        country: ''
      },
      academicInfo: {
        currentLevel: '',
        institution: '',
        field: '',
        graduationYear: '',
        gpa: '',
        transcripts: []
      },
      programInfo: {
        program: '',
        specialization: '',
        startDate: '',
        motivation: '',
        goals: ''
      },
      documents: {
        cv: null,
        motivationLetter: null,
        recommendations: [],
        portfolio: null
      },
      status: 'draft'
    };

    setApplications(prev => [...prev, newApplication]);
    setCurrentApplication(newApplication);
    return newApplication.id;
  };

  const updateApplication = (id: string, data: Partial<AdmissionApplication>) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, ...data } : app
    ));
    
    if (currentApplication?.id === id) {
      setCurrentApplication(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const submitApplication = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    
    updateApplication(id, {
      status: 'submitted',
      submittedAt: new Date()
    });
  };

  const getApplicationById = (id: string) => {
    return applications.find(app => app.id === id);
  };

  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    if (currentApplication?.id === id) {
      setCurrentApplication(null);
    }
  };

  return (
    <AdmissionContext.Provider value={{
      applications,
      currentApplication,
      createApplication,
      updateApplication,
      submitApplication,
      getApplicationById,
      deleteApplication
    }}>
      {children}
    </AdmissionContext.Provider>
  );
};
