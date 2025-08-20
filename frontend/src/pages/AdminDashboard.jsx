import { useState } from 'react';
import AdminTabs from '../components/admin/AdminTabs';
import DashboardStats from '../components/admin/DashboardStats';
import ServicesTab from '../components/admin/ServicesTab';
import SlotsTab from '../components/admin/SlotsTab';
import BookingsTab from '../components/admin/BookingsTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('services');
  
  const tabs = [
    { id: 'services', label: 'Services' },
    { id: 'slots', label: 'Slots' },
    { id: 'bookings', label: 'Bookings' },
  ];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'services':
        return <ServicesTab />;
      case 'slots':
        return <SlotsTab />;
      case 'bookings':
        return <BookingsTab />;
      default:
        return null;
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