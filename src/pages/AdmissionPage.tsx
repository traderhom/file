import React from 'react';
import { Navbar } from '../components/Navbar';
import AdmissionForm from '../components/forms/AdmissionForm';

const AdmissionPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Candidature à l'ESST</h1>
        <AdmissionForm />
      </div>
    </div>
  );
};

export default AdmissionPage;
