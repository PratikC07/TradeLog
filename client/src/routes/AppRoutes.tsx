import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import { LoginPage } from "../features/auth/components/LoginPage";
import { SignupPage } from "../features/auth/components/SignupPage";
import { Dashboard } from "../features/dashboard/components/Dashboard";
import { Journal } from "../features/journal/components/Journal";
import { DashboardLayout } from "../components/layout/DashboardLayout"; // IMPORT LAYOUT

const isAuthenticated = () => !!localStorage.getItem("access_token");

const PublicOnlyRoute = () => {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<SignupPage />} />
      </Route>

      {/* Protected Routes with Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* WRAP WITH LAYOUT */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
