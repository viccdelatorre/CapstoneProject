export interface AuthUser {
  id: string;
  email: string;
  role: 'student' | 'donor';
}

export interface AuthState {
  accessToken: string;
  user: AuthUser;
}

export const AUTH_STORAGE_KEY = 'edufund:auth';

export const storage = {
  getAuth(): AuthState | null {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error parsing auth data:', error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  },

  setAuth(authState: AuthState): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  },

  removeAuth(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  clearAll(): void {
    localStorage.clear();
  },
};