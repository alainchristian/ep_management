

// Example usage in a component:
// frontend/src/components/ExampleProtectedComponent.jsx
import React from 'react';
import { PermissionGate } from './auth/PermissionGate';
import { RoleGate } from './auth/RoleGate';
import { useAuth } from '../hooks/useAuth';

const ExampleProtectedComponent = () => {
  const { hasPermission, hasRole, user } = useAuth();

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      
      <PermissionGate permissions="manage_users">
        <div>
          <h2>User Management Section</h2>
          {/* User management content */}
        </div>
      </PermissionGate>

      <RoleGate roles={['admin', 'supervisor']}>
        <div>
          <h2>Admin/Supervisor Section</h2>
          {/* Admin/Supervisor content */}
        </div>
      </RoleGate>

      {/* Manual permission/role checking */}
      {hasPermission('take_attendance') && (
        <div>
          <h2>Attendance Section</h2>
          {/* Attendance content */}
        </div>
      )}
    </div>
  );
};

export default ExampleProtectedComponent;