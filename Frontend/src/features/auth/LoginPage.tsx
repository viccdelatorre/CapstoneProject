import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { loginSchema, type LoginFormData } from './authSchemas';
import { authApi } from './api';
import { useAuth } from './useAuth';
import { FormField } from '@/components/FormField';
import { PasswordInput } from '@/components/PasswordInput';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  const redirectTo = searchParams.get('to') || '/profile';
  const isRegistered = searchParams.get('registered') === '1';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data);
      setShowSuccess(true);
      setTimeout(() => {
        navigate(redirectTo);
      }, 1000);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  const passwordValue = watch('password', '');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
            >
              create a new account
            </Link>
          </p>
        </div>

        {isRegistered && (
          <Alert
            type="success"
            title="Registration successful!"
            message="Please sign in with your new account."
            onDismiss={() => {
              searchParams.delete('registered');
              navigate(`/login?${searchParams.toString()}`, { replace: true });
            }}
          />
        )}

        {showSuccess && (
          <Alert
            type="success"
            title="Login successful!"
            message="Redirecting to your dashboard..."
          />
        )}

        {mutation.error && (
          <Alert
            type="error"
            title="Login failed"
            message={
              mutation.error instanceof Error
                ? mutation.error.message
                : 'Please check your credentials and try again.'
            }
          />
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
            >
              <PasswordInput
                value={passwordValue}
                onChange={(value) => setValue('password', value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </FormField>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                type="button"
                className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                disabled
                aria-label="Forgot password feature coming soon"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending && (
                <Spinner size="sm" className="mr-2" aria-label="Signing in" />
              )}
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};