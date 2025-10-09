import React from 'react';

const ReportsPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Analytics & Reports</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Comprehensive insights into platform performance, impact metrics, and data-driven decision making.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">📈</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600">We're building advanced analytics tools to help you understand and optimize the educational impact.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">📊 Impact Dashboard</h3>
            <p className="text-blue-700 text-sm mb-4">
              Real-time visualization of educational outcomes and platform success metrics.
            </p>
            <div className="bg-white rounded p-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Students Funded</span>
                  <span className="font-bold text-blue-600">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Graduation Rate</span>
                  <span className="font-bold text-green-600">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. GPA Increase</span>
                  <span className="font-bold text-purple-600">+0.7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Employment Rate</span>
                  <span className="font-bold text-orange-600">92%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">💰 Financial Analytics</h3>
            <p className="text-green-700 text-sm mb-4">
              Track funding flows, donor patterns, and financial efficiency across the platform.
            </p>
            <div className="space-y-3">
              <div className="bg-white rounded p-3 text-sm">
                <div className="font-medium text-green-900">Monthly Trends</div>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Total Donations</span>
                    <span className="font-bold">$2.4M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Donation Size</span>
                    <span className="font-bold">$285</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Repeat Donors</span>
                    <span className="font-bold">67%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">👥 User Behavior</h3>
            <p className="text-purple-700 text-sm mb-4">
              Understand how students and donors interact with the platform to optimize user experience.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-purple-600">
                <span className="mr-2">📱</span>
                Mobile usage: 73% of sessions
              </div>
              <div className="flex items-center text-purple-600">
                <span className="mr-2">⏱️</span>
                Avg. session: 8.5 minutes
              </div>
              <div className="flex items-center text-purple-600">
                <span className="mr-2">🔄</span>
                Monthly active: 89% retention
              </div>
              <div className="flex items-center text-purple-600">
                <span className="mr-2">⭐</span>
                User satisfaction: 4.8/5
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-3">🎓 Academic Outcomes</h3>
            <p className="text-orange-700 text-sm mb-4">
              Track educational progress and long-term success of funded students.
            </p>
            <div className="bg-white rounded p-3">
              <div className="space-y-3 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">87%</div>
                  <div className="text-xs text-gray-500">Graduation Rate</div>
                </div>
                <div className="border-t pt-2 space-y-1 text-xs">
                  <div>• 15% above national average</div>
                  <div>• 92% employed within 6 months</div>
                  <div>• $12K higher avg. starting salary</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-3">🔍 Predictive Analytics</h3>
            <p className="text-red-700 text-sm mb-4">
              Use machine learning to predict student success and optimize funding allocation.
            </p>
            <div className="space-y-2 text-sm text-red-600">
              <div>📊 Success probability scoring</div>
              <div>🎯 Risk factor identification</div>
              <div>💡 Intervention recommendations</div>
              <div>🔮 Outcome forecasting</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Custom Reports</h3>
            <p className="text-gray-700 text-sm mb-4">
              Generate detailed reports for stakeholders, compliance, and strategic planning.
            </p>
            <div className="space-y-2">
              <div className="bg-white rounded p-2 text-sm">
                <div className="font-medium">Quarterly Impact Report</div>
                <div className="text-xs text-gray-500">For board meetings</div>
              </div>
              <div className="bg-white rounded p-2 text-sm">
                <div className="font-medium">Donor Stewardship Report</div>
                <div className="text-xs text-gray-500">For major contributors</div>
              </div>
              <div className="bg-white rounded p-2 text-sm">
                <div className="font-medium">Compliance Audit Report</div>
                <div className="text-xs text-gray-500">For regulatory requirements</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-yellow-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">🌍 Social Impact Metrics</h3>
            <p className="text-yellow-700 text-sm mb-4">
              Measure the broader societal impact of educational funding beyond individual student success.
            </p>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="bg-white rounded p-4">
                <div className="text-xl font-bold text-blue-600">1,247</div>
                <div className="text-xs text-gray-500 mt-1">Families Impacted</div>
                <div className="text-xs text-blue-500 mt-1">Breaking poverty cycles</div>
              </div>
              <div className="bg-white rounded p-4">
                <div className="text-xl font-bold text-green-600">$8.7M</div>
                <div className="text-xs text-gray-500 mt-1">Economic Value Added</div>
                <div className="text-xs text-green-500 mt-1">Community investment</div>
              </div>
              <div className="bg-white rounded p-4">
                <div className="text-xl font-bold text-purple-600">347</div>
                <div className="text-xs text-gray-500 mt-1">Jobs Created</div>
                <div className="text-xs text-purple-500 mt-1">By funded alumni</div>
              </div>
              <div className="bg-white rounded p-4">
                <div className="text-xl font-bold text-orange-600">23</div>
                <div className="text-xs text-gray-500 mt-1">Communities Served</div>
                <div className="text-xs text-orange-500 mt-1">Geographic reach</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Why This Feature Matters</h3>
            <p className="text-blue-700 text-sm">
              Data drives decisions, and decisions shape futures. Comprehensive analytics help administrators 
              identify which students need the most support, which programs are most effective, and how to 
              optimize the entire platform for maximum educational impact. These insights enable evidence-based 
              improvements, help secure additional funding from institutional donors, and demonstrate to 
              stakeholders that their investment in education is creating measurable, lasting change.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;