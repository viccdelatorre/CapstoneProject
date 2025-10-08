import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { profileApi } from './api';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';

export const ProfileViewPage: React.FC = () => {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: profileApi.getMyProfile,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" aria-label="Loading profile" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert
            type="error"
            title="Failed to load profile"
            message="There was an error loading your profile. Please try refreshing the page."
          />
          <div className="mt-6 text-center">
            <Link
              to="/profile/new"
              className="btn btn-primary"
            >
              Create Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to EduFund!
            </h1>
            <p className="text-gray-600 mb-8">
              Create your profile to start your educational funding journey.
            </p>
            <Link
              to="/profile/new"
              className="btn btn-primary"
            >
              Create Your Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalFunding = profile.goals.reduce((sum, goal) => sum + goal.targetAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 px-6 py-8">
            <div className="flex items-center space-x-6">
              {profile.profileImageId ? (
                <img
                  src={`/api/files/${profile.profileImageId}`}
                  alt={`${profile.displayName}'s profile`}
                  className="h-24 w-24 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full border-4 border-white bg-white flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600">
                    {profile.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-white">{profile.displayName}</h1>
                <p className="text-primary-100 mt-1">{profile.program} at {profile.school}</p>
                <p className="text-primary-100">{profile.country}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8 space-y-8">
            {/* Bio */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About Me</h2>
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>

            {/* Story */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">My Story</h2>
              <div className="prose prose-lg text-gray-700">
                <p className="whitespace-pre-wrap leading-relaxed">{profile.story}</p>
              </div>
            </div>

            {/* Goals */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Funding Goals</h2>
                <div className="text-sm text-gray-500">
                  Total needed: <span className="font-medium text-gray-900">${totalFunding.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="grid gap-6">
                {profile.goals.map((goal, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900">{goal.title}</h3>
                      <span className="text-xl font-bold text-primary-600">
                        ${goal.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    
                    {goal.description && (
                      <p className="text-gray-600 mb-4">{goal.description}</p>
                    )}
                    
                    {/* Progress bar placeholder */}
                    <div className="bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-primary-600 h-2 rounded-full w-0"></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>$0 raised</span>
                      <span>0% funded</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/uploads"
                  className="btn btn-primary flex-1 text-center"
                >
                  Upload Verification Documents
                </Link>
                <button
                  type="button"
                  className="btn btn-secondary flex-1"
                  disabled
                >
                  Share Profile (Coming Soon)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-primary-600">{profile.goals.length}</div>
            <div className="text-gray-600">Funding Goals</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600">$0</div>
            <div className="text-gray-600">Total Raised</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">0</div>
            <div className="text-gray-600">Supporters</div>
          </div>
        </div>
      </div>
    </div>
  );
};