import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Home } from '../pages/Home';
import { Forecast } from '../pages/Forecast';
import { Simulator } from '../pages/Simulator';
import { Regret } from '../pages/Regret';
import { Ask } from '../pages/Ask';
import { Report } from '../pages/Report';
import { Goals } from '../pages/Goals';
import { Activity } from '../pages/Activity';
import { Upload } from '../pages/Upload';
import { SettingsPage } from '../pages/Settings';
import { Onboarding } from '../pages/Onboarding';
import { NotFound } from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/onboarding',
    element: <Onboarding />
  },
  {
    path: '/',
    element: (
      <AppLayout>
        <Home />
      </AppLayout>
    )
  },
  {
    path: '/forecast',
    element: (
      <AppLayout>
        <Forecast />
      </AppLayout>
    )
  },
  {
    path: '/simulator',
    element: (
      <AppLayout>
        <Simulator />
      </AppLayout>
    )
  },
  {
    path: '/regret',
    element: (
      <AppLayout>
        <Regret />
      </AppLayout>
    )
  },
  {
    path: '/ask',
    element: (
      <AppLayout>
        <Ask />
      </AppLayout>
    )
  },
  {
    path: '/report',
    element: (
      <AppLayout>
        <Report />
      </AppLayout>
    )
  },
  {
    path: '/goals',
    element: (
      <AppLayout>
        <Goals />
      </AppLayout>
    )
  },
  {
    path: '/activity',
    element: (
      <AppLayout>
        <Activity />
      </AppLayout>
    )
  },
  {
    path: '/upload',
    element: (
      <AppLayout>
        <Upload />
      </AppLayout>
    )
  },
  {
    path: '/settings',
    element: (
      <AppLayout>
        <SettingsPage />
      </AppLayout>
    )
  },
  {
    path: '*',
    element: (
      <AppLayout>
        <NotFound />
      </AppLayout>
    )
  }
]);
