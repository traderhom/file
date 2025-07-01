
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/pages`)
      .then(res => res.json())
      .then((pages) => {
        const found = pages.find((p: any) => p.slug === slug && p.status === 'published');
        setPage(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (!slug || (!loading && !page)) {
    return <Navigate to="/" replace />;
  }
  if (loading) {
    return <div>Chargement...</div>;
  }

  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('# ')) {
        return (
          <h1 key={index} className="text-4xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
            {trimmedLine.slice(2)}
          </h1>
        );
      } else if (trimmedLine.startsWith('## ')) {
        return (
          <h2 key={index} className="text-3xl font-bold text-gray-900 mb-4 mt-8">
            {trimmedLine.slice(3)}
          </h2>
        );
      } else if (trimmedLine.startsWith('### ')) {
        return (
          <h3 key={index} className="text-2xl font-bold text-gray-900 mb-3 mt-6">
            {trimmedLine.slice(4)}
          </h3>
        );
      } else if (trimmedLine.startsWith('- ')) {
        return (
          <li key={index} className="ml-6 mb-2 text-gray-700 list-disc">
            {trimmedLine.slice(2)}
          </li>
        );
      } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        return (
          <p key={index} className="mb-4 text-gray-700">
            <strong>{trimmedLine.slice(2, -2)}</strong>
          </p>
        );
      } else if (trimmedLine.length > 0) {
        // Check if line contains bold text
        const boldRegex = /\*\*(.*?)\*\*/g;
        if (boldRegex.test(trimmedLine)) {
          const parts = trimmedLine.split(boldRegex);
          return (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {parts.map((part, partIndex) => 
                partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
              )}
            </p>
          );
        }
        return (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {trimmedLine}
          </p>
        );
      } else {
        return <br key={index} />;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        {page.featuredImage && (
          <div className="mb-12">
            <img
              src={page.featuredImage}
              alt={page.title}
              className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Page Content */}
        <article className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {page.title}
            </h1>
            {page.metaDescription && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {page.metaDescription}
              </p>
            )}
            <div className="flex items-center space-x-4 mt-6 pt-6 border-t border-gray-200">
              <span className="text-sm text-gray-500">
                Dernière mise à jour: {page.lastModified}
              </span>
              <span className="text-sm text-gray-500">
                Par {page.author}
              </span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            {renderContent(page.content)}
          </div>
        </article>

        {/* Call to Action */}
        <section className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Intéressé par l'ESST ?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Découvrez nos formations et rejoignez notre communauté d'excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Nos formations
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Nous contacter
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};