import React, { useState, useEffect } from 'react';
import { Save, Eye, ArrowLeft, Image, Link as LinkIcon, Bold, Italic, List, AlignLeft } from 'lucide-react';

interface PageData {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  status: 'published' | 'draft' | 'review';
  author: string;
  lastModified: string;
  publishDate?: string;
  featuredImage?: string;
  seoTitle?: string;
}

interface PageEditorProps {
  pageId?: string;
  onSave: (pageData: PageData) => void;
  onCancel: () => void;
  initialData?: PageData;
}

export const PageEditor: React.FC<PageEditorProps> = ({
  pageId,
  onSave,
  onCancel,
  initialData
}) => {
  const [pageData, setPageData] = useState<PageData>({
    id: pageId || '',
    title: '',
    slug: '',
    content: '',
    metaDescription: '',
    status: 'draft',
    author: 'Admin',
    lastModified: new Date().toLocaleDateString('fr-FR'),
    seoTitle: '',
    featuredImage: ''
  });

  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setPageData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof PageData, value: string) => {
    setPageData(prev => ({
      ...prev,
      [field]: value,
      lastModified: new Date().toLocaleDateString('fr-FR')
    }));

    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setPageData(prev => ({ ...prev, slug }));
    }
  };

  const handleSave = async (status?: 'published' | 'draft' | 'review') => {
    setIsSaving(true);
    try {
      const dataToSave = {
        ...pageData,
        status: status || pageData.status,
        lastModified: new Date().toLocaleDateString('fr-FR')
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(dataToSave);
      setSaveMessage('Page sauvegardée avec succès !');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const insertTextAtCursor = (textToInsert: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + textToInsert + after;
      
      setPageData(prev => ({ ...prev, content: newText }));
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
      }, 0);
    }
  };

  const formatText = (format: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      
      let formattedText = '';
      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'h1':
          formattedText = `# ${selectedText}`;
          break;
        case 'h2':
          formattedText = `## ${selectedText}`;
          break;
        case 'h3':
          formattedText = `### ${selectedText}`;
          break;
        case 'list':
          formattedText = `- ${selectedText}`;
          break;
        case 'link':
          formattedText = `[${selectedText}](url)`;
          break;
        default:
          formattedText = selectedText;
      }
      
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + formattedText + after;
      
      setPageData(prev => ({ ...prev, content: newText }));
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
              {pageId ? 'Modifier la page' : 'Nouvelle page'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {saveMessage && (
              <span className="text-sm text-green-600 font-medium">
                {saveMessage}
              </span>
            )}
            
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreview ? 'Éditer' : 'Aperçu'}
            </button>
            
            <button
              onClick={() => handleSave('draft')}
              disabled={isSaving}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Sauvegarde...' : 'Brouillon'}
            </button>
            
            <button
              onClick={() => handleSave('published')}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Publication...' : 'Publier'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {!isPreview ? (
                <div className="p-6">
                  {/* Title */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre de la page
                    </label>
                    <input
                      type="text"
                      value={pageData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Entrez le titre de la page"
                    />
                  </div>

                  {/* Slug */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL (slug)
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        /pages/
                      </span>
                      <input
                        type="text"
                        value={pageData.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="url-de-la-page"
                      />
                    </div>
                  </div>

                  {/* Content Editor Toolbar */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenu
                    </label>
                    <div className="border border-gray-300 rounded-lg">
                      <div className="flex items-center space-x-2 p-3 border-b border-gray-200 bg-gray-50">
                        <button
                          onClick={() => formatText('bold')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Gras"
                        >
                          <Bold className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => formatText('italic')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Italique"
                        >
                          <Italic className="h-4 w-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-300"></div>
                        <button
                          onClick={() => formatText('h1')}
                          className="px-3 py-2 hover:bg-gray-200 rounded transition-colors text-sm font-medium"
                          title="Titre 1"
                        >
                          H1
                        </button>
                        <button
                          onClick={() => formatText('h2')}
                          className="px-3 py-2 hover:bg-gray-200 rounded transition-colors text-sm font-medium"
                          title="Titre 2"
                        >
                          H2
                        </button>
                        <button
                          onClick={() => formatText('h3')}
                          className="px-3 py-2 hover:bg-gray-200 rounded transition-colors text-sm font-medium"
                          title="Titre 3"
                        >
                          H3
                        </button>
                        <div className="w-px h-6 bg-gray-300"></div>
                        <button
                          onClick={() => formatText('list')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Liste"
                        >
                          <List className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => formatText('link')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Lien"
                        >
                          <LinkIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => insertTextAtCursor('![Alt text](image-url)')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Image"
                        >
                          <Image className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <textarea
                        id="content-editor"
                        value={pageData.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        className="w-full h-96 p-4 border-0 resize-none focus:ring-0 focus:outline-none"
                        placeholder="Rédigez le contenu de votre page ici... Vous pouvez utiliser Markdown."
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Vous pouvez utiliser Markdown pour formater votre texte. Utilisez la barre d'outils ci-dessus pour insérer des éléments.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">{pageData.title}</h1>
                  <div className="prose max-w-none">
                    {pageData.content.split('\n').map((paragraph, index) => {
                      if (paragraph.startsWith('# ')) {
                        return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{paragraph.slice(2)}</h1>;
                      } else if (paragraph.startsWith('## ')) {
                        return <h2 key={index} className="text-xl font-bold mt-5 mb-3">{paragraph.slice(3)}</h2>;
                      } else if (paragraph.startsWith('### ')) {
                        return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{paragraph.slice(4)}</h3>;
                      } else if (paragraph.startsWith('- ')) {
                        return <li key={index} className="ml-4">{paragraph.slice(2)}</li>;
                      } else if (paragraph.trim()) {
                        return <p key={index} className="mb-4">{paragraph}</p>;
                      }
                      return <br key={index} />;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publication Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publication</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={pageData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="review">En révision</option>
                    <option value="published">Publié</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auteur
                  </label>
                  <input
                    type="text"
                    value={pageData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de publication
                  </label>
                  <input
                    type="date"
                    value={pageData.publishDate || ''}
                    onChange={(e) => handleInputChange('publishDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre SEO
                  </label>
                  <input
                    type="text"
                    value={pageData.seoTitle || ''}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Titre pour les moteurs de recherche"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(pageData.seoTitle || pageData.title).length}/60 caractères
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={pageData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Description pour les moteurs de recherche"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {pageData.metaDescription.length}/160 caractères
                  </p>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Image mise en avant</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de l'image
                  </label>
                  <input
                    type="url"
                    value={pageData.featuredImage || ''}
                    onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                {pageData.featuredImage && (
                  <div className="mt-2">
                    <img
                      src={pageData.featuredImage}
                      alt="Aperçu"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Page Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Dernière modification:</span>
                  <span>{pageData.lastModified}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mots:</span>
                  <span>{pageData.content.split(/\s+/).filter(word => word.length > 0).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Caractères:</span>
                  <span>{pageData.content.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};