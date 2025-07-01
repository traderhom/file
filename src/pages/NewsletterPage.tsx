import React from 'react';
import { Navbar } from '../components/Navbar';
import { NewsletterForm } from '../components/forms/NewsletterForm';

export const NewsletterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Abonnement à la newsletter
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Recevez les dernières actualités, événements et informations de l'ESST directement dans votre boîte mail.
          </p>
          <NewsletterForm />
        </div>
      </main>
    </div>
  );
};

export default NewsletterPage;
