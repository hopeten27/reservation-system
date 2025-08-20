import { useForm } from 'react-hook-form';
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
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: slot || {
      service: '',
      date: '',
      time: '',
      capacity: 5,
      status: 'open'
    }
  });

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
      reset();
      onClose();
    } catch (error) {
      // Error handled by toast middleware
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" onClick={onClose}></div>
      
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 max-w-lg w-full max-h-screen overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {isEdit ? 'Edit Slot' : 'Add Slot'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 text-gray-900 transition-all"
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 text-gray-900 transition-all"
                {...register('status')}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {(isCreating || isUpdating) ? (
                <>
                  <Loader size="sm" className="inline mr-2" />
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEdit ? 'Update Slot' : 'Create Slot'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SlotModal;