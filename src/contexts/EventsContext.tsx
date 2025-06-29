import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Event {
  id: string;
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

interface EventsContextType {
  events: Event[];
  getUpcomingEvents: () => Event[];
  updateEvent: (eventData: Event) => void;
  createEvent: (eventData: Event) => void;
  deleteEvent: (eventId: string) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

interface EventsProviderProps {
  children: ReactNode;
}

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Conférence Internationale IA & Santé',
      description: 'Une conférence majeure sur l\'application de l\'IA dans le domaine médical',
      date: '15/05/2025',
      time: '14:00',
      location: 'Campus ESST - Amphithéâtre principal',
      category: 'Conférence',
      status: 'upcoming',
      maxAttendees: 300,
      currentAttendees: 245,
      organizer: 'Prof. Marie Dubois',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg'
    },
    {
      id: '2',
      title: 'Workshop Cybersécurité Industrielle',
      description: 'Atelier pratique sur la sécurisation des systèmes industriels',
      date: '08/06/2025',
      time: '09:00',
      location: 'Laboratoire de Cybersécurité',
      category: 'Workshop',
      status: 'upcoming',
      maxAttendees: 50,
      currentAttendees: 32,
      organizer: 'Dr. Jean Martin',
      image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg'
    },
    {
      id: '3',
      title: 'Journée Portes Ouvertes Recherche',
      description: 'Découverte des laboratoires et projets de recherche de l\'ESST',
      date: '22/06/2025',
      time: '10:00',
      location: 'Tous les laboratoires',
      category: 'Événement',
      status: 'upcoming',
      maxAttendees: 500,
      currentAttendees: 156,
      organizer: 'Direction de la Recherche',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'
    }
  ]);

  const getUpcomingEvents = () => {
    return events.filter(event => event.status === 'upcoming');
  };

  const updateEvent = (eventData: Event) => {
    setEvents(prev => prev.map(event => 
      event.id === eventData.id ? eventData : event
    ));
  };

  const createEvent = (eventData: Event) => {
    setEvents(prev => [...prev, eventData]);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return (
    <EventsContext.Provider value={{
      events,
      getUpcomingEvents,
      updateEvent,
      createEvent,
      deleteEvent
    }}>
      {children}
    </EventsContext.Provider>
  );
};