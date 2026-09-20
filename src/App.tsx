import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { ErrorBoundary } from './components/layout/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export default App;
