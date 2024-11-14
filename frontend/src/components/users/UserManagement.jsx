// src/components/users/UserManagement.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Search, Filter } from 'lucide-react';
import { selectUserPermissions } from '../../store/authSlice';
import UserList from './UserList';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const userPermissions = useSelector(selectUserPermissions);

  const canCreateUser = userPermissions.includes('manage_users');
  const canEditUser = userPermissions.includes('manage_users');
  const canDeleteUser = userPermissions.includes('manage_users');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        {canCreateUser && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="supervisor">Supervisor</option>
                <option value="attendance_taker">Attendance Taker</option>
              </select>
              <Filter className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* User List */}
      <UserList 
        searchTerm={searchTerm}
        filterRole={filterRole}
        canEdit={canEditUser}
        canDelete={canDeleteUser}
      />

      {/* Create User Modal - To be implemented */}
      {isCreateModalOpen && (
        <div>
          {/* Modal content will go here */}
        </div>
      )}
    </div>
  );
};

export default UserManagement;