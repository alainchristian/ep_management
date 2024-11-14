import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserRoles, selectUserPermissions } from '../store/authSlice';

const RoleBasedDashboard = () => {
  const userRoles = useSelector(selectUserRoles);
  const userPermissions = useSelector(selectUserPermissions);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current User Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Current User Access</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700">Your Roles:</h3>
              <ul className="list-disc list-inside mt-2">
                {userRoles.map((role, index) => (
                  <li key={index} className="text-indigo-600">{role}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Your Permissions:</h3>
              <ul className="list-disc list-inside mt-2">
                {userPermissions.map((permission, index) => (
                  <li key={index} className="text-green-600">{permission}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Role-based Content */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Role-Based Access Test</h2>
          <div className="space-y-4">
            {userRoles.includes('admin') && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-purple-700">Admin Only Content</p>
                <p className="text-sm text-purple-600">This content is only visible to administrators.</p>
              </div>
            )}

            {(userRoles.includes('teacher') || userRoles.includes('admin')) && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-700">Teacher/Admin Content</p>
                <p className="text-sm text-blue-600">This content is visible to teachers and administrators.</p>
              </div>
            )}

            {userRoles.includes('supervisor') && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-green-700">Supervisor Only Content</p>
                <p className="text-sm text-green-600">This content is only visible to supervisors.</p>
              </div>
            )}
          </div>
        </div>

        {/* Permission-based Content */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Permission-Based Access Test</h2>
          <div className="space-y-4">
            {userPermissions.includes('manage_users') && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-yellow-700">User Management</p>
                <p className="text-sm text-yellow-600">Only users with manage_users permission can see this.</p>
              </div>
            )}

            {userPermissions.includes('take_attendance') && (
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-red-700">Attendance Management</p>
                <p className="text-sm text-red-600">Only users with take_attendance permission can see this.</p>
              </div>
            )}

            {userPermissions.includes('manage_eps') && (
              <div className="p-4 bg-indigo-50 rounded-lg">
                <p className="text-indigo-700">EP Management</p>
                <p className="text-sm text-indigo-600">Only users with manage_eps permission can see this.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedDashboard;