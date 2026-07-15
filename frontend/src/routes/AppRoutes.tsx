import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MantineProviders from '@/components/MantineProviders';
import AppLayout from '@/components/layout/AppLayout';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import DashboardPage from '@/pages/Dashboard';
import KnowledgePage from '@/pages/Knowledge';
import LoginPage from '@/pages/Login';
import NotesPage from '@/pages/Notes';
import PlannerPage from '@/pages/Planner';
import SettingsPage from '@/pages/Settings';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { ROUTES } from '@/utils/constants';

export default function AppRoutes(): React.ReactElement {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <MantineProviders>
          <AuthProvider>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                <Route path={ROUTES.PLANNER} element={<PlannerPage />} />
                <Route path={ROUTES.NOTES} element={<NotesPage />} />
                <Route path={ROUTES.KNOWLEDGE} element={<KnowledgePage />} />
                <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
              </Route>
            </Route>
            <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
          </AuthProvider>
        </MantineProviders>
      </ThemeProvider>
    </BrowserRouter>
  );
}
