import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { PublicLayout, UserLayout, CatteryLayout } from '../layouts/Layouts';

import Home from '../pages/public/Home.tsx';
import Login from '../pages/public/Login.tsx';
import Register from '../pages/public/Register.tsx';
import BrowseCats from '../pages/public/BrowseCats.tsx';
import CatDetail from '../pages/public/CatDetail.tsx';

import UserDashboard from '../pages/user/Dashboard.tsx';
import ApplicationForm from '../pages/user/ApplicationForm.tsx';
import UserApplicationDetail from '../pages/user/ApplicationDetail';

import CatteryDashboard from '../pages/cattery/Dashboard.tsx';
import ManageCats from '../pages/cattery/ManageCats.tsx';
import ManageApplications from '../pages/cattery/ManageApplications.tsx';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />
      <Route
        path="/register"
        element={
          <PublicLayout>
            <Register />
          </PublicLayout>
        }
      />
      <Route
        path="/browse-cats"
        element={
          <PublicLayout>
            <BrowseCats />
          </PublicLayout>
        }
      />
      <Route
        path="/cat/:id"
        element={
          <PublicLayout>
            <CatDetail />
          </PublicLayout>
        }
      />

      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute requiredRoles={['USER']}>
            <UserLayout>
              <UserDashboard />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/apply/:catId"
        element={
          <ProtectedRoute requiredRoles={['USER']}>
            <UserLayout>
              <ApplicationForm />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/application/:id"
        element={
          <ProtectedRoute requiredRoles={['USER']}>
            <UserLayout>
              <UserApplicationDetail />
            </UserLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/cattery/dashboard"
        element={
          <ProtectedRoute requiredRoles={['CATTERY_ADMIN', 'ADMIN']}>
            <CatteryLayout>
              <CatteryDashboard />
            </CatteryLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cattery/manage-cats"
        element={
          <ProtectedRoute requiredRoles={['CATTERY_ADMIN', 'ADMIN']}>
            <CatteryLayout>
              <ManageCats />
            </CatteryLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cattery/manage-applications"
        element={
          <ProtectedRoute requiredRoles={['CATTERY_ADMIN', 'ADMIN']}>
            <CatteryLayout>
              <ManageApplications />
            </CatteryLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
