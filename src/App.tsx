import React from 'react';
import AppRoutes from './routes';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;