import React from 'react';

const DonorDashboardPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Donor Dashboard</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Track your impact, manage donations, and stay connected with the students you support.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600">We're creating a comprehensive dashboard to help you track and maximize your educational impact.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">📈 Impact Analytics</h3>
            <p className="text-blue-700 text-sm mb-4">
              See the real-world impact of your donations with detailed analytics and success metrics.
            </p>
            <div className="bg-white rounded p-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Students Supported</span>
                  <span className="font-bold text-blue-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Donated</span>
                  <span className="font-bold text-green-600">$8,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Degrees Completed</span>
                  <span className="font-bold text-purple-600">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average GPA</span>
                  <span className="font-bold text-orange-600">3.7</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">💌 Student Updates</h3>
            <p className="text-green-700 text-sm mb-4">
              Receive regular updates from the students you support about their academic progress and milestones.
            </p>
            <div className="space-y-3">
              <div className="bg-white rounded p-3 text-sm">
                <div className="font-medium text-green-900">Sarah Chen</div>
                <div className="text-xs text-gray-500 mb-1">Computer Science, Junior</div>
                <div className="text-green-700">"Just got an internship at Google! Thank you for believing in me."</div>
              </div>
              <div className="bg-white rounded p-3 text-sm">
                <div className="font-medium text-green-900">Marcus Johnson</div>
                <div className="text-xs text-gray-500 mb-1">Pre-Med, Sophomore</div>
                <div className="text-green-700">"Made Dean's List again! Your support makes all the difference."</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">🎯 Giving Management</h3>
            <p className="text-purple-700 text-sm mb-4">
              Manage your donations, set up recurring gifts, and adjust your giving preferences easily.
            </p>
            <div className="space-y-2 text-sm">
              <div className="bg-white rounded p-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-900">Monthly Pledge</span>
                  <span className="font-bold text-purple-600">$250</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Auto-renews monthly</div>
              </div>
              <div className="bg-white rounded p-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-900">Emergency Fund</span>
                  <span className="font-bold text-purple-600">$500</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">For urgent student needs</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-3">🏆 Success Stories</h3>
            <p className="text-orange-700 text-sm mb-4">
              Celebrate the achievements of students you've supported throughout their educational journey.
            </p>
            <div className="bg-white rounded p-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-orange-800 font-bold">
                  JL
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-medium text-orange-900">Jessica Lopez</div>
                  <div className="text-xs text-gray-500">Graduated May 2024 • Engineering</div>
                  <div className="text-orange-700 mt-2">
                    "Now working as a renewable energy engineer, designing solar farms that will power thousands of homes. None of this would have been possible without your support during my studies."
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🤝 Community Impact</h3>
            <p className="text-gray-700 text-sm mb-4">
              See how your collective giving with other donors is transforming entire communities.
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white rounded p-3">
                <div className="text-xl font-bold text-blue-600">127</div>
                <div className="text-xs text-gray-500">Graduates in your area</div>
              </div>
              <div className="bg-white rounded p-3">
                <div className="text-xl font-bold text-green-600">$2.1M</div>
                <div className="text-xs text-gray-500">Community investment</div>
              </div>
              <div className="bg-white rounded p-3">
                <div className="text-xl font-bold text-purple-600">89%</div>
                <div className="text-xs text-gray-500">Employment rate</div>
              </div>
              <div className="bg-white rounded p-3">
                <div className="text-xl font-bold text-orange-600">350+</div>
                <div className="text-xs text-gray-500">Jobs created</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Why This Feature Matters</h3>
            <p className="text-blue-700 text-sm">
              Transparency and connection are crucial for sustainable giving. When donors can see the direct impact 
              of their contributions and build relationships with recipients, they become lifelong advocates for 
              education. This dashboard creates accountability and trust, showing donors that their investment 
              in education creates ripple effects that benefit entire communities for generations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboardPage;