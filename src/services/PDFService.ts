import { PDFGenerator, BrochureData } from '../utils/pdfGenerator';

export class PDFService {
  private static instance: PDFService;
  private pdfGenerator: PDFGenerator;

  private constructor() {
    this.pdfGenerator = PDFGenerator.getInstance();
  }

  public static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService();
    }
    return PDFService.instance;
  }

  async downloadBrochure(type: 'general' | 'formation', programName?: string): Promise<void> {
    try {
      let pdfBlob: Blob;
      let filename: string;

      if (type === 'general') {
        pdfBlob = await this.pdfGenerator.generateGeneralBrochure();
        filename = 'ESST-Brochure-Generale.pdf';
      } else if (type === 'formation' && programName) {
        pdfBlob = await this.pdfGenerator.generateFormationBrochure(programName);
        filename = `ESST-Formation-${programName.replace(/\s+/g, '-')}.pdf`;
      } else {
        throw new Error('Type de brochure invalide');
      }

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      throw error;
    }
  }

  async generateCustomBrochure(data: BrochureData): Promise<Blob> {
    return this.pdfGenerator.generateBrochurePDF(data);
  }

  async previewBrochure(type: 'general' | 'formation', programName?: string): Promise<string> {
    try {
      let pdfBlob: Blob;

      if (type === 'general') {
        pdfBlob = await this.pdfGenerator.generateGeneralBrochure();
      } else if (type === 'formation' && programName) {
        pdfBlob = await this.pdfGenerator.generateFormationBrochure(programName);
      } else {
        throw new Error('Type de brochure invalide');
      }

      return URL.createObjectURL(pdfBlob);
    } catch (error) {
      console.error('Erreur lors de la prévisualisation:', error);
      throw error;
    }
  }

  getBrochureTypes() {
    return [
      {
        id: 'general',
        title: 'Brochure générale ESST',
        description: 'Présentation complète de l\'école, formations et services',
        size: '2.5 MB',
        pages: 12
      },
      {
        id: 'licence-informatique',
        title: 'Licence Informatique',
        description: 'Programme détaillé, débouchés et modalités d\'admission',
        size: '1.8 MB',
        pages: 8
      },
      {
        id: 'master-data-science',
        title: 'Master Data Science',
        description: 'Spécialisations, projets et partenariats industriels',
        size: '2.1 MB',
        pages: 10
      },
      {
        id: 'master-ia',
        title: 'Master Intelligence Artificielle',
        description: 'Cursus avancé en IA et machine learning',
        size: '2.3 MB',
        pages: 10
      },
      {
        id: 'master-cybersecurite',
        title: 'Master Cybersécurité',
        description: 'Formation en sécurité informatique et réseaux',
        size: '2.0 MB',
        pages: 9
      },
      {
        id: 'ingenieur-electronique',
        title: 'Ingénieur Électronique',
        description: 'Formation d\'ingénieur en systèmes embarqués',
        size: '2.4 MB',
        pages: 11
      }
    ];
  }
}
