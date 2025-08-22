import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useCreateSlotMutation, useUpdateSlotMutation } from '../../store/api/slotsApi';
import { useGetServicesQuery } from '../../store/api/servicesApi';
import FormInput from '../shared/FormInput';
import Loader from '../shared/Loader';

const SlotModal = ({ isOpen, onClose, slot = null }) => {
  const isEdit = !!slot;
  const [createSlot, { isLoading: isCreating }] = useCreateSlotMutation();
  const [updateSlot, { isLoading: isUpdating }] = useUpdateSlotMutation();
  const { data: servicesData } = useGetServicesQuery();
  
  const services = servicesData?.data?.services || [];
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (slot && isEdit) {
      const slotDate = new Date(slot.date);
      const dateStr = slotDate.toISOString().split('T')[0];
      const timeStr = slotDate.toTimeString().slice(0, 5);
      
      reset({
        service: slot.service?._id || slot.service,
        date: dateStr,
        time: timeStr,
        capacity: slot.capacity,
        status: slot.status
      });
    } else {
      reset({
        service: '',
        date: '',
        time: '',
        capacity: 5,
        status: 'open'
      });
    }
  }, [slot, isEdit, reset]);

  const onSubmit = async (data) => {
    try {
      const dateTime = new Date(`${data.date}T${data.time}`);
      const slotData = {
        service: data.service,
        date: dateTime.toISOString(),
        capacity: Number(data.capacity),
        status: data.status
      };
      
      if (isEdit) {
        await updateSlot({ id: slot._id, ...slotData }).unwrap();
      } else {
        await createSlot(slotData).unwrap();
      }
      onClose();
    } catch (error) {
      // Error handled by toast middleware
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white text-xl">
                {isEdit ? '⏰' : '➕'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {isEdit ? 'Edit Time Slot' : 'Add New Time Slot'}
                </h3>
                <p className="text-blue-100 text-sm">
                  {isEdit ? 'Update slot details' : 'Create a new booking time slot'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          
          <div className="space-y-6">
            {/* Service Selection */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h4 className="text-lg font-semibold text-gray-900">Service Selection</h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all"
                  {...register('service', { required: 'Service is required' })}
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name} - ${service.price}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <p className="mt-1 text-sm text-red-600">{errors.service.message}</p>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V7a3 3 0 013-3h4a3 3 0 013 3v4" />
                </svg>
                <h4 className="text-lg font-semibold text-gray-900">Date & Time</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Date"
                  type="date"
                  error={errors.date?.message}
                  required
                  {...register('date', { required: 'Date is required' })}
                />
                
                <FormInput
                  label="Time"
                  type="time"
                  error={errors.time?.message}
                  required
                  {...register('time', { required: 'Time is required' })}
                />
              </div>
            </div>

            {/* Capacity & Status */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h4 className="text-lg font-semibold text-gray-900">Capacity & Status</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Capacity"
                  type="number"
                  placeholder="5"
                  error={errors.capacity?.message}
                  required
                  {...register('capacity', { 
                    required: 'Capacity is required',
                    min: { value: 1, message: 'Capacity must be at least 1' }
                  })}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all"
                    {...register('status')}
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {(isCreating || isUpdating) ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {isEdit ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Update Slot
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Slot
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SlotModal;