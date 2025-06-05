import React from 'react';
import { Package, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { TrackingEvent, TrackingResult } from '../../services/trackingService';

interface TrackingHistoryProps {
  result: TrackingResult;
}

const TrackingHistory: React.FC<TrackingHistoryProps> = ({ result }) => {
  return (
    <div className="relative pb-12">
      {result.history.map((event, index) => (
        <div key={index} className="relative pb-8">
          {index < result.history.length - 1 && (
            <div className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200\" aria-hidden="true"></div>
          )}
          <div className="relative flex items-start space-x-3">
            <div>
              <div className={`relative px-1 ${
                index === result.history.length - 1 
                  ? result.status.code === 'delivered' 
                    ? 'bg-green-500' 
                    : result.status.code === 'exception' 
                      ? 'bg-red-500' 
                      : 'bg-blue-500' 
                  : 'bg-gray-300'
              } h-10 w-10 rounded-full flex items-center justify-center`}>
                {index === result.history.length - 1 ? (
                  result.status.code === 'delivered' ? (
                    <CheckCircle className="h-6 w-6 text-white" />
                  ) : result.status.code === 'exception' ? (
                    <AlertCircle className="h-6 w-6 text-white" />
                  ) : (
                    <Truck className="h-6 w-6 text-white" />
                  )
                ) : (
                  <Package className="h-6 w-6 text-white" />
                )}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {event.status}
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  {event.date}
                </p>
              </div>
              <div className="mt-2 text-sm text-gray-700">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                  <span>{event.location}</span>
                </div>
                <p className="mt-1">{event.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

function MapPin({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
}

export default TrackingHistory;