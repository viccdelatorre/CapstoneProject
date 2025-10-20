import React, { createContext, useState, useEffect } from 'react';

export type UserRole = 'student' | 'donor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

// export the context so the hook can import it without circular deps
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Use a local JSON file as a very small mock auth store
    const mod = await import('../lib/mockUsers.json');
    const users: Array<any> = (mod as any).default ?? (mod as any);

    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      throw new Error('Invalid credentials');
    }

    const mockUser: User = {
      id: found.id,
      email: found.email,
      name: found.name ?? found.email.split('@')[0],
      roles: [found.role as UserRole],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${found.email}`,
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return mockUser;
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    // Stub implementation
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      roles: [role],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasRole = (role: UserRole) => {
    return user?.roles.includes(role) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
