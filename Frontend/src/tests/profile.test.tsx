import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { ProfileCreatePage } from '@/features/profile/ProfileCreatePage';
import { AuthProvider } from '@/features/auth/AuthContext';
import { storage } from '@/lib/storage';

// Mock auth user
const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'student' as const,
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Profile Management', () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock authenticated user
    storage.setAuth({
      accessToken: 'mock-token',
      user: mockUser,
    });
  });

  describe('ProfileCreatePage', () => {
    it('renders profile creation form with all fields', () => {
      render(<ProfileCreatePage />, { wrapper: TestWrapper });
      
      expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^bio/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/your story/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/school/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/program/i)).toBeInTheDocument();
      expect(screen.getByText(/goal 1/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create profile/i })).toBeInTheDocument();
    });

    it('shows character counters for bio and story', async () => {
      const user = userEvent.setup();
      render(<ProfileCreatePage />, { wrapper: TestWrapper });
      
      const bioTextarea = screen.getByLabelText(/^bio/i);
      await user.type(bioTextarea, 'This is my bio');

      expect(screen.getByText(/14\/500 characters/i)).toBeInTheDocument();
    });

    it('allows adding and removing goals', async () => {
      const user = userEvent.setup();
      render(<ProfileCreatePage />, { wrapper: TestWrapper });
      
      // Initially should have 1 goal
      expect(screen.getByText(/goal 1/i)).toBeInTheDocument();
      expect(screen.queryByText(/goal 2/i)).not.toBeInTheDocument();

      // Add a goal
      const addGoalButton = screen.getByRole('button', { name: /add goal/i });
      await user.click(addGoalButton);

      expect(screen.getByText(/goal 2/i)).toBeInTheDocument();

      // Remove a goal
      const removeButtons = screen.getAllByText(/remove/i);
      await user.click(removeButtons[0]);

      expect(screen.queryByText(/goal 2/i)).not.toBeInTheDocument();
    });

    it('validates required fields', async () => {
      const user = userEvent.setup();
      render(<ProfileCreatePage />, { wrapper: TestWrapper });
      
      const submitButton = screen.getByRole('button', { name: /create profile/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/display name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/bio is required/i)).toBeInTheDocument();
        expect(screen.getByText(/story is required/i)).toBeInTheDocument();
        expect(screen.getByText(/country is required/i)).toBeInTheDocument();
        expect(screen.getByText(/school is required/i)).toBeInTheDocument();
        expect(screen.getByText(/program is required/i)).toBeInTheDocument();
      });
    });

    it('validates goal fields', async () => {
      const user = userEvent.setup();
      render(<ProfileCreatePage />, { wrapper: TestWrapper });
      
      const submitButton = screen.getByRole('button', { name: /create profile/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/goal title is required/i)).toBeInTheDocument();
        expect(screen.getByText(/target amount must be non-negative/i)).toBeInTheDocument();
      });
    });

    it('enforces character limits', async () => {
      const user = userEvent.setup();
      render(<ProfileCreatePage />, { wrapper: TestWrapper });
      
      const bioTextarea = screen.getByLabelText(/^bio/i);
      const longBio = 'a'.repeat(501); // Exceeds 500 character limit
      
      await user.type(bioTextarea, longBio);
      const submitButton = screen.getByRole('button', { name: /create profile/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/bio cannot exceed 500 characters/i)).toBeInTheDocument();
      });
    });

    it('successfully creates profile with valid data', async () => {
      const user = userEvent.setup();
      render(<ProfileCreatePage />, { wrapper: TestWrapper });
      
      // Fill in required fields
      await user.type(screen.getByLabelText(/display name/i), 'John Doe');
      await user.type(screen.getByLabelText(/^bio/i), 'Student seeking funding for education');
      await user.type(screen.getByLabelText(/your story/i), 'I am a dedicated student pursuing my dreams...');
      await user.type(screen.getByLabelText(/country/i), 'United States');
      await user.type(screen.getByLabelText(/school/i), 'University of Technology');
      await user.type(screen.getByLabelText(/program/i), 'Computer Science');
      
      // Fill in goal
      await user.type(screen.getByLabelText(/goal title/i), 'Tuition fees');
      await user.type(screen.getByLabelText(/target amount/i), '5000');

      const submitButton = screen.getByRole('button', { name: /create profile/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/profile created successfully/i)).toBeInTheDocument();
      });
    });
  });
});