import { isRejectedWithValue } from '@reduxjs/toolkit';
import { addToast } from '../store/slices/toastSlice';

export const toastMiddleware = (api) => (next) => (action) => {
  // Handle RTK Query errors
  if (isRejectedWithValue(action)) {
    const error = action.payload;
    let message = 'An error occurred';
    
    if (error?.data?.error?.message) {
      message = error.data.error.message;
    } else if (error?.error) {
      message = error.error;
    } else if (error?.message) {
      message = error.message;
    }
    
    api.dispatch(addToast({
      message,
      type: 'error',
      duration: 5000,
    }));
  }

  // Handle successful mutations
  if (action.type.endsWith('/fulfilled') && action.type.includes('mutation')) {
    const payload = action.payload;
    
    if (payload?.success) {
      let message = 'Operation completed successfully';
      
      // Customize messages based on action type
      if (action.type.includes('login')) {
        message = 'Logged in successfully';
      } else if (action.type.includes('register')) {
        message = 'Account created successfully';
      } else if (action.type.includes('logout')) {
        message = 'Logged out successfully';
      } else if (action.type.includes('createBooking')) {
        message = 'Booking created successfully';
      } else if (action.type.includes('cancelBooking')) {
        message = 'Booking cancelled successfully';
      } else if (action.type.includes('createService')) {
        message = 'Service created successfully';
      } else if (action.type.includes('updateService')) {
        message = 'Service updated successfully';
      } else if (action.type.includes('deleteService')) {
        message = 'Service deleted successfully';
      }
      
      api.dispatch(addToast({
        message,
        type: 'success',
        duration: 3000,
      }));
    }
  }

  return next(action);
};