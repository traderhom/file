import React, { useState } from 'react';
import { X, Heart, Smile, ThumbsUp, Star, Coffee, Siren as Fire, Zap, Music, Camera } from 'lucide-react';

interface StickerPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onStickerSelect: (sticker: Sticker) => void;
}

interface Sticker {
  id: string;
  emoji: string;
  name: string;
  category: string;
}

export const StickerPicker: React.FC<StickerPickerProps> = ({
  isOpen,
  onClose,
  onStickerSelect
}) => {
  const [activeCategory, setActiveCategory] = useState('emotions');

  const stickerCategories = [
    { id: 'emotions', name: 'Émotions', icon: Smile },
    { id: 'reactions', name: 'Réactions', icon: ThumbsUp },
    { id: 'objects', name: 'Objets', icon: Coffee },
    { id: 'activities', name: 'Activités', icon: Music },
    { id: 'symbols', name: 'Symboles', icon: Star }
  ];

  const stickers: { [key: string]: Sticker[] } = {
    emotions: [
      { id: 'happy', emoji: '😊', name: 'Heureux', category: 'emotions' },
      { id: 'love', emoji: '😍', name: 'Amoureux', category: 'emotions' },
      { id: 'laugh', emoji: '😂', name: 'Rire', category: 'emotions' },
      { id: 'wink', emoji: '😉', name: 'Clin d\'œil', category: 'emotions' },
      { id: 'cool', emoji: '😎', name: 'Cool', category: 'emotions' },
      { id: 'thinking', emoji: '🤔', name: 'Réfléchir', category: 'emotions' },
      { id: 'surprised', emoji: '😮', name: 'Surpris', category: 'emotions' },
      { id: 'sad', emoji: '😢', name: 'Triste', category: 'emotions' },
      { id: 'angry', emoji: '😠', name: 'Fâché', category: 'emotions' },
      { id: 'sleepy', emoji: '😴', name: 'Endormi', category: 'emotions' },
      { id: 'sick', emoji: '🤒', name: 'Malade', category: 'emotions' },
      { id: 'crazy', emoji: '🤪', name: 'Fou', category: 'emotions' }
    ],
    reactions: [
      { id: 'thumbs-up', emoji: '👍', name: 'Pouce en l\'air', category: 'reactions' },
      { id: 'thumbs-down', emoji: '👎', name: 'Pouce en bas', category: 'reactions' },
      { id: 'clap', emoji: '👏', name: 'Applaudir', category: 'reactions' },
      { id: 'ok', emoji: '👌', name: 'OK', category: 'reactions' },
      { id: 'peace', emoji: '✌️', name: 'Paix', category: 'reactions' },
      { id: 'fist', emoji: '✊', name: 'Poing', category: 'reactions' },
      { id: 'wave', emoji: '👋', name: 'Saluer', category: 'reactions' },
      { id: 'pray', emoji: '🙏', name: 'Prier', category: 'reactions' },
      { id: 'muscle', emoji: '💪', name: 'Muscle', category: 'reactions' },
      { id: 'point', emoji: '👉', name: 'Pointer', category: 'reactions' },
      { id: 'shrug', emoji: '🤷', name: 'Hausser les épaules', category: 'reactions' },
      { id: 'facepalm', emoji: '🤦', name: 'Facepalm', category: 'reactions' }
    ],
    objects: [
      { id: 'coffee', emoji: '☕', name: 'Café', category: 'objects' },
      { id: 'pizza', emoji: '🍕', name: 'Pizza', category: 'objects' },
      { id: 'burger', emoji: '🍔', name: 'Burger', category: 'objects' },
      { id: 'cake', emoji: '🎂', name: 'Gâteau', category: 'objects' },
      { id: 'beer', emoji: '🍺', name: 'Bière', category: 'objects' },
      { id: 'wine', emoji: '🍷', name: 'Vin', category: 'objects' },
      { id: 'laptop', emoji: '💻', name: 'Ordinateur', category: 'objects' },
      { id: 'phone', emoji: '📱', name: 'Téléphone', category: 'objects' },
      { id: 'book', emoji: '📚', name: 'Livre', category: 'objects' },
      { id: 'pen', emoji: '✏️', name: 'Stylo', category: 'objects' },
      { id: 'money', emoji: '💰', name: 'Argent', category: 'objects' },
      { id: 'gift', emoji: '🎁', name: 'Cadeau', category: 'objects' }
    ],
    activities: [
      { id: 'music', emoji: '🎵', name: 'Musique', category: 'activities' },
      { id: 'dance', emoji: '💃', name: 'Danse', category: 'activities' },
      { id: 'sport', emoji: '⚽', name: 'Sport', category: 'activities' },
      { id: 'game', emoji: '🎮', name: 'Jeu', category: 'activities' },
      { id: 'movie', emoji: '🎬', name: 'Film', category: 'activities' },
      { id: 'travel', emoji: '✈️', name: 'Voyage', category: 'activities' },
      { id: 'study', emoji: '📖', name: 'Étudier', category: 'activities' },
      { id: 'work', emoji: '💼', name: 'Travail', category: 'activities' },
      { id: 'sleep', emoji: '🛌', name: 'Dormir', category: 'activities' },
      { id: 'run', emoji: '🏃', name: 'Courir', category: 'activities' },
      { id: 'swim', emoji: '🏊', name: 'Nager', category: 'activities' },
      { id: 'bike', emoji: '🚴', name: 'Vélo', category: 'activities' }
    ],
    symbols: [
      { id: 'heart', emoji: '❤️', name: 'Cœur', category: 'symbols' },
      { id: 'star', emoji: '⭐', name: 'Étoile', category: 'symbols' },
      { id: 'fire', emoji: '🔥', name: 'Feu', category: 'symbols' },
      { id: 'lightning', emoji: '⚡', name: 'Éclair', category: 'symbols' },
      { id: 'sun', emoji: '☀️', name: 'Soleil', category: 'symbols' },
      { id: 'moon', emoji: '🌙', name: 'Lune', category: 'symbols' },
      { id: 'rainbow', emoji: '🌈', name: 'Arc-en-ciel', category: 'symbols' },
      { id: 'diamond', emoji: '💎', name: 'Diamant', category: 'symbols' },
      { id: 'crown', emoji: '👑', name: 'Couronne', category: 'symbols' },
      { id: 'trophy', emoji: '🏆', name: 'Trophée', category: 'symbols' },
      { id: 'medal', emoji: '🏅', name: 'Médaille', category: 'symbols' },
      { id: 'check', emoji: '✅', name: 'Validé', category: 'symbols' }
    ]
  };

  const handleStickerClick = (sticker: Sticker) => {
    onStickerSelect(sticker);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-16 left-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Stickers</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Categories */}
      <div className="flex border-b border-gray-200">
        {stickerCategories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-1 p-3 text-center transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              title={category.name}
            >
              <Icon className="h-4 w-4 mx-auto" />
            </button>
          );
        })}
      </div>

      {/* Stickers Grid */}
      <div className="p-3 max-h-64 overflow-y-auto">
        <div className="grid grid-cols-6 gap-2">
          {stickers[activeCategory]?.map((sticker) => (
            <button
              key={sticker.id}
              onClick={() => handleStickerClick(sticker)}
              className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-gray-100 rounded-lg transition-colors"
              title={sticker.name}
            >
              {sticker.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Recently Used */}
      <div className="border-t border-gray-200 p-3">
        <h4 className="text-xs font-medium text-gray-500 mb-2">Récemment utilisés</h4>
        <div className="flex space-x-1">
          {['😊', '👍', '❤️', '🔥', '😂'].map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleStickerClick({
                id: `recent-${index}`,
                emoji,
                name: 'Récent',
                category: 'recent'
              })}
              className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};