import React from 'react';

const Affiliates = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Affiliate Program
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Join our affiliate program and earn rewards for promoting our products
          </p>
        </div>
        
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Commission Rates</h3>
              <p className="mt-2 text-gray-600">
                Earn competitive commission rates on every successful referral
              </p>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Real-time Tracking</h3>
              <p className="mt-2 text-gray-600">
                Monitor your referrals and earnings with our advanced tracking system
              </p>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Instant Payouts</h3>
              <p className="mt-2 text-gray-600">
                Get paid quickly and reliably for your successful referrals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Affiliates;