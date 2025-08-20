import { useState } from 'react';
import { useGetServicesQuery, useDeleteServiceMutation } from '../../store/api/servicesApi';
import Loader from '../shared/Loader';
import ErrorState from '../shared/ErrorState';
import EmptyState from '../shared/EmptyState';
import ConfirmDialog from '../shared/ConfirmDialog';
import ServiceModal from './ServiceModal';

const ServicesTab = () => {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState(null);
  
  const { data, isLoading, error } = useGetServicesQuery({ page, limit: 10 });
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();
  
  const services = data?.data?.services || [];
  const pagination = data?.data?.pagination;
  
  const handleDelete = async () => {
    try {
      await deleteService(deleteId).unwrap();
      setDeleteId(null);
    } catch (error) {
      // Error handled by toast middleware
    }
  };

  if (isLoading) return <Loader className="py-8" />;
  if (error) return <ErrorState message="Failed to load services" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Services</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Add Service
        </button>
      </div>

      {services.length === 0 ? (
        <EmptyState 
          title="No services found"
          description="Create your first service to get started."
          action={
            <button 
              onClick={() => setShowModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Add Service
            </button>
          }
        />
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {services.map((service) => (
                <li key={service._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {service.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            ${service.price}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            service.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {service.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {service.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Duration: {service.durationMinutes} minutes
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => {
                          setEditService(service);
                          setShowModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => setDeleteId(service._id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
      
      <ServiceModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditService(null);
        }}
        service={editService}
      />
    </div>
  );
};

export default ServicesTab;