import { useState } from 'react';
import { useGetUsersQuery, useUpdateUserMutation, useBanUserMutation } from '../../store/api/adminApi';
import Loader from '../shared/Loader';

const UserManagement = () => {
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  });
  const [confirmAction, setConfirmAction] = useState(null);

  const { data, isLoading } = useGetUsersQuery(filters);
  const [updateUser] = useUpdateUserMutation();
  const [banUser] = useBanUserMutation();
  const users = data?.data?.users || [];

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUser({ id: userId, role: newRole }).unwrap();
      setConfirmAction(null);
    } catch (error) {
      // Error handled by toast
    }
  };

  const handleBanUser = async (userId, banned) => {
    try {
      await banUser({ id: userId, banned }).unwrap();
      setConfirmAction(null);
    } catch (error) {
      // Error handled by toast
    }
  };

  const getActionConfig = (action) => {
    switch (action.type) {
      case 'ban':
        return {
          title: 'Ban User',
          message: `Are you sure you want to ban ${action.user.name}? They will no longer be able to access the platform.`,
          icon: '🚫',
          color: 'red'
        };
      case 'unban':
        return {
          title: 'Unban User',
          message: `Are you sure you want to unban ${action.user.name}? They will regain access to the platform.`,
          icon: '✅',
          color: 'green'
        };
      case 'role':
        return {
          title: 'Change User Role',
          message: `Are you sure you want to change ${action.user.name}'s role to ${action.newRole}?`,
          icon: '👤',
          color: 'blue'
        };
      default:
        return null;
    }
  };

  if (isLoading) return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="w-20 h-6 bg-gray-200 rounded"></div>
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <input
              type="text"
              placeholder="Name or email..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200">
          {users.map((user) => (
            <div key={user._id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                {/* User Info */}
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>Bookings: {user.bookingCount || 0}</span>
                      <span>Joined: {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </div>

                {/* Role & Status */}
                <div className="flex items-center space-x-4">
                  <select
                    value={user.role}
                    onChange={(e) => setConfirmAction({ type: 'role', user, newRole: e.target.value })}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                    user.banned
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : 'bg-green-100 text-green-800 border-green-200'
                  }`}>
                    {user.banned ? '🚫 Banned' : '✅ Active'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-6">
                  <button
                    onClick={() => setConfirmAction({ 
                      type: user.banned ? 'unban' : 'ban', 
                      user 
                    })}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      user.banned
                        ? 'text-green-600 bg-green-50 hover:bg-green-100'
                        : 'text-red-600 bg-red-50 hover:bg-red-100'
                    }`}
                  >
                    {user.banned ? 'Unban' : 'Ban'}
                  </button>
                  <button
                    onClick={() => window.open(`mailto:${user.email}`)}
                    className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    Email
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3 text-white text-2xl mr-4">
              👥
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3 text-white text-2xl mr-4">
              👑
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'admin').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3 text-white text-2xl mr-4">
              ✅
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => !u.banned).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-red-500 rounded-lg p-3 text-white text-2xl mr-4">
              🚫
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Banned Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.banned).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setConfirmAction(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  getActionConfig(confirmAction)?.color === 'green' ? 'bg-green-100' :
                  getActionConfig(confirmAction)?.color === 'blue' ? 'bg-blue-100' : 'bg-red-100'
                }`}>
                  {getActionConfig(confirmAction)?.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getActionConfig(confirmAction)?.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {confirmAction.user.name}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                {getActionConfig(confirmAction)?.message}
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (confirmAction.type === 'role') {
                      handleRoleChange(confirmAction.user._id, confirmAction.newRole);
                    } else {
                      handleBanUser(confirmAction.user._id, confirmAction.type === 'ban');
                    }
                  }}
                  className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition-colors ${
                    getActionConfig(confirmAction)?.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                    getActionConfig(confirmAction)?.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Yes, {getActionConfig(confirmAction)?.title}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;