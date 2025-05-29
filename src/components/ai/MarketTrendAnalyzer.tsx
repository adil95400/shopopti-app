import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Search, Filter, Loader2, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '../ui/button';

interface MarketTrendAnalyzerProps {
  onAnalysisComplete?: (data: any) => void;
}

const MarketTrendAnalyzer: React.FC<MarketTrendAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!keyword && !category) {
      alert('Please enter a keyword or select a category');
      return;
    }
    
    try {
      setLoading(true);
      
      // Simulate API call to trend analysis service
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate mock trend data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const trendData = months.map(month => ({
        name: month,
        value: Math.floor(Math.random() * 100) + 20,
        competition: Math.floor(Math.random() * 100)
      }));
      
      const relatedKeywords = [
        { keyword: `${keyword} online`, volume: Math.floor(Math.random() * 10000) + 1000, trend: 'up', difficulty: Math.floor(Math.random() * 100) },
        { keyword: `best ${keyword}`, volume: Math.floor(Math.random() * 8000) + 1000, trend: 'up', difficulty: Math.floor(Math.random() * 100) },
        { keyword: `${keyword} for sale`, volume: Math.floor(Math.random() * 6000) + 1000, trend: 'stable', difficulty: Math.floor(Math.random() * 100) },
        { keyword: `cheap ${keyword}`, volume: Math.floor(Math.random() * 5000) + 1000, trend: 'down', difficulty: Math.floor(Math.random() * 100) },
        { keyword: `${keyword} review`, volume: Math.floor(Math.random() * 4000) + 1000, trend: 'up', difficulty: Math.floor(Math.random() * 100) }
      ];
      
      const mockResults = {
        keyword: keyword || category,
        searchVolume: Math.floor(Math.random() * 50000) + 5000,
        trend: trendData,
        growthRate: parseFloat((Math.random() * 40 - 10).toFixed(1)),
        competition: Math.floor(Math.random() * 100),
        cpc: parseFloat((Math.random() * 5).toFixed(2)),
        relatedKeywords,
        seasonality: Math.random() > 0.5 ? 'High' : 'Low',
        recommendations: [
          'Focus on long-tail keywords for better conversion',
          'Create content around peak seasonality periods',
          'Target related keywords with lower competition',
          'Optimize product listings for high-volume search terms'
        ]
      };
      
      setResults(mockResults);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(mockResults);
      }
    } catch (error) {
      console.error('Error analyzing market trends:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-green-100 rounded-full mr-3">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-lg font-medium">Market Trend Analyzer</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600">
            Analyze market trends and search volume for products or keywords to identify opportunities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Keyword</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="e.g., wireless earbuds, yoga mat, smart watch"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion & Apparel</option>
              <option value="Home">Home & Garden</option>
              <option value="Beauty">Beauty & Personal Care</option>
              <option value="Sports">Sports & Outdoors</option>
              <option value="Toys">Toys & Games</option>
            </select>
          </div>
        </div>
        
        <Button
          onClick={handleAnalyze}
          disabled={loading || (!keyword && !category)}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 mr-2" />
              Analyze Market Trends
            </>
          )}
        </Button>
      </div>
      
      {results && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-medium">{results.keyword}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500 mr-3">
                    Search Volume: {results.searchVolume.toLocaleString()} monthly searches
                  </span>
                  <span className="text-sm text-gray-500">
                    CPC: ${results.cpc}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  results.growthRate > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {results.growthRate > 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(results.growthRate)}% {results.growthRate > 0 ? 'growth' : 'decline'}
                </div>
              </div>
            </div>
            
            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={results.trend}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{fontSize: 12, fill: '#6B7280'}} />
                  <YAxis yAxisId="left" orientation="left" tick={{fontSize: 12, fill: '#6B7280'}} />
                  <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#6B7280'}} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem',
                      padding: '8px 12px',
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="value"
                    name="Search Volume"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="competition"
                    name="Competition"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-gray-900 mb-2">Competition</h4>
                <div className="flex items-center">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                    <div
                      className={`h-2 rounded-full ${
                        results.competition < 33 ? 'bg-green-500' :
                        results.competition < 66 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${results.competition}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{results.competition}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {results.competition < 33 ? 'Low competition - good opportunity' :
                   results.competition < 66 ? 'Medium competition - moderate opportunity' :
                   'High competition - challenging market'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-gray-900 mb-2">Seasonality</h4>
                <p className="text-lg font-medium">
                  {results.seasonality}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {results.seasonality === 'High'
                    ? 'Significant seasonal fluctuations in demand'
                    : 'Relatively stable demand throughout the year'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-gray-900 mb-2">Growth Trend</h4>
                <div className="flex items-center">
                  {results.growthRate > 0 ? (
                    <ArrowUpRight className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className={`text-lg font-medium ${
                    results.growthRate > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(results.growthRate)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {results.growthRate > 10 ? 'Strong upward trend' :
                   results.growthRate > 0 ? 'Moderate growth' :
                   results.growthRate > -10 ? 'Slight decline' :
                   'Significant downward trend'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Related Keywords</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keyword
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Search Volume
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trend
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.relatedKeywords.map((keyword: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{keyword.keyword}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{keyword.volume.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {keyword.trend === 'up' && (
                            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                          )}
                          {keyword.trend === 'down' && (
                            <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          <span className={`text-sm ${
                            keyword.trend === 'up' ? 'text-green-500' : 
                            keyword.trend === 'down' ? 'text-red-500' : 
                            'text-gray-500'
                          }`}>
                            {keyword.trend === 'up' ? 'Rising' : 
                             keyword.trend === 'down' ? 'Declining' : 
                             'Stable'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                keyword.difficulty < 33 ? 'bg-green-500' :
                                keyword.difficulty < 66 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${keyword.difficulty}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">{keyword.difficulty}/100</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Recommendations</h3>
            <ul className="space-y-2">
              {results.recommendations.map((recommendation: string, index: number) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-xs font-medium text-green-600">{index + 1}</span>
                  </div>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 flex justify-end">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Analysis
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketTrendAnalyzer;