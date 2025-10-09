import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { ProfileCreatePage } from '@/features/profile/ProfileCreatePage';
import { ProfileViewPage } from '@/features/profile/ProfileViewPage';
import { UploadDocsPage } from '@/features/uploads/UploadDocsPage';
import DonorDiscoverPage from '@/features/donor/DonorDiscoverPage';
import PledgeFormPage from '@/features/donor/PledgeFormPage';
import DonorDashboardPage from '@/features/donor/DonorDashboardPage';
import AdminDashboardPage from '@/features/admin/AdminDashboardPage';
import VerificationQueuePage from '@/features/admin/VerificationQueuePage';
import ReportsPage from '@/features/reports/ReportsPage';
import { Spinner } from '@/components/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" aria-label="Loading" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" aria-label="Loading" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/profile/new"
        element={
          <ProtectedRoute>
            <ProfileCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileViewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/uploads"
        element={
          <ProtectedRoute>
            <UploadDocsPage />
          </ProtectedRoute>
        }
      />

      {/* Sprint 3: Donor Discovery & Pledging */}
      <Route
        path="/donor/discover"
        element={
          <ProtectedRoute>
            <DonorDiscoverPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/pledge"
        element={
          <ProtectedRoute>
            <PledgeFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/dashboard"
        element={
          <ProtectedRoute>
            <DonorDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Sprint 4: Admin & Verification */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/verification"
        element={
          <ProtectedRoute>
            <VerificationQueuePage />
          </ProtectedRoute>
        }
      />

      {/* Sprint 5: Integration & Delivery */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/profile" replace />} />
      
      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};