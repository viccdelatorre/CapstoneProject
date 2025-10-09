import React from 'react';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Comprehensive platform oversight with tools to manage users, monitor activity, and ensure program integrity.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">⚙️</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600">We're building powerful administrative tools to help you manage and scale the education funding platform.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">👥 User Management</h3>
            <p className="text-blue-700 text-sm mb-4">
              Comprehensive user oversight with role-based permissions and account lifecycle management.
            </p>
            <div className="space-y-3">
              <div className="bg-white rounded p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Students</span>
                  <span className="font-bold text-blue-600">1,247</span>
                </div>
              </div>
              <div className="bg-white rounded p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Donors</span>
                  <span className="font-bold text-green-600">324</span>
                </div>
              </div>
              <div className="bg-white rounded p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Verifications</span>
                  <span className="font-bold text-orange-600">43</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">📊 Platform Analytics</h3>
            <p className="text-green-700 text-sm mb-4">
              Real-time insights into platform usage, funding trends, and success metrics.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-green-600">
                <span className="mr-2">📈</span>
                Weekly growth: +12% new users
              </div>
              <div className="flex items-center text-green-600">
                <span className="mr-2">💰</span>
                Total funds raised: $2.4M
              </div>
              <div className="flex items-center text-green-600">
                <span className="mr-2">🎓</span>
                Success rate: 87% graduation
              </div>
              <div className="flex items-center text-green-600">
                <span className="mr-2">⚡</span>
                Platform uptime: 99.9%
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">🔒 Security & Compliance</h3>
            <p className="text-purple-700 text-sm mb-4">
              Advanced security monitoring and compliance tools to protect user data and financial transactions.
            </p>
            <div className="space-y-2 text-sm text-purple-600">
              <div>🛡️ Real-time fraud detection</div>
              <div>📋 Automated compliance reporting</div>
              <div>🔐 Multi-factor authentication</div>
              <div>📱 Suspicious activity alerts</div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-3">📋 Content Moderation</h3>
            <p className="text-orange-700 text-sm mb-4">
              AI-powered content review with human oversight to maintain platform quality and safety.
            </p>
            <div className="bg-white rounded p-3 text-sm">
              <div className="font-medium text-orange-900 mb-2">Recent Activity</div>
              <div className="space-y-1 text-xs">
                <div>• 12 profiles flagged for review</div>
                <div>• 3 documents need verification</div>
                <div>• 1 funding goal adjusted</div>
                <div>• 27 thank you messages approved</div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-3">🚨 Issue Management</h3>
            <p className="text-red-700 text-sm mb-4">
              Centralized system for handling user reports, disputes, and platform issues.
            </p>
            <div className="space-y-2">
              <div className="bg-white rounded p-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-red-700">Critical Issues</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">2</span>
                </div>
              </div>
              <div className="bg-white rounded p-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-orange-700">Open Tickets</span>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">17</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">⚡ System Performance</h3>
            <p className="text-gray-700 text-sm mb-4">
              Monitor platform performance, server health, and user experience metrics.
            </p>
            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              <div className="bg-white rounded p-2">
                <div className="font-bold text-green-600">2.1s</div>
                <div className="text-xs text-gray-500">Avg Load Time</div>
              </div>
              <div className="bg-white rounded p-2">
                <div className="font-bold text-blue-600">99.9%</div>
                <div className="text-xs text-gray-500">Uptime</div>
              </div>
              <div className="bg-white rounded p-2">
                <div className="font-bold text-purple-600">1,247</div>
                <div className="text-xs text-gray-500">Active Users</div>
              </div>
              <div className="bg-white rounded p-2">
                <div className="font-bold text-orange-600">0.02%</div>
                <div className="text-xs text-gray-500">Error Rate</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Why This Feature Matters</h3>
            <p className="text-gray-600 text-sm">
              A robust admin dashboard is crucial for maintaining trust and scalability in a financial platform. 
              It ensures that every dollar donated reaches legitimate students, that user data is protected, 
              and that the platform can grow sustainably. With proper oversight tools, administrators can 
              prevent fraud, ensure compliance, and maintain the high standards that both students and donors expect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;