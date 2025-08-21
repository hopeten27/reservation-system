import { useState } from 'react';
import AdminTabs from '../components/admin/AdminTabs';
import DashboardStats from '../components/admin/DashboardStats';
import ServicesTab from '../components/admin/ServicesTab';
import SlotsTab from '../components/admin/SlotsTab';
import BookingsTab from '../components/admin/BookingsTab';
import CouponManagement from '../components/admin/CouponManagement';
import BulkSlotCreation from '../components/admin/BulkSlotCreation';
import DataExport from '../components/admin/DataExport';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import UserManagement from '../components/admin/UserManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  
  const tabs = [
    { id: 'analytics', label: 'Analytics' },
    { id: 'services', label: 'Services' },
    { id: 'slots', label: 'Slots' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'users', label: 'Users' },
    { id: 'coupons', label: 'Coupons' },
    { id: 'bulk-slots', label: 'Bulk Slots' },
    { id: 'export', label: 'Export' },
  ];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'services':
        return <ServicesTab />;
      case 'slots':
        return <SlotsTab />;
      case 'bookings':
        return <BookingsTab />;
      case 'users':
        return <UserManagement />;
      case 'coupons':
        return <CouponManagement />;
      case 'bulk-slots':
        return <BulkSlotCreation />;
      case 'export':
        return <DataExport />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-2">Manage your booking system efficiently</p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats />
        
        {/* Tabs Navigation */}
        <div className="mb-8">
          <AdminTabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </div>
        
        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;