import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useRegisterMutation } from '../store/api/authApi';
import { registerSchema } from '../schemas/authSchemas';
import FormInput from '../components/shared/FormInput';
import Loader from '../components/shared/Loader';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  const [register, { isLoading }] = useRegisterMutation();
  
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await register(data).unwrap();
      navigate(from, { replace: true });
    } catch (error) {
      // Error handled by toast middleware
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              state={{ from: location.state?.from }}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormInput
              label="Full Name"
              placeholder="Enter your full name"
              error={errors.name?.message}
              required
              {...registerField('name')}
            />
            
            <FormInput
              label="Email address"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              required
              {...registerField('email')}
            />
            
            <FormInput
              label="Password"
              type="password"
              placeholder="Create a password"
              error={errors.password?.message}
              required
              {...registerField('password')}
            />
            
            <FormInput
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              required
              {...registerField('confirmPassword')}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;