import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Settings,
  Users,
  MessageCircle,
  MoreVertical,
  Maximize,
  Minimize,
  X
} from 'lucide-react';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callType: 'audio' | 'video';
  isIncoming?: boolean;
  participant: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  onAccept?: () => void;
  onDecline?: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  callType,
  isIncoming = false,
  participant,
  onAccept,
  onDecline
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');


  // Simulate call connection
  useEffect(() => {
    if (isOpen && !isIncoming) {
      const timer = setTimeout(() => {
        setIsConnected(true);
        setConnectionStatus('connected');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isIncoming]);

  // Handlers for not-yet-implemented buttons
  // TODO: Remplacer par une vraie logique métier (ouvrir modale, afficher chat, etc.)
  const handleNotImplemented = (feature: string) => {
    alert(`Fonctionnalité "${feature}" à implémenter (ouvrir modale, afficher chat, etc.)`);
  };

  // Call duration timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAccept = () => {
    setIsConnected(true);
    setConnectionStatus('connected');
    onAccept?.();
  };

  const handleDecline = () => {
    setConnectionStatus('disconnected');
    onDecline?.();
    onClose();
  };

  const handleEndCall = () => {
    setConnectionStatus('disconnected');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className={`bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'w-full h-full' : 'w-full max-w-4xl h-[600px]'
      }`}>
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
              {participant.avatar}
            </div>
            <div>
              <h3 className="font-semibold">{participant.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                {callType === 'video' ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                <span>
                  {isIncoming && !isConnected ? 'Appel entrant...' :
                   !isConnected ? 'Connexion...' :
                   `${callType === 'video' ? 'Appel vidéo' : 'Appel audio'} - ${formatDuration(callDuration)}`}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Video/Audio Area */}
        <div className="flex-1 bg-gray-900 relative flex items-center justify-center" style={{ height: 'calc(100% - 140px)' }}>
          {callType === 'video' && isVideoEnabled ? (
            <div className="relative w-full h-full">
              {/* Remote video (simulated) */}
              <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {participant.avatar}
                  </div>
                  <p className="text-lg font-medium">{participant.name}</p>
                  {!isConnected && (
                    <div className="mt-4">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-300">Connexion en cours...</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Local video (picture-in-picture) */}
              <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {participant.avatar}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Audio call or video disabled
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6">
                {participant.avatar}
              </div>
              <h3 className="text-2xl font-semibold mb-2">{participant.name}</h3>
              <p className="text-gray-300 mb-4">
                {isIncoming && !isConnected ? 'Appel entrant...' :
                 !isConnected ? 'Connexion...' :
                 `En communication - ${formatDuration(callDuration)}`}
              </p>
              
              {!isConnected && !isIncoming && (
                <div className="mt-6">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-300">Connexion en cours...</p>
                </div>
              )}
            </div>
          )}

          {/* Connection status indicator */}
          <div className="absolute top-4 left-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              connectionStatus === 'connected' ? 'bg-green-600 text-white' :
              connectionStatus === 'connecting' ? 'bg-yellow-600 text-white' :
              'bg-red-600 text-white'
            }`}>
              {connectionStatus === 'connected' ? 'Connecté' :
               connectionStatus === 'connecting' ? 'Connexion...' :
               'Déconnecté'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 p-6">
          {isIncoming && !isConnected ? (
            // Incoming call controls
            <div className="flex items-center justify-center space-x-8">
              <button
                onClick={handleDecline}
                className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <PhoneOff className="h-8 w-8" />
              </button>
              <button
                onClick={handleAccept}
                className="w-16 h-16 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <Phone className="h-8 w-8" />
              </button>
            </div>
          ) : (
            // Active call controls
            <div className="flex items-center justify-center space-x-4">
              {/* Mute */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              {/* Video toggle (only for video calls) */}
              {callType === 'video' && (
                <button
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    !isVideoEnabled ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </button>
              )}

              {/* Speaker */}
              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isSpeakerOn ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                {isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </button>


              {/* Chat */}
              <button
                onClick={() => handleNotImplemented('Chat')}
                className="w-12 h-12 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </button>

              {/* Add participants (for group calls) */}
              <button
                onClick={() => handleNotImplemented('Ajouter des participants')}
                className="w-12 h-12 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <Users className="h-5 w-5" />
              </button>

              {/* Settings */}
              <button
                onClick={() => handleNotImplemented('Paramètres')}
                className="w-12 h-12 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>

              {/* More options */}
              <button
                onClick={() => handleNotImplemented('Plus d\'options')}
                className="w-12 h-12 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <MoreVertical className="h-5 w-5" />
              </button>

              {/* End call */}
              <button
                onClick={handleEndCall}
                className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors ml-4"
              >
                <PhoneOff className="h-8 w-8" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};