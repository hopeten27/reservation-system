import { useEffect } from 'react';
import { useGetMeQuery } from '../store/api/authApi';

const AuthProvider = ({ children }) => {
  const token = localStorage.getItem('token');
  const { isLoading } = useGetMeQuery(undefined, {
    // Only fetch user data if token exists
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  if (isLoading && token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthProvider;