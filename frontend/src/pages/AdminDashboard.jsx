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
    { id: 'export', label: 'Export Data' },
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
      </div>



      {/* Dashboard Stats */}
      <DashboardStats />
      
      {/* Tabs */}
      <AdminTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      {/* Tab Content */}
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;