import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { profileCreateSchema, type ProfileCreateFormData } from './profileSchemas';
import { profileApi } from './api';
import { useAuth } from '@/features/auth/useAuth';
import { FormField } from '@/components/FormField';
import { FileDropzone } from '@/components/FileDropzone';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';

export const ProfileCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Check if profile already exists
  const { data: existingProfile, isLoading: checkingProfile } = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: profileApi.getMyProfile,
    retry: false,
  });

  useEffect(() => {
    if (existingProfile) {
      navigate('/profile');
    }
  }, [existingProfile, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<ProfileCreateFormData>({
    resolver: zodResolver(profileCreateSchema),
    defaultValues: {
      displayName: user ? `${user.email.split('@')[0]}` : '',
      goals: [{ title: '', targetAmount: 0, description: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'goals',
  });

  const mutation = useMutation({
    mutationFn: async (data: ProfileCreateFormData) => {
      let profileImageId: string | undefined;

      // Upload profile image first if provided
      if (data.profileImage) {
        const uploadResult = await profileApi.uploadProfileImage(data.profileImage);
        profileImageId = uploadResult.fileId;
      }

      // Create profile
      const { profileImage, ...profileData } = data;
      return profileApi.create({
        ...profileData,
        profileImageId,
      });
    },
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    },
  });

  const onSubmit = (data: ProfileCreateFormData) => {
    mutation.mutate(data);
  };

  const handleImageSelect = (files: File[]) => {
    const file = files[0];
    if (file) {
      setValue('profileImage', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValue('profileImage', undefined);
    setImagePreview(null);
  };

  const bioValue = watch('bio', '');
  const storyValue = watch('story', '');

  if (checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" aria-label="Checking profile status" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Create Your Profile</h1>
              <p className="mt-2 text-gray-600">
                Tell your story and set your educational funding goals.
              </p>
            </div>

            {showSuccess && (
              <Alert
                type="success"
                title="Profile created successfully!"
                message="Redirecting to your profile..."
                className="mb-6"
              />
            )}

            {mutation.error && (
              <Alert
                type="error"
                title="Failed to create profile"
                message={
                  mutation.error instanceof Error
                    ? mutation.error.message
                    : 'An error occurred while creating your profile.'
                }
                className="mb-6"
              />
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                
                <FormField
                  label="Display Name"
                  id="displayName"
                  error={errors.displayName?.message}
                  required
                  hint="This is how your name will appear to donors"
                >
                  <input
                    type="text"
                    {...register('displayName')}
                    placeholder="Enter your display name"
                  />
                </FormField>

                <FormField
                  label="Bio"
                  id="bio"
                  error={errors.bio?.message}
                  required
                  hint={`Brief introduction about yourself (${bioValue.length}/500 characters)`}
                >
                  <textarea
                    rows={3}
                    {...register('bio')}
                    placeholder="Write a brief bio about yourself..."
                    className="input"
                  />
                </FormField>

                <FormField
                  label="Your Story"
                  id="story"
                  error={errors.story?.message}
                  required
                  hint={`Tell your educational journey and aspirations (${storyValue.length}/1500 characters)`}
                >
                  <textarea
                    rows={6}
                    {...register('story')}
                    placeholder="Share your educational background, challenges, and dreams..."
                    className="input"
                  />
                </FormField>
              </div>

              {/* Profile Image */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Image</h2>
                
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="h-24 w-24 rounded-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="btn btn-secondary"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <FileDropzone
                    accept="image/jpeg,image/png,image/jpg"
                    maxSizeBytes={2 * 1024 * 1024} // 2MB
                    onFilesSelected={handleImageSelect}
                    error={errors.profileImage?.message}
                  />
                )}
              </div>

              {/* Educational Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Educational Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Country"
                    id="country"
                    error={errors.country?.message}
                    required
                  >
                    <input
                      type="text"
                      {...register('country')}
                      placeholder="Enter your country"
                    />
                  </FormField>

                  <FormField
                    label="School/University"
                    id="school"
                    error={errors.school?.message}
                    required
                  >
                    <input
                      type="text"
                      {...register('school')}
                      placeholder="Enter your school or university"
                    />
                  </FormField>
                </div>

                <FormField
                  label="Program/Field of Study"
                  id="program"
                  error={errors.program?.message}
                  required
                >
                  <input
                    type="text"
                    {...register('program')}
                    placeholder="e.g., Computer Science, Medicine, etc."
                  />
                </FormField>
              </div>

              {/* Goals */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Funding Goals</h2>
                  {fields.length < 5 && (
                    <button
                      type="button"
                      onClick={() => append({ title: '', targetAmount: 0, description: '' })}
                      className="btn btn-secondary"
                    >
                      Add Goal
                    </button>
                  )}
                </div>

                {errors.goals && (
                  <p className="error-text" role="alert">
                    {errors.goals.message}
                  </p>
                )}

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Goal {index + 1}</h3>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                            aria-label={`Remove goal ${index + 1}`}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Goal Title"
                          id={`goals.${index}.title`}
                          error={errors.goals?.[index]?.title?.message}
                          required
                        >
                          <input
                            type="text"
                            {...register(`goals.${index}.title`)}
                            placeholder="e.g., Tuition fees, Books and supplies"
                          />
                        </FormField>

                        <FormField
                          label="Target Amount ($)"
                          id={`goals.${index}.targetAmount`}
                          error={errors.goals?.[index]?.targetAmount?.message}
                          required
                        >
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            {...register(`goals.${index}.targetAmount`, {
                              valueAsNumber: true,
                            })}
                            placeholder="0.00"
                          />
                        </FormField>
                      </div>

                      <FormField
                        label="Description (optional)"
                        id={`goals.${index}.description`}
                        error={errors.goals?.[index]?.description?.message}
                        hint="Provide additional details about this goal"
                      >
                        <textarea
                          rows={2}
                          {...register(`goals.${index}.description`)}
                          placeholder="Describe how this funding will be used..."
                          className="input"
                        />
                      </FormField>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full btn btn-primary py-3 text-lg"
                >
                  {mutation.isPending && (
                    <Spinner size="sm" className="mr-2" aria-label="Creating profile" />
                  )}
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};