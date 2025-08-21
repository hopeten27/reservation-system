import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useCreateService, useUpdateService } from '../../hooks/useServices';
import FormInput from '../shared/FormInput';
import Loader from '../shared/Loader';

const ServiceModal = ({ isOpen, onClose, service = null }) => {
  const isEdit = !!service;
  const createService = useCreateService();
  const updateService = useUpdateService();
  
  const isCreating = createService.isPending;
  const isUpdating = updateService.isPending;
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      durationMinutes: '',
      isActive: true
    }
  });

  useEffect(() => {
    if (service) {
      setValue('name', service.name);
      setValue('description', service.description);
      setValue('category', service.category);
      setValue('price', service.price);
      setValue('durationMinutes', service.durationMinutes);
      setValue('isActive', service.isActive);
    } else {
      reset();
    }
  }, [service, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('category', data.category || 'General');
      formData.append('price', Number(data.price));
      formData.append('durationMinutes', Number(data.durationMinutes));
      formData.append('isActive', data.isActive);
      
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }
      
      if (data.additionalImages && data.additionalImages.length > 0) {
        for (let i = 0; i < Math.min(data.additionalImages.length, 5); i++) {
          formData.append('additionalImages', data.additionalImages[i]);
        }
      }
      
      if (isEdit) {
        await updateService.mutateAsync({ id: service._id, formData });
      } else {
        await createService.mutateAsync(formData);
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
                {isEdit ? 'Edit Service' : 'Add Service'}
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
              <FormInput
                label="Service Name"
                placeholder="e.g., Yoga Class"
                error={errors.name?.message}
                required
                {...register('name', { required: 'Service name is required' })}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your service..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 text-gray-900 transition-all"
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
              
              <FormInput
                label="Category"
                placeholder="e.g., Wellness, Fitness"
                error={errors.category?.message}
                required
                {...register('category', { required: 'Category is required' })}
              />
              
              <FormInput
                label="Price ($)"
                type="number"
                placeholder="50"
                error={errors.price?.message}
                required
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
              />
              
              <FormInput
                label="Duration (minutes)"
                type="number"
                placeholder="60"
                error={errors.durationMinutes?.message}
                required
                {...register('durationMinutes', { 
                  required: 'Duration is required',
                  min: { value: 1, message: 'Duration must be at least 1 minute' }
                })}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Service Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 text-gray-900 transition-all"
                  {...register('image')}
                />
                {service?.image?.url && (
                  <div className="mt-2">
                    <img
                      src={service.image.url}
                      alt="Current service image"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Images (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 text-gray-900 transition-all"
                  {...register('additionalImages')}
                />
                <p className="text-xs text-gray-500 mt-1">Select up to 5 additional images</p>
                {service?.additionalImages && service.additionalImages.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {service.additionalImages.map((img, index) => (
                      <img
                        key={index}
                        src={img.url}
                        alt={`Additional image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  {...register('isActive')}
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active (available for booking)
                </label>
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
                  isEdit ? 'Update Service' : 'Create Service'
                )}
              </button>
            </div>
          </form>
        </div>
    </div>
  );
};

export default ServiceModal;