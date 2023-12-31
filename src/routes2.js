import { Routes, Route, Navigate } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
//
import UserPage from './pages/UserPage';
import Page404 from './pages/Page404';

import PurchaseOderPage from './pages/PurchaseOderPage';
import DashboardAppPage from './pages/DashboardAppPage';
import TemplateForAdminPage from './pages/TemplateForAdminPage';
import CreateTemplatePage from './pages/CreateTemplatePage';
import { useUserContext } from './contexts/UserContext';
import useGetUserRole from './hooks/useGetUserRole';

import LoginPage from './pages/LoginPage';
import Page403 from './pages/Page403';

// ----------------------------------------------------------------------

export default function Router2() {
  const { currentUser } = useUserContext();
  const [admin] = useGetUserRole(currentUser);
  console.log(currentUser);
  console.log(admin);
  if (admin) {
    return (
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="app" element={<DashboardAppPage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="template/create" element={<CreateTemplatePage />} />
          <Route path="template" element={<TemplateForAdminPage />} />
          <Route path="purchase" element={<PurchaseOderPage />} />
          <Route path="*" element={<Navigate to="/404" />} />
          <Route path="/*" element={<Navigate to="/404" />} />
          <Route index element={<Navigate to="/app" />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="404" element={<Page404 />} />
        <Route path="403" element={<Page403 />} />
      </Routes>
    );
  }
  if (!admin) {
    return (
      <Routes>
                    
        <Route path="login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" />} /> 
        {currentUser === ''  && (
          <Route>
          <Route path="403" element={<Page403 />} />  
          <Route path="/app" element={<Navigate to="/403" />} />
          <Route path="/user" element={<Navigate to="/403" />} />
          <Route path="/template" element={<Navigate to="/403" />} />
          <Route path="/template/create" element={<Navigate to="/403" />} />
          <Route path="/purchase" element={<Navigate to="/403" />} />
          </Route>
        )}   
      </Routes>
    );
  }
  // return (
  //   <Routes>
  //     <Route path="login" element={<LoginPage />} />
  //     <Route path="/app" element={<Navigate to="/403" />} />
  //     <Route path="/user" element={<Navigate to="/403" />} />
  //     <Route path="/template" element={<Navigate to="/403" />} />
  //     <Route path="403" element={<Page403 />} />
  //   </Routes>
  // );
}
