import React from 'react';

function Blog() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Blog content will go here */}
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Blog content coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;