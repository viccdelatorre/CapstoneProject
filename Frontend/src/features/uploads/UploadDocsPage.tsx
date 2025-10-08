import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { uploadApi } from './api';
import { UploadFileResponse } from './types';
import { FileDropzone } from '@/components/FileDropzone';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';

interface UploadedFile {
  file: File;
  uploadedData?: UploadFileResponse;
  progress: number;
  error?: string;
}

export const UploadDocsPage: React.FC = () => {
  const navigate = useNavigate();
  const [schoolLetter, setSchoolLetter] = useState<UploadedFile | null>(null);
  const [transcript, setTranscript] = useState<UploadedFile | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: 'schoolLetter' | 'transcript' }) => {
      const setProgress = (progress: number) => {
        if (type === 'schoolLetter') {
          setSchoolLetter(prev => prev ? { ...prev, progress } : null);
        } else {
          setTranscript(prev => prev ? { ...prev, progress } : null);
        }
      };

      const result = await uploadApi.uploadFile(file, setProgress);
      return { result, type };
    },
    onSuccess: ({ result, type }) => {
      if (type === 'schoolLetter') {
        setSchoolLetter(prev => prev ? { ...prev, uploadedData: result, progress: 100 } : null);
      } else {
        setTranscript(prev => prev ? { ...prev, uploadedData: result, progress: 100 } : null);
      }
    },
    onError: (error, { type }) => {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      if (type === 'schoolLetter') {
        setSchoolLetter(prev => prev ? { ...prev, error: errorMessage, progress: 0 } : null);
      } else {
        setTranscript(prev => prev ? { ...prev, error: errorMessage, progress: 0 } : null);
      }
    },
  });

  const verificationMutation = useMutation({
    mutationFn: uploadApi.submitVerification,
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    },
  });

  const handleSchoolLetterSelect = (files: File[]) => {
    const file = files[0];
    if (file) {
      setSchoolLetter({ file, progress: 0 });
      uploadMutation.mutate({ file, type: 'schoolLetter' });
    }
  };

  const handleTranscriptSelect = (files: File[]) => {
    const file = files[0];
    if (file) {
      setTranscript({ file, progress: 0 });
      uploadMutation.mutate({ file, type: 'transcript' });
    }
  };

  const removeSchoolLetter = () => {
    setSchoolLetter(null);
  };

  const removeTranscript = () => {
    setTranscript(null);
  };

  const handleSubmitVerification = () => {
    if (schoolLetter?.uploadedData && transcript?.uploadedData) {
      verificationMutation.mutate({
        schoolLetterId: schoolLetter.uploadedData.fileId,
        transcriptId: transcript.uploadedData.fileId,
      });
    }
  };

  const canSubmit = schoolLetter?.uploadedData && transcript?.uploadedData && !uploadMutation.isPending;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg">
          <div className="px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Upload Verification Documents</h1>
              <p className="mt-2 text-gray-600">
                Upload your school letter and academic transcript to verify your student status.
              </p>
            </div>

            {showSuccess && (
              <Alert
                type="success"
                title="Documents submitted successfully!"
                message="Your verification documents have been submitted for review. You'll be notified once the review is complete."
                className="mb-6"
              />
            )}

            {verificationMutation.error && (
              <Alert
                type="error"
                title="Submission failed"
                message={
                  verificationMutation.error instanceof Error
                    ? verificationMutation.error.message
                    : 'Failed to submit verification documents. Please try again.'
                }
                className="mb-6"
              />
            )}

            <div className="space-y-8">
              {/* School Letter Upload */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">School Letter</h2>
                  <p className="text-sm text-gray-600">
                    Official letter from your school confirming your enrollment status.
                  </p>
                </div>

                {!schoolLetter ? (
                  <FileDropzone
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxSizeBytes={5 * 1024 * 1024} // 5MB
                    onFilesSelected={handleSchoolLetterSelect}
                  />
                ) : (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{schoolLetter.file.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(schoolLetter.file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeSchoolLetter}
                        className="text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                        aria-label="Remove school letter"
                      >
                        Remove
                      </button>
                    </div>

                    {schoolLetter.progress > 0 && schoolLetter.progress < 100 && (
                      <div className="mb-3">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${schoolLetter.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{schoolLetter.progress}% uploaded</p>
                      </div>
                    )}

                    {schoolLetter.uploadedData && (
                      <div className="flex items-center text-green-600">
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Upload complete</span>
                      </div>
                    )}

                    {schoolLetter.error && (
                      <div className="text-red-600 text-sm">{schoolLetter.error}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Transcript Upload */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Academic Transcript</h2>
                  <p className="text-sm text-gray-600">
                    Official academic transcript or grade report from your institution.
                  </p>
                </div>

                {!transcript ? (
                  <FileDropzone
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxSizeBytes={5 * 1024 * 1024} // 5MB
                    onFilesSelected={handleTranscriptSelect}
                  />
                ) : (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{transcript.file.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(transcript.file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeTranscript}
                        className="text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                        aria-label="Remove transcript"
                      >
                        Remove
                      </button>
                    </div>

                    {transcript.progress > 0 && transcript.progress < 100 && (
                      <div className="mb-3">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${transcript.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{transcript.progress}% uploaded</p>
                      </div>
                    )}

                    {transcript.uploadedData && (
                      <div className="flex items-center text-green-600">
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Upload complete</span>
                      </div>
                    )}

                    {transcript.error && (
                      <div className="text-red-600 text-sm">{transcript.error}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleSubmitVerification}
                  disabled={!canSubmit || verificationMutation.isPending}
                  className="w-full btn btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verificationMutation.isPending && (
                    <Spinner size="sm" className="mr-2" aria-label="Submitting documents" />
                  )}
                  Submit for Verification
                </button>

                {!canSubmit && (
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    Please upload both documents before submitting
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">Document Requirements</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• <strong>School Letter:</strong> Official letter on school letterhead confirming your enrollment</li>
            <li>• <strong>Transcript:</strong> Official academic transcript or current grade report</li>
            <li>• <strong>Format:</strong> PDF, JPG, or PNG files up to 5MB each</li>
            <li>• <strong>Quality:</strong> Ensure documents are clear and legible</li>
            <li>• <strong>Processing:</strong> Verification typically takes 2-3 business days</li>
          </ul>
        </div>
      </div>
    </div>
  );
};