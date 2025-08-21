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
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white text-xl">
                {isEdit ? '✏️' : '➕'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {isEdit ? 'Edit Service' : 'Add New Service'}
                </h3>
                <p className="text-blue-100 text-sm">
                  {isEdit ? 'Update service details' : 'Create a new service offering'}
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
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-lg font-semibold text-gray-900">Basic Information</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormInput
                    label="Service Name"
                    placeholder="e.g., Professional Massage Therapy"
                    error={errors.name?.message}
                    required
                    {...register('name', { required: 'Service name is required' })}
                  />
                </div>
                
                <FormInput
                  label="Category"
                  placeholder="e.g., Wellness, Fitness, Beauty"
                  error={errors.category?.message}
                  required
                  {...register('category', { required: 'Category is required' })}
                />
                
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    {...register('isActive')}
                  />
                  <label htmlFor="isActive" className="ml-3 text-sm font-medium text-gray-700">
                    Active (available for booking)
                  </label>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide a detailed description of your service, including what customers can expect..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all resize-none"
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* Pricing & Duration */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <h4 className="text-lg font-semibold text-gray-900">Pricing & Duration</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Price ($)"
                  type="number"
                  placeholder="50.00"
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
              </div>
            </div>

            {/* Images */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h4 className="text-lg font-semibold text-gray-900">Service Images</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Service Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    {...register('image')}
                  />
                  {service?.image?.url && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Current image:</p>
                      <img
                        src={service.image.url}
                        alt="Current service image"
                        className="w-24 h-24 object-cover rounded-lg border shadow-sm"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    {...register('additionalImages')}
                  />
                  <p className="text-xs text-gray-500 mt-1">Select up to 5 additional images to showcase your service</p>
                  {service?.additionalImages && service.additionalImages.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Current additional images:</p>
                      <div className="grid grid-cols-5 gap-2">
                        {service.additionalImages.map((img, index) => (
                          <img
                            key={index}
                            src={img.url}
                            alt={`Additional image ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg border shadow-sm"
                          />
                        ))}
                      </div>
                    </div>
                  )}
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
                      Update Service
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Service
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

export default ServiceModal;