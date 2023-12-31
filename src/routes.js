import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import UserPage from './pages/UserPage';
import Page404 from './pages/Page404';

import DashboardAppPage from './pages/DashboardAppPage';
import TemplateForAdminPage from './pages/TemplateForAdminPage';
import CreateTemplatePage from './pages/CreateTemplatePage';
import PurchaseOderPage from './pages/PurchaseOderPage';

import LoginPage from './pages/LoginPage';
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'template', element: <TemplateForAdminPage /> },
        { path: 'template', element: <TemplateForAdminPage /> },
        { path: 'create', element: <CreateTemplatePage /> },
        { path: 'purchase', element: <PurchaseOderPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
