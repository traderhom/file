import React, { useState } from 'react';
import { Search, Upload, Trash2, Download, Eye, Image, Video, FileText, Folder } from 'lucide-react';
import { MediaUploader } from '../../components/admin/MediaUploader';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
  url: string;
  uploadDate: string;
  uploadedBy: string;
  folder: string;
}

export const MediaManagement: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    {
      id: '1',
      name: 'campus-esst-2025.jpg',
      type: 'image',
      size: '2.4 MB',
      url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
      uploadDate: '15/04/2025',
      uploadedBy: 'Admin',
      folder: 'Campus'
    },
    {
      id: '2',
      name: 'laboratoire-ia.jpg',
      type: 'image',
      size: '1.8 MB',
      url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
      uploadDate: '12/04/2025',
      uploadedBy: 'Prof. Dubois',
      folder: 'Laboratoires'
    },
    {
      id: '3',
      name: 'cybersecurity-workshop.mp4',
      type: 'video',
      size: '45.2 MB',
      url: '#',
      uploadDate: '10/04/2025',
      uploadedBy: 'Dr. Martin',
      folder: 'Événements'
    },
    {
      id: '4',
      name: 'brochure-formations-2025.pdf',
      type: 'document',
      size: '3.1 MB',
      url: '#',
      uploadDate: '08/04/2025',
      uploadedBy: 'Admin',
      folder: 'Documents'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [folderFilter, setFolderFilter] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'upload'>('list');

  const folders = ['Campus', 'Laboratoires', 'Événements', 'Documents', 'Formations'];

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

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || file.type === typeFilter;
    const matchesFolder = folderFilter === 'all' || file.folder === folderFilter;
    return matchesSearch && matchesType && matchesFolder;
  });

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id));
    }
  };

  const handleDeleteSelected = () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedFiles.length} fichier(s) ?`)) {
      setMediaFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      setMediaFiles(prev => prev.filter(file => file.id !== fileId));
    }
  };

  const handleUploadFile = () => {
    setCurrentView('upload');
  };

  const handleSaveMedia = (mediaData: MediaFile) => {
    setMediaFiles(prev => [...prev, mediaData]);
    setCurrentView('list');
  };

  const handleCancelUpload = () => {
    setCurrentView('list');
  };

  if (currentView === 'upload') {
    return (
      <MediaUploader
        onSave={handleSaveMedia}
        onCancel={handleCancelUpload}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Gestion des Médias</h1>
        <button 
          onClick={handleUploadFile}
          className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Upload className="h-4 w-4 mr-2" />
          Télécharger des fichiers
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-4 flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700">Filtrer par:</span>
          
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher un fichier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Tous les types</option>
            <option value="image">Images</option>
            <option value="video">Vidéos</option>
            <option value="document">Documents</option>
          </select>
          
          <select 
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Tous les dossiers</option>
            {folders.map(folder => (
              <option key={folder} value={folder}>{folder}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Bar */}
      {selectedFiles.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedFiles.length} fichier(s) sélectionné(s)
            </span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleDeleteSelected}
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Files Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
              onChange={handleSelectAll}
              className="rounded border-gray-300 mr-4"
            />
            <span className="text-sm font-medium text-gray-700">
              {filteredFiles.length} fichier(s)
            </span>
          </div>
        </div>

        {/* Files List */}
        <div className="divide-y divide-gray-200">
          {filteredFiles.map((file) => (
            <div key={file.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => handleSelectFile(file.id)}
                  className="rounded border-gray-300"
                />
                
                <div className="flex-shrink-0">
                  {file.type === 'image' ? (
                    <img 
                      src={file.url} 
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{file.name}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>Téléchargé le {file.uploadDate}</span>
                    <span>•</span>
                    <span>Par {file.uploadedBy}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Folder className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">{file.folder}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {file.type === 'image' && (
                    <button 
                      className="text-blue-600 hover:text-blue-900 p-2" 
                      title="Aperçu"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                  <button 
                    className="text-green-600 hover:text-green-900 p-2" 
                    title="Télécharger"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteFile(file.id)}
                    className="text-red-600 hover:text-red-900 p-2" 
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun fichier trouvé</p>
          </div>
        )}
      </div>

      {/* Storage Info */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stockage</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Utilisé</span>
          <span className="text-sm font-medium">2.1 GB / 10 GB</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '21%' }}></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Il vous reste 7.9 GB d'espace de stockage disponible.
        </p>
      </div>
    </div>
  );
};