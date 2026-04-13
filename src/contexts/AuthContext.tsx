"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  language: "id" | "en" | "zh";
}

interface AuthContextType {
  user: UserProfile | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  login: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  signOut: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "astrology_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, name?: string) => {
    if (!email || !password) {
      return { success: false, error: "Email and password required" };
    }
    
    const newUser: UserProfile = {
      uid: `user_${Date.now()}`,
      email,
      displayName: name || email.split("@")[0],
      language: "id",
    };
    
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const register = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) {
      return { success: false, error: "All fields required" };
    }
    
    const newUser: UserProfile = {
      uid: `user_${Date.now()}`,
      email,
      displayName: name,
      language: "id",
    };
    
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  // Aliases for compatibility
  const signIn = async (email: string, password: string) => {
    return login(email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    return register(email, password, name);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile: user, isLoading, isConfigured: true, login, register, signIn, signUp, logout, signOut: logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
