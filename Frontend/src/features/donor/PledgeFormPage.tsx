import React from 'react';

const PledgeFormPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Make a Pledge</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transform a student's future with your generous support. Every contribution makes a real difference.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">💝</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600">We're building a secure and flexible donation system that maximizes your impact.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">🎯 Flexible Giving Options</h3>
            <p className="text-blue-700 text-sm mb-4">
              Choose how you want to support students with options that fit your budget and preferences.
            </p>
            <div className="space-y-3">
              <div className="bg-white rounded p-3 text-sm">
                <div className="font-medium text-blue-900">One-Time Gift: $500</div>
                <div className="text-blue-600">Covers textbooks for one semester</div>
              </div>
              <div className="bg-white rounded p-3 text-sm">
                <div className="font-medium text-blue-900">Monthly Support: $100</div>
                <div className="text-blue-600">Ongoing living expense assistance</div>
              </div>
              <div className="bg-white rounded p-3 text-sm">
                <div className="font-medium text-blue-900">Goal-Based: $2,000</div>
                <div className="text-blue-600">Fund specific educational goals</div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">🔒 Secure & Transparent</h3>
            <p className="text-green-700 text-sm mb-4">
              Your donations are processed securely with full transparency about how funds are used.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                Bank-level encryption for all transactions
              </div>
              <div className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                Real-time tracking of fund distribution
              </div>
              <div className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                Instant donation receipts for taxes
              </div>
              <div className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                Direct communication with recipients
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">📈 Impact Amplification</h3>
            <p className="text-purple-700 text-sm mb-4">
              See how your donation creates ripple effects that extend far beyond the initial gift.
            </p>
            <div className="bg-white rounded p-3 text-sm text-gray-600">
              <div className="font-medium mb-2">Your $1,000 donation could lead to:</div>
              <div className="space-y-1 text-xs">
                <div>• Student completes degree 2 years earlier</div>
                <div>• $40,000 increase in lifetime earnings</div>
                <div>• Student mentors 5 other students</div>
                <div>• Family moves out of poverty</div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-3">🤝 Building Relationships</h3>
            <p className="text-orange-700 text-sm mb-4">
              Your support creates lasting connections between you and the students you help.
            </p>
            <div className="space-y-2 text-sm text-orange-600">
              <div>📧 Regular progress updates from students</div>
              <div>🎓 Graduation ceremony invitations</div>
              <div>💌 Thank you notes and success stories</div>
              <div>🌟 Optional mentorship opportunities</div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Why This Feature Matters</h3>
            <p className="text-gray-600 text-sm mb-4">
              Education is the most powerful tool for breaking cycles of poverty and creating opportunity. 
              When you support a student, you're not just funding their education—you're investing in their 
              family's future and contributing to a more educated, equitable society.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">85%</div>
                <div className="text-xs text-gray-500">of recipients graduate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">$50K</div>
                <div className="text-xs text-gray-500">avg. salary increase</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">3x</div>
                <div className="text-xs text-gray-500">more likely to give back</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PledgeFormPage;