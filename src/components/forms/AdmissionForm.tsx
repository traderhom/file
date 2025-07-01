import React, { useState, useRef } from 'react';
import { 
  User, 
  GraduationCap, 
  FileText, 
  Upload, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Save,
  Send
} from 'lucide-react';
import { useAdmission } from '../../contexts/AdmissionContext';
import { AdmissionService } from '../../services/AdmissionService';


// ... Code complet du formulaire multi-étapes ...

interface AdmissionFormProps {
  applicationId?: string;
  onComplete?: () => void;
}

const AdmissionForm: React.FC<AdmissionFormProps> = ({ applicationId, onComplete }) => {
  const { currentApplication, updateApplication, submitApplication } = useAdmission();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const fileInputRefs = {
    cv: useRef<HTMLInputElement>(null),
    motivationLetter: useRef<HTMLInputElement>(null),
    portfolio: useRef<HTMLInputElement>(null),
    transcripts: useRef<HTMLInputElement>(null)
  };

  const admissionService = AdmissionService.getInstance();

  const steps = [
    { id: 1, title: 'Informations personnelles', icon: User },
    { id: 2, title: 'Parcours académique', icon: GraduationCap },
    { id: 3, title: 'Programme souhaité', icon: FileText },
    { id: 4, title: 'Documents', icon: Upload },
    { id: 5, title: 'Confirmation', icon: CheckCircle }
  ];

  const programs = [
    'Licence Informatique',
    'Master Data Science',
    'Master Intelligence Artificielle',
    'Master Cybersécurité',
    'Ingénieur Électronique',
    'Doctorat en Sciences'
  ];

  const specializations = {
    'Licence Informatique': ['Développement Web', 'Systèmes et Réseaux', 'Intelligence Artificielle'],
    'Master Data Science': ['Machine Learning', 'Big Data', 'Analyse Prédictive'],
    'Master Intelligence Artificielle': ['Deep Learning', 'Computer Vision', 'NLP'],
    'Master Cybersécurité': ['Sécurité Réseau', 'Cryptographie', 'Forensique'],
    'Ingénieur Électronique': ['Systèmes Embarqués', 'IoT', 'Robotique'],
    'Doctorat en Sciences': ['Informatique', 'Mathématiques', 'Physique']
  };

  if (!currentApplication) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune candidature en cours</p>
      </div>
    );
  }

  const handleInputChange = (section: string, field: string, value: string) => {
    // Correction du spread pour éviter l'erreur TS2698
    const sectionValue = (currentApplication as any)[section] || {};
    updateApplication(currentApplication.id, {
      [section]: {
        ...sectionValue,
        [field]: value
      }
    });
  };

  const handleFileUpload = async (type: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      const url = await admissionService.uploadDocument(file, type);
      
      if (type === 'transcripts') {
        updateApplication(currentApplication.id, {
          academicInfo: {
            ...currentApplication.academicInfo,
            transcripts: [...currentApplication.academicInfo.transcripts, file]
          }
        });
      } else {
        updateApplication(currentApplication.id, {
          documents: {
            ...currentApplication.documents,
            [type]: file
          }
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    switch (step) {
      case 1:
        if (!currentApplication.personalInfo.firstName) newErrors.firstName = 'Prénom requis';
        if (!currentApplication.personalInfo.lastName) newErrors.lastName = 'Nom requis';
        if (!currentApplication.personalInfo.email) newErrors.email = 'Email requis';
        if (!currentApplication.personalInfo.phone) newErrors.phone = 'Téléphone requis';
        break;
      case 2:
        if (!currentApplication.academicInfo.currentLevel) newErrors.currentLevel = 'Niveau requis';
        if (!currentApplication.academicInfo.institution) newErrors.institution = 'Établissement requis';
        break;
      case 3:
        if (!currentApplication.programInfo.program) newErrors.program = 'Programme requis';
        if (!currentApplication.programInfo.motivation) newErrors.motivation = 'Motivation requise';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitApplication(currentApplication.id);
      onComplete?.();
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Informations personnelles</h3>
            {/* ... (le reste du code du step 1, voir note) ... */}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Parcours académique</h3>
            {/* ... (le reste du code du step 2, voir note) ... */}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Programme souhaité</h3>
            {/* ... (le reste du code du step 3, voir note) ... */}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Documents requis</h3>
            {/* ... (le reste du code du step 4, voir note) ... */}
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Confirmation de candidature</h3>
            {/* ... (le reste du code du step 5, voir note) ... */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isCompleted ? 'bg-green-600 border-green-600 text-white' :
                  isActive ? 'bg-blue-600 border-blue-600 text-white' :
                  'border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Précédent
          </button>

          <div className="flex space-x-3">
            <button
              onClick={() => updateApplication(currentApplication.id, { status: 'draft' })}
              className="flex items-center px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Suivant
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Soumission...' : 'Soumettre la candidature'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionForm;
