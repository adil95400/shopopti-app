import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Globe, Facebook, Instagram, Search, Mail } from 'lucide-react';

interface TrafficSourcesProps {
  data: {
    sources: {
      name: string;
      value: number;
      icon: React.ReactNode;
      color: string;
    }[];
    referrers: {
      name: string;
      visits: number;
      conversion: number;
    }[];
  };
}

const TrafficSources: React.FC<TrafficSourcesProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-6">Traffic Sources</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.sources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.sources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} visits`, 'Traffic']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.375rem',
                    padding: '8px 12px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {data.sources.map((source, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full mr-3" style={{ backgroundColor: `${source.color}20` }}>
                    {source.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{source.name}</h4>
                    <p className="text-sm text-gray-500">{source.value.toLocaleString()} visits</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${(source.value / data.sources.reduce((acc, curr) => acc + curr.value, 0)) * 100}%`,
                      backgroundColor: source.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-6">Top Referrers</h3>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.referrers}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{fontSize: 12, fill: '#6B7280'}} />
              <YAxis yAxisId="left" orientation="left" tick={{fontSize: 12, fill: '#6B7280'}} />
              <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#6B7280'}} tickFormatter={(value) => `${value}%`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.375rem',
                  padding: '8px 12px',
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="visits" name="Visits" fill="#3B82F6" />
              <Bar yAxisId="right" dataKey="conversion" name="Conversion Rate (%)" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TrafficSources;