import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterFormData } from './authSchemas';
import { authApi } from './api';
import { useAuth } from './useAuth';
import { FormField } from '@/components/FormField';
import { PasswordInput } from '@/components/PasswordInput';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'student',
    },
  });

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async (data) => {
      setShowSuccess(true);
      // Auto-login after successful registration
      try {
        const loginData = await authApi.login({
          email: watch('email'),
          password: watch('password'),
        });
        login(loginData);
        setTimeout(() => {
          navigate('/profile/new');
        }, 1000);
      } catch (error) {
        // If auto-login fails, redirect to login page
        setTimeout(() => {
          navigate('/login?registered=1');
        }, 1000);
      }
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...submitData } = data;
    mutation.mutate(submitData);
  };

  const passwordValue = watch('password', '');
  const confirmPasswordValue = watch('confirmPassword', '');

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
              className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {showSuccess && (
          <Alert
            type="success"
            title="Registration successful!"
            message="Setting up your account..."
          />
        )}

        {mutation.error && (
          <Alert
            type="error"
            title="Registration failed"
            message={
              mutation.error instanceof Error
                ? mutation.error.message
                : 'An error occurred during registration. Please try again.'
            }
          />
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="First name"
                id="firstName"
                error={errors.firstName?.message}
                required
              >
                <input
                  type="text"
                  autoComplete="given-name"
                  {...register('firstName')}
                  placeholder="First name"
                />
              </FormField>

              <FormField
                label="Last name"
                id="lastName"
                error={errors.lastName?.message}
                required
              >
                <input
                  type="text"
                  autoComplete="family-name"
                  {...register('lastName')}
                  placeholder="Last name"
                />
              </FormField>
            </div>

            <FormField
              label="Email address"
              id="email"
              error={errors.email?.message}
              required
            >
              <input
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder="Enter your email"
              />
            </FormField>

            <FormField
              label="Password"
              id="password"
              error={errors.password?.message}
              required
              hint="Must be at least 8 characters with uppercase, lowercase, and a number"
            >
              <PasswordInput
                value={passwordValue}
                onChange={(value) => setValue('password', value)}
                placeholder="Create a password"
                autoComplete="new-password"
              />
            </FormField>

            <FormField
              label="Confirm password"
              id="confirmPassword"
              error={errors.confirmPassword?.message}
              required
            >
              <PasswordInput
                value={confirmPasswordValue}
                onChange={(value) => setValue('confirmPassword', value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </FormField>

            <FormField
              label="I am a"
              id="role"
              error={errors.role?.message}
              required
            >
              <select {...register('role')}>
                <option value="student">Student seeking funding</option>
                <option value="donor">Donor wanting to help</option>
              </select>
            </FormField>
          </div>

          <div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending && (
                <Spinner size="sm" className="mr-2" aria-label="Creating account" />
              )}
              Create account
            </button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </div>
        </form>
      </div>
    </div>
  );
};