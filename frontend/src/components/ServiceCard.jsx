import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {service.image?.url && (
        <img
          src={service.image.url}
          alt={service.name}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {service.name}
          </h3>
          <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
            ${service.price}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>{service.durationMinutes} minutes</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            service.isActive 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {service.isActive ? 'Available' : 'Unavailable'}
          </span>
        </div>
        
        <Link
          to={`/services/${service._id}`}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium transition-colors text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;