import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../store/slices/toastSlice';

const NotificationToast = () => {
  const { toasts } = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.duration) {
        setTimeout(() => {
          dispatch(removeToast(toast.id));
        }, toast.duration);
      }
    });
  }, [toasts, dispatch]);

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type)} px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-80 animate-in slide-in-from-right duration-300`}
        >
          <span className="text-lg">{getIcon(toast.type)}</span>
          <div className="flex-1">
            {toast.title && (
              <div className="font-semibold">{toast.title}</div>
            )}
            <div className={toast.title ? 'text-sm opacity-90' : ''}>
              {toast.message}
            </div>
          </div>
          <button
            onClick={() => dispatch(removeToast(toast.id))}
            className="text-white hover:text-gray-200 ml-4"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;