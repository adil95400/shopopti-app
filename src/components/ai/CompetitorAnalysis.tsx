import React, { useState } from 'react';
import { Search, Loader2, ExternalLink, BarChart, TrendingUp, DollarSign, Eye } from 'lucide-react';
import { Button } from '../ui/button';

interface CompetitorAnalysisProps {
  onAnalysisComplete?: (data: any) => void;
}

const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ onAnalysisComplete }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate URL
      if (!url.startsWith('http')) {
        setError('Please enter a valid URL starting with http:// or https://');
        return;
      }
      
      // Simulate API call to analysis service
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock analysis results
      const mockResults = {
        url,
        domain: new URL(url).hostname,
        score: Math.floor(Math.random() * 30) + 70,
        metrics: {
          traffic: Math.floor(Math.random() * 50000) + 10000,
          keywords: Math.floor(Math.random() * 500) + 100,
          backlinks: Math.floor(Math.random() * 1000) + 200,
          socialShares: Math.floor(Math.random() * 5000) + 500
        },
        topKeywords: [
          { keyword: 'wireless earbuds', volume: 12500, position: 3 },
          { keyword: 'bluetooth headphones', volume: 8300, position: 5 },
          { keyword: 'noise cancelling earbuds', volume: 6200, position: 7 },
          { keyword: 'wireless headphones', volume: 9100, position: 12 }
        ],
        competitors: [
          { name: 'competitor1.com', overlap: 78, traffic: 85000 },
          { name: 'competitor2.com', overlap: 65, traffic: 62000 },
          { name: 'competitor3.com', overlap: 52, traffic: 43000 }
        ],
        recommendations: [
          'Focus on long-tail keywords related to product features',
          'Improve page load speed for better user experience',
          'Add more detailed product specifications',
          'Increase social proof with more customer reviews'
        ]
      };
      
      setResults(mockResults);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(mockResults);
      }
    } catch (error) {
      console.error('Error analyzing competitor:', error);
      setError('An error occurred while analyzing the competitor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Competitor Analysis</h3>
        
        <div className="mb-6">
          <p className="text-gray-600">
            Enter a competitor's URL to analyze their SEO, keywords, and market position.
          </p>
        </div>
        
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="url"
              placeholder="https://competitor.com"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={!url || loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze'
            )}
          </Button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
      </div>
      
      {results && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium">{results.domain}</h3>
                <a
                  href={results.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  {results.url}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
              <div className="flex items-center">
                <div className={`text-lg font-bold px-3 py-1 rounded-full ${
                  results.score >= 80 ? 'bg-green-100 text-green-800' :
                  results.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {results.score}/100
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center text-gray-500 mb-1">
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="text-sm">Traffic</span>
                </div>
                <p className="text-lg font-medium">{results.metrics.traffic.toLocaleString()}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center text-gray-500 mb-1">
                  <Search className="h-4 w-4 mr-1" />
                  <span className="text-sm">Keywords</span>
                </div>
                <p className="text-lg font-medium">{results.metrics.keywords.toLocaleString()}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center text-gray-500 mb-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">Backlinks</span>
                </div>
                <p className="text-lg font-medium">{results.metrics.backlinks.toLocaleString()}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center text-gray-500 mb-1">
                  <BarChart className="h-4 w-4 mr-1" />
                  <span className="text-sm">Social Shares</span>
                </div>
                <p className="text-lg font-medium">{results.metrics.socialShares.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="font-medium mb-4">Top Keywords</h4>
              <div className="space-y-3">
                {results.topKeywords.map((keyword: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">{keyword.keyword}</p>
                      <p className="text-sm text-gray-500">
                        {keyword.volume.toLocaleString()} searches/month
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-md text-sm ${
                      keyword.position <= 3 ? 'bg-green-100 text-green-800' :
                      keyword.position <= 10 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      #{keyword.position}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="font-medium mb-4">Main Competitors</h4>
              <div className="space-y-3">
                {results.competitors.map((competitor: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">{competitor.name}</p>
                      <p className="text-sm text-gray-500">
                        {competitor.traffic.toLocaleString()} monthly visitors
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{competitor.overlap}%</span>
                      <span className="text-gray-500"> overlap</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-medium mb-4">Recommendations</h4>
            <ul className="space-y-2">
              {results.recommendations.map((recommendation: string, index: number) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitorAnalysis;