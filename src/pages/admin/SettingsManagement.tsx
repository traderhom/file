import React, { useState } from 'react';
import { Save, Globe, Mail, Shield, Database, Bell, Palette, Upload, X, Eye, Image as ImageIcon } from 'lucide-react';

export const SettingsManagement: React.FC = () => {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'École Supérieure des Sciences et Technologies',
    siteDescription: 'Formation d\'excellence en sciences et technologies',
    siteUrl: 'https://esst.edu',
    adminEmail: 'admin@esst.edu',
    timezone: 'Europe/Paris',
    language: 'fr',
    
    // Email Settings
    smtpHost: 'smtp.esst.edu',
    smtpPort: '587',
    smtpUsername: 'noreply@esst.edu',
    smtpPassword: '',
    emailFromName: 'ESST',
    emailFromAddress: 'noreply@esst.edu',
    
    // Security Settings
    enableTwoFactor: true,
    sessionTimeout: '30',
    passwordMinLength: '8',
    enableCaptcha: true,
    maxLoginAttempts: '5',
    
    // Notification Settings
    enableEmailNotifications: true,
    enablePushNotifications: false,
    notifyNewUsers: true,
    notifyNewContent: true,
    notifySystemUpdates: true,
    
    // Appearance Settings
    primaryColor: '#1A4B8C',
    secondaryColor: '#FFD700',
    logoUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200',
    faviconUrl: '',
    customCSS: '',
    headerBackgroundImage: '',
    footerBackgroundImage: '',
    loginBackgroundImage: ''
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<{[key: string]: string}>({});
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (field: string, file: File) => {
    setUploadingImage(field);
    
    try {
      // Simulate image upload - in real app, this would upload to your server/CDN
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setImagePreview(prev => ({ ...prev, [field]: imageUrl }));
        handleInputChange(field, imageUrl);
        setUploadingImage(null);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadingImage(null);
    }
  };

  const handleImageUrlChange = (field: string, url: string) => {
    handleInputChange(field, url);
    if (url) {
      setImagePreview(prev => ({ ...prev, [field]: url }));
    } else {
      setImagePreview(prev => {
        const newPreview = { ...prev };
        delete newPreview[field];
        return newPreview;
      });
    }
  };

  const removeImage = (field: string) => {
    handleInputChange(field, '');
    setImagePreview(prev => {
      const newPreview = { ...prev };
      delete newPreview[field];
      return newPreview;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage('Paramètres sauvegardés avec succès !');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Globe },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'database', label: 'Base de données', icon: Database }
  ];

  const ImageUploadField = ({ 
    field, 
    label, 
    description, 
    currentValue, 
    aspectRatio = 'aspect-video',
    maxWidth = 'max-w-md'
  }: {
    field: string;
    label: string;
    description: string;
    currentValue: string;
    aspectRatio?: string;
    maxWidth?: string;
  }) => {
    const previewUrl = imagePreview[field] || currentValue;
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
          <p className="text-xs text-gray-500 mb-3">{description}</p>
        </div>

        {/* URL Input */}
        <div className="flex items-center space-x-3">
          <input
            type="url"
            value={currentValue}
            onChange={(e) => handleImageUrlChange(field, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(field, file);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploadingImage === field}
            />
            <button
              type="button"
              disabled={uploadingImage === field}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {uploadingImage === field ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Télécharger
            </button>
          </div>
        </div>

        {/* Image Preview */}
        {previewUrl && (
          <div className={`relative ${maxWidth}`}>
            <div className={`${aspectRatio} bg-gray-100 rounded-lg overflow-hidden border border-gray-200`}>
              <img
                src={previewUrl}
                alt={`Aperçu ${label}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="absolute top-2 right-2 flex space-x-1">
              <button
                onClick={() => window.open(previewUrl, '_blank')}
                className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-colors"
                title="Voir en grand"
              >
                <Eye className="h-3 w-3" />
              </button>
              <button
                onClick={() => removeImage(field)}
                className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-colors"
                title="Supprimer"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Placeholder when no image */}
        {!previewUrl && (
          <div className={`${aspectRatio} ${maxWidth} bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center`}>
            <div className="text-center">
              <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Aucune image</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Paramètres du Système</h1>
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

      <div className="bg-white rounded-lg border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Paramètres Généraux</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du site
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL du site
                  </label>
                  <input
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email administrateur
                  </label>
                  <input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuseau horaire
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Europe/Paris">Europe/Paris</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="America/New_York">America/New_York</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description du site
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configuration Email</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serveur SMTP
                  </label>
                  <input
                    type="text"
                    value={settings.smtpHost}
                    onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Port SMTP
                  </label>
                  <input
                    type="text"
                    value={settings.smtpPort}
                    onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom d'utilisateur SMTP
                  </label>
                  <input
                    type="text"
                    value={settings.smtpUsername}
                    onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe SMTP
                  </label>
                  <input
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'expéditeur
                  </label>
                  <input
                    type="text"
                    value={settings.emailFromName}
                    onChange={(e) => handleInputChange('emailFromName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de l'expéditeur
                  </label>
                  <input
                    type="email"
                    value={settings.emailFromAddress}
                    onChange={(e) => handleInputChange('emailFromAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Paramètres de Sécurité</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Authentification à deux facteurs</h4>
                    <p className="text-sm text-gray-500">Activer l'authentification à deux facteurs pour tous les utilisateurs</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableTwoFactor}
                    onChange={(e) => handleInputChange('enableTwoFactor', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Captcha</h4>
                    <p className="text-sm text-gray-500">Activer le captcha pour les formulaires de connexion</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableCaptcha}
                    onChange={(e) => handleInputChange('enableCaptcha', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeout de session (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longueur minimale du mot de passe
                  </label>
                  <input
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleInputChange('passwordMinLength', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tentatives de connexion max
                  </label>
                  <input
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleInputChange('maxLoginAttempts', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Paramètres de Notifications</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Notifications par email</h4>
                    <p className="text-sm text-gray-500">Activer les notifications par email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableEmailNotifications}
                    onChange={(e) => handleInputChange('enableEmailNotifications', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Notifications push</h4>
                    <p className="text-sm text-gray-500">Activer les notifications push dans le navigateur</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enablePushNotifications}
                    onChange={(e) => handleInputChange('enablePushNotifications', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Nouveaux utilisateurs</h4>
                    <p className="text-sm text-gray-500">Notifier lors de l'inscription de nouveaux utilisateurs</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyNewUsers}
                    onChange={(e) => handleInputChange('notifyNewUsers', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Nouveau contenu</h4>
                    <p className="text-sm text-gray-500">Notifier lors de la publication de nouveau contenu</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyNewContent}
                    onChange={(e) => handleInputChange('notifyNewContent', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-8">
              <h3 className="text-lg font-semibold text-gray-900">Apparence et Branding</h3>
              
              {/* Colors Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Couleurs du thème</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Couleur primaire
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Couleur secondaire
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.secondaryColor}
                        onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo and Branding */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-6">Logo et identité visuelle</h4>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <ImageUploadField
                    field="logoUrl"
                    label="Logo principal"
                    description="Logo affiché dans la navigation et l'en-tête (recommandé: 200x60px, format PNG/SVG)"
                    currentValue={settings.logoUrl}
                    aspectRatio="aspect-[10/3]"
                    maxWidth="max-w-xs"
                  />
                  
                  <ImageUploadField
                    field="faviconUrl"
                    label="Favicon"
                    description="Icône affichée dans l'onglet du navigateur (recommandé: 32x32px, format ICO/PNG)"
                    currentValue={settings.faviconUrl}
                    aspectRatio="aspect-square"
                    maxWidth="max-w-[80px]"
                  />
                </div>
              </div>

              {/* Background Images */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-6">Images de fond</h4>
                
                <div className="space-y-8">
                  <ImageUploadField
                    field="headerBackgroundImage"
                    label="Image de fond de l'en-tête"
                    description="Image de fond pour la section hero de la page d'accueil (recommandé: 1920x600px)"
                    currentValue={settings.headerBackgroundImage}
                    aspectRatio="aspect-[16/5]"
                  />
                  
                  <ImageUploadField
                    field="loginBackgroundImage"
                    label="Image de fond de connexion"
                    description="Image de fond pour la page de connexion (recommandé: 1920x1080px)"
                    currentValue={settings.loginBackgroundImage}
                    aspectRatio="aspect-video"
                  />
                  
                  <ImageUploadField
                    field="footerBackgroundImage"
                    label="Image de fond du pied de page"
                    description="Image de fond pour le pied de page (recommandé: 1920x400px)"
                    currentValue={settings.footerBackgroundImage}
                    aspectRatio="aspect-[24/5]"
                  />
                </div>
              </div>

              {/* Custom CSS */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">CSS personnalisé</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Styles CSS additionnels
                  </label>
                  <textarea
                    value={settings.customCSS}
                    onChange={(e) => handleInputChange('customCSS', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="/* Votre CSS personnalisé ici */
.custom-header {
  background: linear-gradient(45deg, #1A4B8C, #FFD700);
}

.custom-button {
  border-radius: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Ajoutez vos styles CSS personnalisés pour modifier l'apparence du site.
                  </p>
                </div>
              </div>

              {/* Preview Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Aperçu des couleurs</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div 
                      className="w-full h-16 rounded-lg mb-2 border border-gray-200"
                      style={{ backgroundColor: settings.primaryColor }}
                    ></div>
                    <p className="text-xs text-gray-600">Couleur primaire</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-full h-16 rounded-lg mb-2 border border-gray-200"
                      style={{ backgroundColor: settings.secondaryColor }}
                    ></div>
                    <p className="text-xs text-gray-600">Couleur secondaire</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-full h-16 rounded-lg mb-2 border border-gray-200 flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: settings.primaryColor }}
                    >
                      Bouton
                    </div>
                    <p className="text-xs text-gray-600">Bouton principal</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-full h-16 rounded-lg mb-2 border-2 flex items-center justify-center font-medium"
                      style={{ 
                        borderColor: settings.primaryColor,
                        color: settings.primaryColor
                      }}
                    >
                      Bouton
                    </div>
                    <p className="text-xs text-gray-600">Bouton secondaire</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Base de Données</h3>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Attention :</strong> Les opérations sur la base de données peuvent affecter le fonctionnement du site. 
                  Assurez-vous d'avoir une sauvegarde récente avant de procéder.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Sauvegarde</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Créer une sauvegarde complète de la base de données.
                  </p>
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Créer une sauvegarde
                  </button>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Optimisation</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Optimiser les tables de la base de données pour améliorer les performances.
                  </p>
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Optimiser la base
                  </button>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Nettoyage</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Supprimer les données temporaires et les fichiers inutiles.
                  </p>
                  <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    Nettoyer
                  </button>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Restauration</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Restaurer la base de données à partir d'une sauvegarde.
                  </p>
                  <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Restaurer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};