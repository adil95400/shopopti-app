import React, { useState } from 'react';
import { Server } from 'lucide-react';

interface FTPImporterProps {
  marketplace?: string;
}

const FTPImporter: React.FC<FTPImporterProps> = () => {
  const [ftpDetails, setFtpDetails] = useState({
    host: '',
    port: '21',
    username: '',
    password: '',
    path: '/'
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="rounded-full bg-primary-400 bg-opacity-10 p-2">
          <Server className="h-4 w-4 text-primary-400" />
        </div>
        <h3 className="text-lg font-medium text-white">Configuration FTP</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Hôte"
          className="bg-secondary-400 rounded-lg p-2 text-white placeholder-accent-200"
          value={ftpDetails.host}
          onChange={(e) => setFtpDetails({ ...ftpDetails, host: e.target.value })}
        />
        <input
          type="text"
          placeholder="Port"
          className="bg-secondary-400 rounded-lg p-2 text-white placeholder-accent-200"
          value={ftpDetails.port}
          onChange={(e) => setFtpDetails({ ...ftpDetails, port: e.target.value })}
        />
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          className="bg-secondary-400 rounded-lg p-2 text-white placeholder-accent-200"
          value={ftpDetails.username}
          onChange={(e) => setFtpDetails({ ...ftpDetails, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="bg-secondary-400 rounded-lg p-2 text-white placeholder-accent-200"
          value={ftpDetails.password}
          onChange={(e) => setFtpDetails({ ...ftpDetails, password: e.target.value })}
        />
        <input
          type="text"
          placeholder="Chemin"
          className="col-span-2 bg-secondary-400 rounded-lg p-2 text-white placeholder-accent-200"
          value={ftpDetails.path}
          onChange={(e) => setFtpDetails({ ...ftpDetails, path: e.target.value })}
        />
      </div>
      <button
        className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
        onClick={() => {
          // Handle FTP connection
          console.log(ftpDetails);
        }}
      >
        Connecter
      </button>
    </div>
  );
};

export default FTPImporter;