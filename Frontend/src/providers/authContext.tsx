import React, { createContext, useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { supabase } from "@/lib/supabase";  

export type UserRole = "student" | "donor" | "admin";

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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const VITE_USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === "true";

  const login = async (email: string, password: string) => {
    if (VITE_USE_MOCK_AUTH) {
      const mod = await import("@/lib/mockUsers.json");
      const mockUsers = (mod as any).default;

      const found = mockUsers.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!found) throw new Error("Invalid mock credentials");

      const user: User = {
        id: found.id,
        email: found.email,
        name: found.name,
        roles: [found.role],
      };

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("access", "mock-token");
      return user;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) throw new Error(error?.message || "Failed to log in with Supabase");

    const token = data.session.access_token;

    // Verify with Django (sync user)
    const res = await api.post("/auth/login", { access_token: token }); // note trailing slash
    const syncedUser = res.data.user;

    const user: User = {
      id: syncedUser.id,
      email: syncedUser.email,
      name: `${syncedUser.first_name ?? ""} ${syncedUser.last_name ?? ""}`.trim() || syncedUser.email,
      roles: [syncedUser.is_student ? "student" : syncedUser.is_donor ? "donor" : "admin"],
    };

    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("access", token);

    return user;
  };

  //  REGISTER via Supabase (includes metadata)
  const register = async (email: string, password: string, name: string, role: UserRole) => {
    const [firstName, ...lastParts] = name.split(" ");
    const lastName = lastParts.join(" ") || "";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role,
        },
      },
    });

    if (error) throw error;
    console.log("Registered in Supabase:", data.user);

    // Optional: auto-login to Django after registration
    if (data.session?.access_token) {
      await api.post("/auth/login", { access_token: data.session.access_token });
    }
  };

  // LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access");
  };

  // --------------------------------------------------------------------
  // ROLE CHECK
  // --------------------------------------------------------------------
  const hasRole = (role: UserRole) => user?.roles.includes(role) ?? false;

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
