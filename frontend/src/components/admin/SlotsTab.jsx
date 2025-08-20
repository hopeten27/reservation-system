import { useState } from 'react';
import { useGetSlotsQuery, useDeleteSlotMutation } from '../../store/api/slotsApi';
import Loader from '../shared/Loader';
import ErrorState from '../shared/ErrorState';
import EmptyState from '../shared/EmptyState';
import ConfirmDialog from '../shared/ConfirmDialog';
import SlotModal from './SlotModal';

const SlotsTab = () => {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editSlot, setEditSlot] = useState(null);
  
  const { data, isLoading, error } = useGetSlotsQuery({ page, limit: 10 });
  const [deleteSlot, { isLoading: isDeleting }] = useDeleteSlotMutation();
  
  const slots = data?.data?.slots || [];
  const pagination = data?.data?.pagination;
  
  const handleDelete = async () => {
    try {
      await deleteSlot(deleteId).unwrap();
      setDeleteId(null);
    } catch (error) {
      // Error handled by toast middleware
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <Loader className="py-8" />;
  if (error) return <ErrorState message="Failed to load slots" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Time Slots</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Add Slot
        </button>
      </div>

      {slots.length === 0 ? (
        <EmptyState 
          title="No slots found"
          description="Create your first time slot to allow bookings."
          action={
            <button 
              onClick={() => setShowModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Add Slot
            </button>
          }
        />
      ) : (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {slots.map((slot) => (
                <li key={slot._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {slot.service?.name || 'Unknown Service'}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(slot.status)}`}>
                            {slot.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-gray-600">
                        <p>
                          <span className="font-medium">Date:</span>{' '}
                          {new Date(slot.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p>
                          <span className="font-medium">Time:</span>{' '}
                          {new Date(slot.date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p>
                          <span className="font-medium">Capacity:</span> {slot.bookedCount}/{slot.capacity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => {
                          setEditSlot(slot);
                          setShowModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => setDeleteId(slot._id)}
                        className="text-red-600 hover:text-red-800 font-medium"
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
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
        title="Delete Slot"
        message="Are you sure you want to delete this slot? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
      
      <SlotModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditSlot(null);
        }}
        slot={editSlot}
      />
    </div>
  );
};

export default SlotsTab;