import React from 'react';

const DonorDiscoverPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Discover Students</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find inspiring students to support based on their stories, academic goals, and financial needs.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">�</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600">We're building an intelligent matching system to help you find students that align with your values and interests.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">🎯 Smart Filtering</h3>
            <p className="text-blue-700 text-sm mb-4">
              Filter by field of study, location, funding needs, and more to find students that match your interests.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-blue-600">
                <span className="mr-2">•</span>
                Computer Science majors in California
              </div>
              <div className="flex items-center text-blue-600">
                <span className="mr-2">•</span>
                First-generation college students
              </div>
              <div className="flex items-center text-blue-600">
                <span className="mr-2">•</span>
                Students studying renewable energy
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">📖 Personal Stories</h3>
            <p className="text-green-700 text-sm mb-4">
              Read authentic stories about students' backgrounds, challenges, and dreams for the future.
            </p>
            <div className="bg-white rounded p-3 text-sm text-gray-600 italic">
              "Growing up in a small farming town, I never imagined I could study environmental science. With your support, I'm developing sustainable farming techniques that could help my community..."
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">📊 Impact Tracking</h3>
            <p className="text-purple-700 text-sm mb-4">
              See exactly how your donation will be used and track the student's academic progress.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-purple-600">
                <span>Tuition</span>
                <span>$3,200</span>
              </div>
              <div className="flex justify-between text-purple-600">
                <span>Books & Supplies</span>
                <span>$800</span>
              </div>
              <div className="flex justify-between text-purple-600">
                <span>Living Expenses</span>
                <span>$1,000</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-3">🌟 Success Stories</h3>
            <p className="text-orange-700 text-sm mb-4">
              Connect with past recipients who've graduated and are making a difference in their fields.
            </p>
            <div className="bg-white rounded p-3 text-sm text-gray-600">
              <div className="font-medium">Maria Garcia, Class of 2023</div>
              <div className="text-xs text-gray-500">Now working as a pediatric nurse</div>
              <div className="mt-2 italic">"Thanks to donors like you, I'm now helping children in underserved communities get the healthcare they need."</div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Why This Feature Matters</h3>
            <p className="text-gray-600 text-sm">
              Connecting donors with students they care about creates meaningful relationships that go beyond financial support. 
              When donors can see the impact of their contribution on a real person's life, they're more likely to continue 
              supporting education and even become mentors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDiscoverPage;