import { AdmissionApplication } from '../contexts/AdmissionContext';

export class AdmissionService {
  private static instance: AdmissionService;

  public static getInstance(): AdmissionService {
    if (!AdmissionService.instance) {
      AdmissionService.instance = new AdmissionService();
    }
    return AdmissionService.instance;
  }

  async submitApplication(application: AdmissionApplication): Promise<{ success: boolean; applicationId: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Validate application
    const validation = this.validateApplication(application);
    if (!validation.isValid) {
      throw new Error(`Application validation failed: ${validation.errors.join(', ')}`);
    }

    // Simulate submission
    console.log('Submitting application:', application);
    
    return {
      success: true,
      applicationId: application.id
    };
  }

  validateApplication(application: AdmissionApplication): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Personal info validation
    if (!application.personalInfo.firstName) errors.push('Prénom requis');
    if (!application.personalInfo.lastName) errors.push('Nom requis');
    if (!application.personalInfo.email) errors.push('Email requis');
    if (!application.personalInfo.phone) errors.push('Téléphone requis');

    // Academic info validation
    if (!application.academicInfo.currentLevel) errors.push('Niveau d\'études requis');
    if (!application.academicInfo.institution) errors.push('Établissement requis');

    // Program info validation
    if (!application.programInfo.program) errors.push('Programme requis');
    if (!application.programInfo.motivation) errors.push('Lettre de motivation requise');

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async uploadDocument(file: File, type: string): Promise<string> {
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock URL
    return `https://esst-storage.com/documents/${type}/${file.name}`;
  }

  async getApplicationStatus(applicationId: string): Promise<string> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const statuses = ['submitted', 'under_review', 'accepted', 'rejected'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }
}
