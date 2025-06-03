import React, { useState, useEffect } from 'react';
import { abTestingService, ABTest, ABTestResult } from '../../modules/ab-testing';
import { SplitSquareVertical, Plus, BarChart3, Play, Pause, Archive, Edit, Trash2, Copy, Search, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const ABTestingPage: React.FC = () => {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [testResults, setTestResults] = useState<ABTestResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  useEffect(() => {
    fetchTests();
  }, [statusFilter]);
  
  const fetchTests = async () => {
    try {
      setLoading(true);
      
      const filters: any = {};
      if (statusFilter) {
        filters.status = statusFilter;
      }
      
      const fetchedTests = await abTestingService.getTests(filters);
      setTests(fetchedTests);
    } catch (error) {
      console.error('Error fetching A/B tests:', error);
      toast.error('Failed to load A/B tests');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTestResults = async (testId: string) => {
    try {
      const results = await abTestingService.getTestResults(testId);
      setTestResults(results);
    } catch (error) {
      console.error('Error fetching test results:', error);
      toast.error('Failed to load test results');
    }
  };
  
  const handleSelectTest = async (test: ABTest) => {
    setSelectedTest(test);
    if (test.status === 'running' || test.status === 'completed') {
      await fetchTestResults(test.id!);
    }
  };
  
  const handleStartTest = async (id: string) => {
    try {
      await abTestingService.startTest(id);
      setTests(tests.map(test => 
        test.id === id ? { ...test, status: 'running', startDate: new Date() } : test
      ));
      
      if (selectedTest?.id === id) {
        setSelectedTest({ ...selectedTest, status: 'running', startDate: new Date() });
      }
      
      toast.success('Test started successfully');
    } catch (error) {
      console.error('Error starting test:', error);
      toast.error('Failed to start test');
    }
  };
  
  const handleStopTest = async (id: string, winningVariantId?: string) => {
    try {
      await abTestingService.stopTest(id, winningVariantId);
      setTests(tests.map(test => 
        test.id === id ? { ...test, status: 'completed', endDate: new Date(), winningVariantId } : test
      ));
      
      if (selectedTest?.id === id) {
        setSelectedTest({ ...selectedTest, status: 'completed', endDate: new Date(), winningVariantId });
      }
      
      toast.success('Test completed successfully');
    } catch (error) {
      console.error('Error stopping test:', error);
      toast.error('Failed to stop test');
    }
  };
  
  const handleDuplicateTest = async (test: ABTest) => {
    try {
      const newTest = await abTestingService.createTest({
        name: `${test.name} (Copy)`,
        description: test.description,
        status: 'draft',
        targetAudience: test.targetAudience,
        audienceSegmentId: test.audienceSegmentId,
        variants: test.variants.map(variant => ({
          ...variant,
          id: undefined,
          testId: undefined
        }))
      });
      
      setTests([newTest, ...tests]);
      toast.success('Test duplicated successfully');
    } catch (error) {
      console.error('Error duplicating test:', error);
      toast.error('Failed to duplicate test');
    }
  };
  
  const handleDeleteTest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
      return;
    }
    
    try {
      await abTestingService.deleteTest(id);
      setTests(tests.filter(test => test.id !== id));
      
      if (selectedTest?.id === id) {
        setSelectedTest(null);
      }
      
      toast.success('Test deleted successfully');
    } catch (error) {
      console.error('Error deleting test:', error);
      toast.error('Failed to delete test');
    }
  };
  
  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (test.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    return matchesSearch;
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Draft
          </span>
        );
      case 'running':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            Running
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Archived
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };
  
  const formatDate = (date?: Date) => {
    return date ? date.toLocaleDateString() : 'N/A';
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">A/B Testing</h1>
          <p className="text-gray-600">Create and manage A/B tests to optimize your product pages and conversion rates</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Test
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tests..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
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
            <h3 className="font-medium">A/B Tests</h3>
          </div>
          
          <div className="overflow-y-auto max-h-[600px]">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredTests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center p-6 text-gray-500">
                <SplitSquareVertical className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No tests found</h3>
                <p className="text-sm">
                  {searchTerm || statusFilter
                    ? 'No tests match your search criteria'
                    : 'Create your first A/B test to get started'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredTests.map((test) => (
                  <div
                    key={test.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedTest?.id === test.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleSelectTest(test)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{test.name}</h4>
                        <div className="flex items-center mt-1">
                          <SplitSquareVertical className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">{test.variants.length} variants</span>
                          <span className="mx-2 text-gray-300">•</span>
                          {getStatusBadge(test.status)}
                        </div>
                      </div>
                    </div>
                    
                    {test.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{test.description}</p>
                    )}
                    
                    {test.startDate && (
                      <div className="mt-2 text-xs text-gray-500">
                        {test.status === 'running' ? 'Started' : 'Ran'}: {formatDate(test.startDate)}
                        {test.endDate && ` - ${formatDate(test.endDate)}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {selectedTest ? (
            <>
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{selectedTest.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className="ml-2">{getStatusBadge(selectedTest.status)}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {selectedTest.status === 'draft' && (
                    <Button size="sm\" onClick={() => handleStartTest(selectedTest.id!)}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Test
                    </Button>
                  )}
                  
                  {selectedTest.status === 'running' && (
                    <Button size="sm" onClick={() => handleStopTest(selectedTest.id!)}>
                      <Pause className="h-4 w-4 mr-2" />
                      Stop Test
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm" onClick={() => handleDuplicateTest(selectedTest)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                  
                  {selectedTest.status !== 'running' && (
                    <Button variant="outline" size="sm" onClick={() => handleDeleteTest(selectedTest.id!)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                {selectedTest.description && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{selectedTest.description}</p>
                  </div>
                )}
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Test Details</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="font-medium capitalize">{selectedTest.status}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Start Date</p>
                        <p className="font-medium">{formatDate(selectedTest.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">End Date</p>
                        <p className="font-medium">{formatDate(selectedTest.endDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Target Audience</p>
                        <p className="font-medium capitalize">{selectedTest.targetAudience || 'All visitors'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Variants</h4>
                  <div className="space-y-4">
                    {selectedTest.variants.map((variant, index) => (
                      <div key={variant.id} className="bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-800 mr-2">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <h5 className="font-medium">{variant.name}</h5>
                          </div>
                          <div className="text-sm text-gray-500">
                            {variant.trafficAllocation}% traffic
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Type</p>
                            <p className="text-sm capitalize">{variant.type}</p>
                          </div>
                          
                          {selectedTest.status === 'completed' && selectedTest.winningVariantId === variant.id && (
                            <div className="md:text-right">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Winner
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {(selectedTest.status === 'running' || selectedTest.status === 'completed') && testResults.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <p className="text-xs text-gray-500">Impressions</p>
                                <p className="font-medium">
                                  {testResults.find(r => r.variantId === variant.id)?.impressions || 0}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Conversions</p>
                                <p className="font-medium">
                                  {testResults.find(r => r.variantId === variant.id)?.conversions || 0}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Rate</p>
                                <p className="font-medium">
                                  {(testResults.find(r => r.variantId === variant.id)?.conversionRate || 0).toFixed(2)}%
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {(selectedTest.status === 'running' || selectedTest.status === 'completed') && testResults.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Results</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="h-60 bg-white rounded-md border border-gray-200 p-4 mb-4">
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <BarChart3 className="h-8 w-8 mr-2 text-gray-300" />
                          <span>Conversion rate comparison chart</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Total Impressions</p>
                          <p className="text-xl font-bold">
                            {testResults.reduce((sum, result) => sum + result.impressions, 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Conversions</p>
                          <p className="text-xl font-bold">
                            {testResults.reduce((sum, result) => sum + result.conversions, 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Avg. Conversion Rate</p>
                          <p className="text-xl font-bold">
                            {(testResults.reduce((sum, result) => sum + result.conversionRate, 0) / testResults.length).toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Revenue</p>
                          <p className="text-xl font-bold">
                            ${testResults.reduce((sum, result) => sum + result.revenue, 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      {selectedTest.status === 'running' && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <Button className="w-full" onClick={() => {
                            // Find the variant with the highest conversion rate
                            const bestVariant = testResults.reduce((best, current) => 
                              current.conversionRate > best.conversionRate ? current : best
                            , testResults[0]);
                            
                            handleStopTest(selectedTest.id!, bestVariant.variantId);
                          }}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            End Test & Apply Winner
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
              <SplitSquareVertical className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No test selected</h3>
              <p className="mb-4">Select a test from the list to view details</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Test
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ABTestingPage;