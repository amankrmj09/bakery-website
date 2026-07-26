import React from 'react';
import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './components/layout/ScrollToTop';

import { Toaster } from 'sonner';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster richColors position="top-center" />
      <AppRoutes />
    </>
  );
}
