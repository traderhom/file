import React, { useState } from 'react';
import { Search, Plus, Edit, Eye, Trash2, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { EventEditor } from '../../components/admin/EventEditor';
import { useEvents } from '../../contexts/EventsContext';

export const EventsManagement: React.FC = () => {
  const { events, updateEvent, createEvent, deleteEvent } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentView, setCurrentView] = useState<'list' | 'edit' | 'create'>('list');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const categories = ['Conférence', 'Workshop', 'Événement', 'Séminaire', 'Formation'];

  const getStatusBadge = (status: string) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      upcoming: 'À venir',
      ongoing: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreateEvent = () => {
    setSelectedEventId(null);
    setCurrentView('create');
  };

  const handleEditEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentView('edit');
  };

  const handleSaveEvent = (eventData: any) => {
    if (selectedEventId) {
      updateEvent(eventData);
    } else {
      createEvent(eventData);
    }
    setCurrentView('list');
    setSelectedEventId(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      deleteEvent(eventId);
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedEventId(null);
  };

  const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : undefined;

  if (currentView === 'edit' || currentView === 'create') {
    return (
      <EventEditor
        eventId={selectedEventId || undefined}
        onSave={handleSaveEvent}
        onCancel={handleCancel}
        initialData={selectedEvent}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Gestion des Événements</h1>
        <button 
          onClick={handleCreateEvent}
          className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Événement
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filtrer par:</span>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="upcoming">À venir</option>
            <option value="ongoing">En cours</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
          
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-6">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(event.status)}
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                      {event.category}
                    </span>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {event.currentAttendees}/{event.maxAttendees} participants
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Organisé par: <span className="font-medium">{event.organizer}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditEvent(event.id)}
                      className="text-blue-600 hover:text-blue-900 p-2" 
                      title="Éditer"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-900 p-2"
                      title="Aperçu"
                      onClick={() => {
                        // TODO: ouvrir une modale ou naviguer vers la page de détail de l'événement
                        alert('Navigation vers la page de détail de l\'événement (fonctionnalité à implémenter)');
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-900 p-2" 
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Progress Bar for Attendees */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Inscriptions</span>
                    <span>{Math.round((event.currentAttendees / event.maxAttendees) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(event.currentAttendees / event.maxAttendees) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun événement trouvé</p>
        </div>
      )}
    </div>
  );
};