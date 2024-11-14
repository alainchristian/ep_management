// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from './store/authSlice';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/dashboard/DashboardPage';
import UserManagement from './components/users/UserManagement';
import { PrivateRoute } from './components/auth';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes - All wrapped in MainLayout */}
        <Route path="/" element={
          <PrivateRoute>
            <MainLayout>
              <Navigate to="/dashboard" replace />
            </MainLayout>
          </PrivateRoute>
        } />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        } />

        <Route path="/admin/users" element={
          <PrivateRoute>
            <MainLayout>
              <UserManagement />
            </MainLayout>
          </PrivateRoute>
        } />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;