import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';

export const Navigation: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return null; // Don't show navigation when not logged in
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navLinks = [
    // Core Student Features
    { path: '/profile', label: 'My Profile', icon: '👤', status: 'Live' },
    { path: '/uploads', label: 'Upload Docs', icon: '📄', status: 'Live' },
    
    // Donor Features
    { path: '/donor/discover', label: 'Discover Students', icon: '🔍', status: 'Coming Soon' },
    { path: '/donor/pledge', label: 'Make Pledge', icon: '💝', status: 'Coming Soon' },
    { path: '/donor/dashboard', label: 'Donor Dashboard', icon: '📊', status: 'Coming Soon' },
    
    // Admin Features
    { path: '/admin', label: 'Admin', icon: '⚙️', status: 'Coming Soon' },
    { path: '/admin/verification', label: 'Verification Queue', icon: '📋', status: 'Coming Soon' },
    
    // Reports
    { path: '/reports', label: 'Reports', icon: '📈', status: 'Beta' },
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      'Live': 'bg-green-100 text-green-800',
      'Coming Soon': 'bg-blue-100 text-blue-800', 
      'Beta': 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${colors[status as keyof typeof colors]} ml-2`}>
        {status}
      </span>
    );
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/profile" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-primary-600">🎓</div>
              <span className="text-xl font-bold text-gray-900">EduFund</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                } ${link.status === 'Coming Soon' ? 'opacity-75' : ''}`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
                {getStatusBadge(link.status)}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-sm text-gray-600">
              Welcome, {user?.email?.split('@')[0]}
            </div>
            <button
              onClick={logout}
              className="btn btn-secondary text-sm"
            >
              Logout
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  } ${link.status === 'Coming Soon' ? 'opacity-75' : ''}`}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                  {getStatusBadge(link.status)}
                </Link>
              ))}
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="px-3 py-2 text-sm text-gray-600">
                  {user?.email}
                </div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </nav>
  );
};