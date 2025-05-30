import React from 'react';
import { MessageSquare, Search, Filter, SlidersHorizontal, Star, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShop } from '../contexts/ShopContext';

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    productName: 'Premium Wireless Headphones',
    productImage: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
    customerName: 'John Doe',
    rating: 5,
    comment: 'Excellent sound quality and very comfortable to wear for long periods. Battery life is impressive!',
    date: '2024-03-10T14:23:54Z',
    source: 'aliexpress',
    helpful: 12,
    verified: true
  },
  {
    id: '2',
    productName: 'Smart Watch Series 5',
    productImage: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300',
    customerName: 'Sarah Williams',
    rating: 4,
    comment: 'Great features and good battery life. The only downside is that the screen could be a bit brighter outdoors.',
    date: '2024-03-09T09:12:11Z',
    source: 'amazon',
    helpful: 8,
    verified: true
  },
  {
    id: '3',
    productName: 'Ergonomic Office Chair',
    productImage: 'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=300',
    customerName: 'Michael Brown',
    rating: 5,
    comment: 'Best office chair I\'ve ever owned. The lumbar support is perfect and assembly was easy.',
    date: '2024-03-08T18:45:30Z',
    source: 'google',
    helpful: 15,
    verified: true
  }
];

const Reviews: React.FC = () => {
  const { isConnected } = useShop();
  const [searchQuery, setSearchQuery] = React.useState('');

  // Filter reviews based on search query
  const filteredReviews = mockReviews.filter(review =>
    review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' · ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-neutral-100 p-3">
          <MessageSquare size={28} className="text-neutral-400" />
        </div>
        <h2 className="mt-4 text-lg font-medium text-neutral-900">No store connected</h2>
        <p className="mt-1 text-neutral-500">Connect your store to manage reviews</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">Reviews</h1>
          <p className="text-neutral-500">
            Manage and monitor customer reviews across all platforms.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="btn btn-primary">
            Import Reviews
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search reviews..."
              className="input pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline">
              <Filter size={16} className="mr-2" />
              Filters
            </button>
            <button className="btn btn-outline">
              <SlidersHorizontal size={16} className="mr-2" />
              Sort
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="border border-neutral-200 rounded-lg p-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={review.productImage}
                  alt={review.productName}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-neutral-900">{review.productName}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize
                        ${review.source === 'aliexpress' ? 'bg-primary-100 text-primary-600' :
                          review.source === 'amazon' ? 'bg-accent-100 text-accent-600' :
                          'bg-secondary-100 text-secondary-600'}`}
                      >
                        {review.source}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={16}
                        className={index < review.rating ? 'text-warning-400 fill-warning-400' : 'text-neutral-300'}
                      />
                    ))}
                    <span className="ml-2 text-sm text-neutral-500">
                      {formatDate(review.date)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-neutral-700">{review.comment}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-neutral-500">
                        <ThumbsUp size={14} className="mr-1" />
                        <span>{review.helpful} helpful</span>
                      </div>
                      {review.verified && (
                        <span className="text-sm text-success-400">Verified Purchase</span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-neutral-900">
                      {review.customerName}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredReviews.length === 0 && (
            <div className="py-12 text-center">
              <div className="flex flex-col items-center">
                <Search className="h-8 w-8 text-neutral-300" />
                <h3 className="mt-2 text-sm font-medium text-neutral-900">No reviews found</h3>
                <p className="mt-1 text-sm text-neutral-500">Try adjusting your search or filters.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;