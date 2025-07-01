export interface BrochureData {
  title: string;
  subtitle: string;
  sections: BrochureSection[];
  images: string[];
  contact: {
    address: string;
    phone: string;
    email: string;
    website: string;
  };
}

export interface BrochureSection {
  title: string;
  content: string;
  image?: string;
}

export class PDFGenerator {
  private static instance: PDFGenerator;

  public static getInstance(): PDFGenerator {
    if (!PDFGenerator.instance) {
      PDFGenerator.instance = new PDFGenerator();
    }
    return PDFGenerator.instance;
  }

  async generateBrochurePDF(data: BrochureData): Promise<Blob> {
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a simple HTML content for PDF
    const htmlContent = this.generateHTMLContent(data);
    
    // Convert HTML to PDF (simulation)
    const pdfBlob = new Blob([htmlContent], { type: 'application/pdf' });
    
    return pdfBlob;
  }

  private generateHTMLContent(data: BrochureData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${data.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 40px; }
          .title { font-size: 28px; font-weight: bold; color: #1A4B8C; }
          .subtitle { font-size: 18px; color: #666; margin-top: 10px; }
          .section { margin-bottom: 30px; page-break-inside: avoid; }
          .section-title { font-size: 20px; font-weight: bold; color: #1A4B8C; margin-bottom: 15px; }
          .section-content { line-height: 1.6; color: #333; }
          .contact { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 40px; }
          .contact-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
          .contact-info { margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${data.title}</div>
          <div class="subtitle">${data.subtitle}</div>
        </div>
        
        ${data.sections.map(section => `
          <div class="section">
            <div class="section-title">${section.title}</div>
            <div class="section-content">${section.content}</div>
          </div>
        `).join('')}
        
        <div class="contact">
          <div class="contact-title">Contact</div>
          <div class="contact-info"><strong>Adresse:</strong> ${data.contact.address}</div>
          <div class="contact-info"><strong>Téléphone:</strong> ${data.contact.phone}</div>
          <div class="contact-info"><strong>Email:</strong> ${data.contact.email}</div>
          <div class="contact-info"><strong>Site web:</strong> ${data.contact.website}</div>
        </div>
      </body>
      </html>
    `;
  }

  async generateFormationBrochure(programName: string): Promise<Blob> {
    const brochureData: BrochureData = {
      title: `Formation ${programName}`,
      subtitle: 'École Supérieure des Sciences et Technologies',
      sections: [
        {
          title: 'Présentation du programme',
          content: `Le programme ${programName} de l'ESST est conçu pour former les experts de demain dans un environnement d'apprentissage innovant et stimulant.`
        },
        {
          title: 'Objectifs pédagogiques',
          content: 'Développer les compétences techniques et managériales nécessaires pour exceller dans le domaine choisi.'
        },
        {
          title: 'Débouchés professionnels',
          content: 'Nos diplômés occupent des postes à responsabilité dans les plus grandes entreprises technologiques.'
        },
        {
          title: 'Modalités d\'admission',
          content: 'Processus de sélection rigoureux basé sur l\'excellence académique et la motivation.'
        }
      ],
      images: [],
      contact: {
        address: '123 Avenue des Sciences, 75000 Paris',
        phone: '+33 1 23 45 67 89',
        email: 'contact@esst.edu',
        website: 'https://esst.edu'
      }
    };

    return this.generateBrochurePDF(brochureData);
  }

  async generateGeneralBrochure(): Promise<Blob> {
    const brochureData: BrochureData = {
      title: 'École Supérieure des Sciences et Technologies',
      subtitle: 'Excellence • Innovation • Avenir',
      sections: [
        {
          title: 'Notre Mission',
          content: 'Former les leaders technologiques de demain à travers une approche pédagogique innovante et des partenariats industriels d\'excellence.'
        },
        {
          title: 'Nos Formations',
          content: 'Licences, Masters et formations d\'ingénieurs dans les domaines de pointe : IA, Cybersécurité, Data Science, Électronique.'
        },
        {
          title: 'Recherche & Innovation',
          content: 'Laboratoires de recherche reconnus internationalement avec des projets collaboratifs avec l\'industrie.'
        },
        {
          title: 'Vie Étudiante',
          content: 'Campus moderne, associations dynamiques, et accompagnement personnalisé pour la réussite de chaque étudiant.'
        }
      ],
      images: [],
      contact: {
        address: '123 Avenue des Sciences, 75000 Paris',
        phone: '+33 1 23 45 67 89',
        email: 'contact@esst.edu',
        website: 'https://esst.edu'
      }
    };

    return this.generateBrochurePDF(brochureData);
  }
}
