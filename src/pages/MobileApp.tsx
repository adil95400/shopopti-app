import React from 'react';

const MobileApp = () => {
  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Application Mobile</h1>
      <p>Gère ton business partout avec notre application mobile Shopopti+.</p>
      <img src="https://via.placeholder.com/200x400?text=Mockup+App" alt="Mobile Mockup" className="mx-auto my-6" />
      <p>Télécharge l'app :</p>
      <div className="flex justify-center gap-4 mt-4">
        <button className="bg-black text-white px-4 py-2 rounded">📱 APK</button>
        <button className="bg-gray-700 text-white px-4 py-2 rounded">🍏 TestFlight</button>
      </div>
    </div>
  );
};

export default MobileApp;
