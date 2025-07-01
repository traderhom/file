import React, { useState } from 'react';
import { Mail, CheckCircle, X, Settings } from 'lucide-react';
import { useNewsletter } from '../../contexts/NewsletterContext';

interface NewsletterFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  compact?: boolean;
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({ 
  onSuccess, 
  onCancel, 
  compact = false 
}) => {
  const { subscribe, getSubscriptionByEmail } = useNewsletter();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    preferences: {
      news: true,
      events: true,
      research: false,
      admissions: false
    },
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPreferences, setShowPreferences] = useState(!compact);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (error) setError('');
  };

  const handlePreferenceChange = (preference: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      setError('L\'adresse email est requise');
      return;
    }

    // Check if email is already subscribed
    const existing = getSubscriptionByEmail(formData.email);
    if (existing && existing.status === 'active') {
      setError('Cette adresse email est déjà inscrite à notre newsletter');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await subscribe(formData);
      setIsSuccess(true);
      
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Inscription réussie !
        </h3>
        <p className="text-gray-600 mb-4">
          Merci de vous être inscrit(e) à notre newsletter. Vous recevrez un email de confirmation sous peu.
        </p>
        <p className="text-sm text-gray-500">
          Vous pouvez modifier vos préférences à tout moment en cliquant sur le lien dans nos emails.
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Votre adresse email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>
        
        <div className="flex space-x-2">
          {!showPreferences && (
            <button
              type="button"
              onClick={() => setShowPreferences(true)}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Préférences"
            >
              <Settings className="h-5 w-5" />
            </button>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Mail className="h-5 w-5 mr-2" />
                S'abonner
              </>
            )}
          </button>
        </div>

        {showPreferences && (
          <div className="sm:col-span-2 mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Préférences de contenu</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries({
                news: 'Actualités',
                events: 'Événements',
                research: 'Recherche',
                admissions: 'Admissions'
              }).map(([key, label]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferences[key as keyof typeof formData.preferences]}
                    onChange={(e) => handlePreferenceChange(key, e.target.checked)}
                    className="rounded border-gray-300 mr-2"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
            
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fréquence
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => handleInputChange('frequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="daily">Quotidienne</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuelle</option>
              </select>
            </div>
          </div>
        )}
      </form>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Restez informé
        </h2>
        <p className="text-gray-600">
          Abonnez-vous à notre newsletter pour recevoir les dernières actualités de l'ESST
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prénom
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre prénom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre nom"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="votre.email@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Préférences de contenu
          </label>
          <div className="space-y-2">
            {Object.entries({
              news: 'Actualités et nouvelles de l\'école',
              events: 'Événements et conférences',
              research: 'Publications et recherche',
              admissions: 'Informations sur les admissions'
            }).map(([key, label]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.preferences[key as keyof typeof formData.preferences]}
                  onChange={(e) => handlePreferenceChange(key, e.target.checked)}
                  className="rounded border-gray-300 mr-3"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fréquence de réception
          </label>
          <select
            value={formData.frequency}
            onChange={(e) => handleInputChange('frequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="daily">Quotidienne</option>
            <option value="weekly">Hebdomadaire (recommandé)</option>
            <option value="monthly">Mensuelle</option>
          </select>
        </div>

        <div className="flex space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Inscription...
              </>
            ) : (
              <>
                <Mail className="h-5 w-5 mr-2" />
                S'abonner
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          En vous abonnant, vous acceptez de recevoir nos emails. Vous pouvez vous désabonner à tout moment.
        </p>
      </form>
    </div>
  );
};
