import React, { useState } from 'react';
import { FileText, Sparkles, Loader2, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

interface ContentGeneratorProps {
  onGenerate?: (content: string) => void;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ onGenerate }) => {
  const [contentType, setContentType] = useState('product_description');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic) {
      alert('Please enter a topic or keywords');
      return;
    }
    
    try {
      setLoading(true);
      
      // Simulate API call to AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock content based on inputs
      let content = '';
      
      if (contentType === 'product_description') {
        content = `Introducing our premium ${topic} - the perfect solution for all your needs. 
        
This high-quality product features exceptional craftsmanship and attention to detail, ensuring long-lasting performance and reliability. Designed with user comfort in mind, it offers intuitive functionality and seamless integration into your daily routine.

Key Features:
• Durable construction for long-lasting use
• Ergonomic design for maximum comfort
• Versatile functionality for various applications
• Premium materials for superior quality

Whether you're a professional or enthusiast, our ${topic} delivers outstanding performance every time. Backed by our satisfaction guarantee, you can purchase with confidence knowing you're investing in a product that truly stands out from the competition.`;
      } else if (contentType === 'blog_post') {
        content = `# The Complete Guide to ${topic}

## Introduction

In today's fast-paced world, understanding ${topic} has become increasingly important. Whether you're a beginner or an expert, this comprehensive guide will provide valuable insights and practical tips to help you navigate this fascinating subject.

## Why ${topic} Matters

${topic} plays a crucial role in modern life, influencing everything from daily decisions to long-term planning. The significance cannot be overstated, as more people recognize its impact on efficiency, productivity, and overall satisfaction.

## Key Strategies for Success

1. **Research thoroughly** - Take time to understand all aspects of ${topic}
2. **Implement gradually** - Start with small changes and build momentum
3. **Measure results** - Track your progress to identify what works best
4. **Adapt as needed** - Be flexible and willing to adjust your approach

## Common Mistakes to Avoid

Many people struggle with ${topic} because they fall into common traps. Avoid these pitfalls by staying informed, seeking expert advice, and maintaining a balanced perspective.

## Conclusion

Mastering ${topic} is a journey that requires patience and dedication. By following the guidelines outlined in this post, you'll be well-equipped to achieve your goals and enjoy the benefits that come with expertise in this area.`;
      } else if (contentType === 'social_media') {
        content = `✨ Elevate your experience with our amazing ${topic}! 🔥

Designed for those who demand the best, this game-changing product delivers exceptional performance and style. 

🔹 Premium quality
🔹 Unmatched durability
🔹 Stunning design

Limited stock available - don't miss out! Click the link in bio to shop now. 

#${topic.replace(/\s+/g, '')} #MustHave #PremiumQuality #ShopNow`;
      } else if (contentType === 'email') {
        content = `Subject: Introducing Our Revolutionary ${topic} - Special Launch Offer Inside!

Dear Valued Customer,

We're thrilled to announce the launch of our newest innovation: the premium ${topic} you've been waiting for.

Designed with your needs in mind, our ${topic} offers:

• Exceptional performance that outshines competitors
• Intuitive design for seamless everyday use
• Premium materials for lasting durability
• Exclusive features you won't find elsewhere

As a token of our appreciation for your continued support, we're offering an exclusive 15% discount for the next 48 hours. Simply use code LAUNCH15 at checkout.

Don't miss this opportunity to be among the first to experience the difference.

Shop now: [Your Website Link]

Best regards,
The [Your Company] Team`;
      } else if (contentType === 'seo_meta') {
        content = `Title: Premium ${topic} | High-Quality, Professional-Grade | Free Shipping

Meta Description: Shop our premium ${topic} featuring exceptional quality, durability, and performance. Free shipping, 30-day returns, and satisfaction guaranteed. Order today!

Keywords: ${topic}, premium ${topic}, high-quality ${topic}, professional ${topic}, buy ${topic} online, best ${topic}`;
      }
      
      setGeneratedContent(content);
      
      if (onGenerate) {
        onGenerate(content);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-purple-100 rounded-full mr-3">
          <FileText className="h-5 w-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-medium">AI Content Generator</h3>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600">
          Generate high-quality content for your product descriptions, blog posts, social media, and more.
        </p>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
          >
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
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="informative">Informative</option>
            <option value="persuasive">Persuasive</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          >
            <option value="short">Short (50-100 words)</option>
            <option value="medium">Medium (100-300 words)</option>
            <option value="long">Long (300-500 words)</option>
            <option value="very_long">Very Long (500+ words)</option>
          </select>
        </div>
      </div>
      
      {!generatedContent ? (
        <Button 
          onClick={handleGenerate} 
          disabled={loading || !topic}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Content
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-600" />
                )}
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap border border-gray-200 max-h-96 overflow-y-auto">
              {generatedContent}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setGeneratedContent(null)}
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate New
            </Button>
            
            <Button
              onClick={() => {
                if (onGenerate) {
                  onGenerate(generatedContent);
                }
              }}
              className="flex-1"
            >
              Use This Content
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;