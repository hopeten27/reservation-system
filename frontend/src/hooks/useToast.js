import { useDispatch } from 'react-redux';
import { addToast } from '../store/slices/toastSlice';

export const useToast = () => {
  const dispatch = useDispatch();

  const showToast = (message, type = 'info', duration = 5000) => {
    dispatch(addToast({ message, type, duration }));
  };

  const showSuccess = (message, duration) => showToast(message, 'success', duration);
  const showError = (message, duration) => showToast(message, 'error', duration);
  const showWarning = (message, duration) => showToast(message, 'warning', duration);
  const showInfo = (message, duration) => showToast(message, 'info', duration);

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};