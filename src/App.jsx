import React from 'react';
import AppRoutes from './routes/AppRoutes';

import { Toaster } from 'sonner';

export default function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <AppRoutes />
    </>
  );
}
