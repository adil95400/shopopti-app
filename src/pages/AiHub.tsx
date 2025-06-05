import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import ProductOptimizer from '../components/ai/ProductOptimizer';
import AiAssistant from '../components/ai/AiAssistant';
import CompetitorAnalysis from '../components/ai/CompetitorAnalysis';
import { Sparkles, Bot, Search, TrendingUp, FileText } from 'lucide-react';

const AiHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('assistant');
  
  // Sample product for the ProductOptimizer component
  const sampleProduct = {
    title: 'Wireless Bluetooth Earbuds',
    description: 'High-quality wireless earbuds with noise cancellation and long battery life.',
    price: 59.99,
    category: 'Electronics',
    tags: ['wireless', 'bluetooth', 'earbuds', 'audio']
  };

  const handleProductOptimize = (optimizedProduct: any) => {
    console.log('Optimized product:', optimizedProduct);
    // In a real app, you would save the optimized product to your database
    alert('Product optimized successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Hub</h1>
        <p className="text-gray-600">
          Leverage artificial intelligence to optimize your e-commerce business.
        </p>
      </div>

      <Tabs defaultValue="assistant" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="assistant" className="flex items-center">
            <Bot className="h-4 w-4 mr-2" />
            <span>AI Assistant</span>
          </TabsTrigger>
          <TabsTrigger value="optimizer" className="flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            <span>Product Optimizer</span>
          </TabsTrigger>
          <TabsTrigger value="competitor" className="flex items-center">
            <Search className="h-4 w-4 mr-2" />
            <span>Competitor Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            <span>Content Generator</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assistant">
          <AiAssistant initialContext="I'm your e-commerce AI assistant. I can help you with product research, optimization, marketing strategies, and more. What would you like help with today?" />
        </TabsContent>
        
        <TabsContent value="optimizer">
          <ProductOptimizer product={sampleProduct} onOptimize={handleProductOptimize} />
        </TabsContent>
        
        <TabsContent value="competitor">
          <CompetitorAnalysis />
        </TabsContent>
        
        <TabsContent value="content">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium mb-4">AI Content Generator</h3>
            
            <div className="mb-6">
              <p className="text-gray-600">
                Generate high-quality content for your product descriptions, blog posts, social media, and more.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="product_description">Product Description</option>
                  <option value="blog_post">Blog Post</option>
                  <option value="social_media">Social Media Post</option>
                  <option value="email">Marketing Email</option>
                  <option value="seo_meta">SEO Meta Description</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic/Keywords</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., wireless earbuds, noise cancellation, long battery life"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="informative">Informative</option>
                  <option value="persuasive">Persuasive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="short">Short (50-100 words)</option>
                  <option value="medium">Medium (100-300 words)</option>
                  <option value="long">Long (300-500 words)</option>
                  <option value="very_long">Very Long (500+ words)</option>
                </select>
              </div>
              
              <Button className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiHub;