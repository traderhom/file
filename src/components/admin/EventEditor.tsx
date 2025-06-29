import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Calendar, MapPin, Users, Clock } from 'lucide-react';

interface EventData {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  maxAttendees: number;
  currentAttendees: number;
  organizer: string;
  image: string;
}

interface EventEditorProps {
  eventId?: string;
  onSave: (eventData: EventData) => void;
  onCancel: () => void;
  initialData?: EventData;
}

export const EventEditor: React.FC<EventEditorProps> = ({
  eventId,
  onSave,
  onCancel,
  initialData
}) => {
  const [eventData, setEventData] = useState<EventData>({
    id: eventId || '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    location: '',
    category: 'Conférence',
    status: 'upcoming',
    maxAttendees: 100,
    currentAttendees: 0,
    organizer: 'Admin',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const categories = ['Conférence', 'Workshop', 'Événement', 'Séminaire', 'Formation'];

  // Load initial data when component mounts or initialData changes
  useEffect(() => {
    if (initialData) {
      // Convert date format from DD/MM/YYYY to YYYY-MM-DD for input
      let formattedDate = initialData.date;
      if (initialData.date && initialData.date.includes('/')) {
        const [day, month, year] = initialData.date.split('/');
        formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      setEventData({
        ...initialData,
        date: formattedDate
      });
    }
  }, [initialData]);

  const handleInputChange = (field: keyof EventData, value: string | number) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Convert date back to DD/MM/YYYY format for display
      const formattedDate = new Date(eventData.date).toLocaleDateString('fr-FR');
      
      const dataToSave = {
        ...eventData,
        date: formattedDate,
        id: eventId || Date.now().toString()
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage('Événement sauvegardé avec succès !');
      setTimeout(() => {
        onSave(dataToSave);
      }, 500);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveMessage('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onCancel}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {eventId ? 'Modifier l\'événement' : 'Nouvel événement'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {saveMessage && (
              <span className={`text-sm font-medium ${
                saveMessage.includes('succès') ? 'text-green-600' : 'text-red-600'
              }`}>
                {saveMessage}
              </span>
            )}
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'événement *
                </label>
                <input
                  type="text"
                  value={eventData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom de l'événement"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={eventData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Description de l'événement..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={eventData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure *
                  </label>
                  <input
                    type="time"
                    value={eventData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lieu *
                </label>
                <input
                  type="text"
                  value={eventData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Lieu de l'événement"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organisateur *
                </label>
                <input
                  type="text"
                  value={eventData.organizer}
                  onChange={(e) => handleInputChange('organizer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom de l'organisateur"
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={eventData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={eventData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="upcoming">À venir</option>
                  <option value="ongoing">En cours</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre maximum de participants
                </label>
                <input
                  type="number"
                  value={eventData.maxAttendees}
                  onChange={(e) => handleInputChange('maxAttendees', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participants actuels
                </label>
                <input
                  type="number"
                  value={eventData.currentAttendees}
                  onChange={(e) => handleInputChange('currentAttendees', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max={eventData.maxAttendees}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de l'événement
                </label>
                <input
                  type="url"
                  value={eventData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="URL de l'image"
                />
                {eventData.image && (
                  <div className="mt-2">
                    <img
                      src={eventData.image}
                      alt="Aperçu"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Event Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Résumé de l'événement</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Catégorie:</span>
                    <span className="font-medium">{eventData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut:</span>
                    <span className="font-medium">{eventData.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-medium">{eventData.currentAttendees}/{eventData.maxAttendees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taux de remplissage:</span>
                    <span className="font-medium">{Math.round((eventData.currentAttendees / eventData.maxAttendees) * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};