import React, { useState, useEffect } from 'react';
import { funnelService, Funnel } from '../../modules/funnels';
import { GitBranch, Plus, BarChart3, Edit, Trash2, Play, Pause, Copy, Search, Filter, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const FunnelsPage: React.FC = () => {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  useEffect(() => {
    fetchFunnels();
  }, []);
  
  const fetchFunnels = async () => {
    try {
      setLoading(true);
      const fetchedFunnels = await funnelService.getFunnels();
      setFunnels(fetchedFunnels);
    } catch (error) {
      console.error('Error fetching funnels:', error);
      toast.error('Failed to load sales funnels');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (id: string, status: 'draft' | 'active' | 'archived') => {
    try {
      await funnelService.updateFunnel(id, { status });
      setFunnels(funnels.map(funnel => 
        funnel.id === id ? { ...funnel, status } : funnel
      ));
      toast.success(`Funnel ${status === 'active' ? 'activated' : status === 'archived' ? 'archived' : 'saved as draft'}`);
    } catch (error) {
      console.error('Error updating funnel status:', error);
      toast.error('Failed to update funnel status');
    }
  };
  
  const handleDuplicateFunnel = async (funnel: Funnel) => {
    try {
      const newFunnel = await funnelService.createFunnel({
        name: `${funnel.name} (Copy)`,
        description: funnel.description,
        status: 'draft',
        steps: funnel.steps.map(step => ({
          ...step,
          id: undefined,
          funnelId: undefined
        }))
      });
      
      setFunnels([newFunnel, ...funnels]);
      toast.success('Funnel duplicated successfully');
    } catch (error) {
      console.error('Error duplicating funnel:', error);
      toast.error('Failed to duplicate funnel');
    }
  };
  
  const handleDeleteFunnel = async (id: string) => {
    if (!confirm('Are you sure you want to delete this funnel? This action cannot be undone.')) {
      return;
    }
    
    try {
      await funnelService.deleteFunnel(id);
      setFunnels(funnels.filter(funnel => funnel.id !== id));
      toast.success('Funnel deleted successfully');
    } catch (error) {
      console.error('Error deleting funnel:', error);
      toast.error('Failed to delete funnel');
    }
  };
  
  const filteredFunnels = funnels.filter(funnel => {
    const matchesSearch = funnel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (funnel.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter ? funnel.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Draft
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
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
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Sales Funnels</h1>
          <p className="text-gray-600">Create and manage custom sales funnels for your products</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Funnel
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search funnels..."
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
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredFunnels.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <GitBranch className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No funnels found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter
              ? 'No funnels match your search criteria'
              : 'Create your first sales funnel to start converting more visitors into customers'}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Funnel
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFunnels.map((funnel) => (
            <div key={funnel.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{funnel.name}</h3>
                    <div className="flex items-center mt-1">
                      <GitBranch className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">{funnel.steps.length} steps</span>
                      <span className="mx-2 text-gray-300">•</span>
                      {getStatusBadge(funnel.status)}
                    </div>
                  </div>
                  <div className="flex">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit">
                      <Edit className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Duplicate" onClick={() => handleDuplicateFunnel(funnel)}>
                      <Copy className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Delete" onClick={() => handleDeleteFunnel(funnel.id!)}>
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
                
                {funnel.description && (
                  <p className="text-sm text-gray-600 mb-4">{funnel.description}</p>
                )}
                
                <div className="space-y-3 mb-4">
                  {funnel.steps.slice(0, 3).map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-800">
                        {index + 1}
                      </div>
                      <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                      <div className="flex-1 text-sm">
                        <span className="font-medium">{step.name}</span>
                        <span className="text-xs text-gray-500 ml-2 capitalize">({step.type})</span>
                      </div>
                    </div>
                  ))}
                  
                  {funnel.steps.length > 3 && (
                    <div className="text-sm text-gray-500 text-center">
                      +{funnel.steps.length - 3} more steps
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  
                  {funnel.status === 'draft' && (
                    <Button className="flex-1" onClick={() => handleStatusChange(funnel.id!, 'active')}>
                      <Play className="h-4 w-4 mr-2" />
                      Activate
                    </Button>
                  )}
                  
                  {funnel.status === 'active' && (
                    <Button className="flex-1" onClick={() => handleStatusChange(funnel.id!, 'draft')}>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  
                  {funnel.status === 'archived' && (
                    <Button className="flex-1" onClick={() => handleStatusChange(funnel.id!, 'draft')}>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Restore
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Performance</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Stats
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Views</p>
                    <p className="font-medium">1,245</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Conversions</p>
                    <p className="font-medium">87</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Rate</p>
                    <p className="font-medium">7.0%</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FunnelsPage;