import React from 'react';

const VerificationQueuePage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Verification Queue</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Review and verify student documents to ensure program integrity and prevent fraud.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600">We're developing a comprehensive verification system to maintain the highest standards of authenticity.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">🔍 Document Review</h3>
            <p className="text-blue-700 text-sm mb-4">
              Streamlined interface for reviewing transcripts, enrollment letters, and identity documents.
            </p>
            <div className="space-y-3">
              <div className="bg-white rounded p-3 border-l-4 border-red-400">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-sm">Sarah Johnson - Transcript</div>
                    <div className="text-xs text-gray-500">Submitted 2 hours ago</div>
                  </div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">High Priority</span>
                </div>
              </div>
              <div className="bg-white rounded p-3 border-l-4 border-yellow-400">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-sm">Marcus Chen - School Letter</div>
                    <div className="text-xs text-gray-500">Submitted 1 day ago</div>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Standard</span>
                </div>
              </div>
              <div className="bg-white rounded p-3 border-l-4 border-green-400">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-sm">Emily Rodriguez - ID</div>
                    <div className="text-xs text-gray-500">Submitted 3 days ago</div>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Verified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">⚡ AI-Assisted Verification</h3>
            <p className="text-green-700 text-sm mb-4">
              Machine learning algorithms pre-screen documents for authenticity and flag potential issues.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                Automatic document type detection
              </div>
              <div className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                Forgery pattern recognition
              </div>
              <div className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                Institution database verification
              </div>
              <div className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                Anomaly detection algorithms
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">🎯 Verification Metrics</h3>
            <p className="text-purple-700 text-sm mb-4">
              Track verification performance and maintain quality standards across all reviewers.
            </p>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white rounded p-3">
                <div className="text-xl font-bold text-purple-600">143</div>
                <div className="text-xs text-gray-500">Pending Reviews</div>
              </div>
              <div className="bg-white rounded p-3">
                <div className="text-xl font-bold text-green-600">97%</div>
                <div className="text-xs text-gray-500">Accuracy Rate</div>
              </div>
              <div className="bg-white rounded p-3">
                <div className="text-xl font-bold text-blue-600">4.2h</div>
                <div className="text-xs text-gray-500">Avg Review Time</div>
              </div>
              <div className="bg-white rounded p-3">
                <div className="text-xl font-bold text-orange-600">2.1%</div>
                <div className="text-xs text-gray-500">Rejection Rate</div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-3">📞 Student Communication</h3>
            <p className="text-orange-700 text-sm mb-4">
              Built-in messaging system to request additional information or clarify document details.
            </p>
            <div className="bg-white rounded p-3 text-sm">
              <div className="font-medium text-orange-900 mb-2">Recent Messages</div>
              <div className="space-y-2 text-xs">
                <div className="border-b pb-1">
                  <span className="font-medium">To Alex Kim:</span> "Please provide a clearer scan of your transcript. The GPA section is not legible."
                </div>
                <div className="border-b pb-1">
                  <span className="font-medium">To Maria Santos:</span> "Your enrollment letter looks great! Just need to confirm your major field."
                </div>
                <div>
                  <span className="font-medium">To David Lee:</span> "Documents approved! Welcome to the platform."
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-3">🚨 Fraud Prevention</h3>
            <p className="text-red-700 text-sm mb-4">
              Advanced fraud detection protects both donors and legitimate students from bad actors.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded p-4 text-center">
                <div className="text-xl font-bold text-red-600">$47K</div>
                <div className="text-xs text-gray-500 mt-1">Fraud Prevented</div>
                <div className="text-xs text-red-500 mt-1">Last 30 days</div>
              </div>
              <div className="bg-white rounded p-4 text-center">
                <div className="text-xl font-bold text-orange-600">23</div>
                <div className="text-xs text-gray-500 mt-1">Accounts Flagged</div>
                <div className="text-xs text-orange-500 mt-1">Under investigation</div>
              </div>
              <div className="bg-white rounded p-4 text-center">
                <div className="text-xl font-bold text-green-600">99.7%</div>
                <div className="text-xs text-gray-500 mt-1">Legitimate Students</div>
                <div className="text-xs text-green-500 mt-1">Platform integrity</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Why This Feature Matters</h3>
            <p className="text-gray-600 text-sm">
              Trust is the foundation of any donation platform. The verification queue ensures that every 
              student on the platform is legitimate, every document is authentic, and every dollar donated 
              goes to real educational needs. Without robust verification, donor confidence would erode, 
              and the entire platform would fail. This system protects both students and donors while 
              maintaining the integrity that makes educational crowdfunding possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationQueuePage;