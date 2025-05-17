import React from 'react';
import { Briefcase } from 'lucide-react';

const Careers = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Briefcase className="mx-auto h-12 w-12 text-indigo-600" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Join Our Team
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Build the future of e-commerce with us
          </p>
        </div>

        <div className="mt-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Example job posting cards */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900">Senior Frontend Developer</h3>
              <p className="mt-2 text-gray-600">Remote • Full-time</p>
              <p className="mt-4 text-gray-500">Join our engineering team and help build the next generation of e-commerce tools.</p>
              <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Apply Now
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900">Product Manager</h3>
              <p className="mt-2 text-gray-600">Hybrid • Full-time</p>
              <p className="mt-4 text-gray-500">Drive product strategy and work closely with our development and design teams.</p>
              <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Apply Now
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900">UX Designer</h3>
              <p className="mt-2 text-gray-600">Remote • Full-time</p>
              <p className="mt-4 text-gray-500">Create beautiful and intuitive user experiences for our platform.</p>
              <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Apply Now
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Why Join Us?</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Remote-First Culture</h3>
              <p className="mt-2 text-gray-500">Work from anywhere in the world with our distributed team.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Competitive Benefits</h3>
              <p className="mt-2 text-gray-500">Comprehensive health coverage, equity, and flexible time off.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Growth Opportunities</h3>
              <p className="mt-2 text-gray-500">Continuous learning and career development support.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;