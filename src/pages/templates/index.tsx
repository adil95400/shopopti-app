import React, { useState, useEffect } from 'react';
import { templateService, Template } from '../../modules/templates';
import { FileText, Plus, Search, Filter, Edit, Trash2, Copy, Eye, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  
  useEffect(() => {
    fetchTemplates();
  }, [typeFilter]);
  
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      
      const filters: any = {};
      if (typeFilter) {
        filters.type = typeFilter;
      }
      
      const fetchedTemplates = await templateService.getTemplates(filters);
      setTemplates(fetchedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDuplicateTemplate = async (template: Template) => {
    try {
      const newTemplate = await templateService.createTemplate({
        name: `${template.name} (Copy)`,
        description: template.description,
        type: template.type,
        content: template.content,
        thumbnail: template.thumbnail,
        tags: template.tags,
        isPublic: false,
        createdBy: template.createdBy
      });
      
      setTemplates([newTemplate, ...templates]);
      toast.success('Template duplicated successfully');
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast.error('Failed to duplicate template');
    }
  };
  
  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return;
    }
    
    try {
      await templateService.deleteTemplate(id);
      setTemplates(templates.filter(template => template.id !== id));
      
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null);
        setPreviewMode(false);
      }
      
      toast.success('Template deleted successfully');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };
  
  const handleGenerateWithAI = async () => {
    try {
      setLoading(true);
      
      const newTemplate = await templateService.generateTemplateWithAI({
        type: 'product',
        name: 'AI Generated Product Template',
        description: 'Automatically generated product template using AI',
        product: {
          title: 'Premium Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation and long battery life.',
          price: 99.99,
          features: ['Noise cancellation', 'Bluetooth 5.0', '30-hour battery life', 'Comfortable fit'],
          images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300']
        },
        style: 'modern',
        tone: 'professional'
      });
      
      setTemplates([newTemplate, ...templates]);
      setSelectedTemplate(newTemplate);
      setPreviewMode(true);
      
      toast.success('AI template generated successfully');
    } catch (error) {
      console.error('Error generating template with AI:', error);
      toast.error('Failed to generate template with AI');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });
  
  const getTemplateTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <ShoppingBag className="h-5 w-5" />;
      case 'landing':
        return <Layout className="h-5 w-5" />;
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'blog':
        return <FileText className="h-5 w-5" />;
      case 'social':
        return <Share2 className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Template Builder</h1>
          <p className="text-gray-600">Create and manage templates for your products and pages</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleGenerateWithAI}>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate with AI
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="product">Product</option>
            <option value="landing">Landing Page</option>
            <option value="email">Email</option>
            <option value="blog">Blog</option>
            <option value="social">Social Media</option>
          </select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium">Templates</h3>
          </div>
          
          <div className="overflow-y-auto max-h-[600px]">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center p-6 text-gray-500">
                <FileText className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No templates found</h3>
                <p className="text-sm">
                  {searchTerm || typeFilter
                    ? 'No templates match your search criteria'
                    : 'Create your first template to get started'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedTemplate?.id === template.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      setSelectedTemplate(template);
                      setPreviewMode(false);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-md ${
                          template.type === 'product' ? 'bg-blue-100 text-blue-600' :
                          template.type === 'landing' ? 'bg-purple-100 text-purple-600' :
                          template.type === 'email' ? 'bg-green-100 text-green-600' :
                          template.type === 'blog' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {getTemplateTypeIcon(template.type)}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-gray-900">{template.name}</h4>
                          <p className="text-xs text-gray-500 mt-1 capitalize">{template.type}</p>
                        </div>
                      </div>
                    </div>
                    
                    {template.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{template.description}</p>
                    )}
                    
                    {template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            +{template.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {selectedTemplate ? (
            <>
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{selectedTemplate.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{selectedTemplate.type} Template</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
                    {previewMode ? (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDuplicateTemplate(selectedTemplate)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteTemplate(selectedTemplate.id!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>
                {selectedTemplate.description && (
                  <p className="text-sm text-gray-600 mt-2">{selectedTemplate.description}</p>
                )}
              </div>
              
              <div className="flex-1 overflow-hidden">
                {previewMode ? (
                  <div className="h-[500px] overflow-y-auto border-4 border-blue-200 rounded m-4">
                    <div dangerouslySetInnerHTML={{ __html: selectedTemplate.content }} />
                  </div>
                ) : (
                  <div className="p-4">
                    <textarea
                      className="w-full h-[500px] font-mono text-sm p-4 border border-gray-300 rounded-md"
                      value={selectedTemplate.content}
                      readOnly
                    />
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Created by: {selectedTemplate.createdBy} • Last updated: {selectedTemplate.updatedAt?.toLocaleDateString()}
                </div>
                <Button>
                  Use Template
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
              <FileText className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No template selected</h3>
              <p className="mb-4">Select a template from the list to view or edit</p>
              <div className="flex space-x-2">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
                <Button variant="outline" onClick={handleGenerateWithAI}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate with AI
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;