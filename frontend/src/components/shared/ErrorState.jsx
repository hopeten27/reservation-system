const ErrorState = ({ message = 'Something went wrong', onRetry, className = '' }) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="mx-auto w-12 h-12 text-red-500 mb-4">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;