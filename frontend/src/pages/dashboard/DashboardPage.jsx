import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserRoles, selectUserPermissions } from '../../store/authSlice';
import Dashboard from '../../components/dashboard/Dashboard';

const DashboardPage = () => {
  const userRoles = useSelector(selectUserRoles);
  const userPermissions = useSelector(selectUserPermissions);

  // Pass relevant permissions to Dashboard component to show/hide elements
  return (
    <Dashboard 
      userRoles={userRoles}
      userPermissions={userPermissions}
    />
  );
};

export default DashboardPage;