import React, { useState } from 'react';
import { Save, ArrowLeft, Upload, Folder, Image, Video, FileText } from 'lucide-react';

interface MediaData {
  id?: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
  url: string;
  uploadDate: string;
  uploadedBy: string;
  folder: string;
}

interface MediaUploaderProps {
  onSave: (mediaData: MediaData) => void;
  onCancel: () => void;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onSave,
  onCancel
}) => {
  const [mediaData, setMediaData] = useState<MediaData>({
    name: '',
    type: 'image',
    size: '',
    url: '',
    uploadDate: new Date().toLocaleDateString('fr-FR'),
    uploadedBy: 'Admin',
    folder: 'Documents'
  });

  const [isSaving, setIsSaving] = useState(false);

  const folders = ['Campus', 'Laboratoires', 'Événements', 'Documents', 'Formations'];

  const handleInputChange = (field: keyof MediaData, value: string) => {
    setMediaData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSave = {
        ...mediaData,
        id: Date.now().toString()
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(dataToSave);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-8 w-8 text-blue-500" />;
      case 'video':
        return <Video className="h-8 w-8 text-purple-500" />;
      case 'document':
        return <FileText className="h-8 w-8 text-red-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
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
              Télécharger un fichier
            </h1>
          </div>
          
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

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-8">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Télécharger un fichier
            </h3>
            <p className="text-gray-600 mb-4">
              Glissez-déposez votre fichier ici ou cliquez pour sélectionner
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Choisir un fichier
            </button>
          </div>

          {/* File Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du fichier
              </label>
              <input
                type="text"
                value={mediaData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nom du fichier"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL du fichier
              </label>
              <input
                type="url"
                value={mediaData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/fichier.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de fichier
                </label>
                <select
                  value={mediaData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="image">Image</option>
                  <option value="video">Vidéo</option>
                  <option value="document">Document</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dossier
                </label>
                <select
                  value={mediaData.folder}
                  onChange={(e) => handleInputChange('folder', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {folders.map(folder => (
                    <option key={folder} value={folder}>{folder}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taille du fichier
              </label>
              <input
                type="text"
                value={mediaData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ex: 2.4 MB"
              />
            </div>

            {/* Preview */}
            {mediaData.url && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Aperçu</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {mediaData.type === 'image' ? (
                      <img 
                        src={mediaData.url} 
                        alt={mediaData.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getFileIcon(mediaData.type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{mediaData.name || 'Nom du fichier'}</p>
                    <p className="text-sm text-gray-500">{mediaData.size}</p>
                    <p className="text-sm text-gray-500">{mediaData.folder}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};