// Firebase Auth Context - Real Firebase Authentication
// Fallback to localStorage when Firebase is not configured

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  auth,
  db,
  isFirebaseConfigured,
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  logout as firebaseLogout,
  onAuthChange,
  getUserProfile,
  updateUserProfile,
  UserProfile as FirebaseUserProfile,
} from "@/lib/firebase";

// Re-export UserProfile from firebase
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  language: "id" | "en" | "zh" | "th" | "vi" | "ms" | "ja" | "ko";
}

interface AuthContextType {
  user: UserProfile | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  isFirebaseReady: boolean;
  login: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (language?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  signOut: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = "astrology_user";

// Convert Firebase UserProfile to local format
function toLocalProfile(fp: FirebaseUserProfile): UserProfile {
  return {
    uid: fp.uid,
    email: fp.email,
    displayName: fp.displayName,
    photoURL: fp.photoURL,
    language: (fp.language as UserProfile["language"]) || "zh",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Firebase auth state listener
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthChange(async (firebaseUser) => {
        console.log('[AuthContext] onAuthChange fired, firebaseUser:', firebaseUser ? firebaseUser.uid : null);
        if (firebaseUser) {
          try {
            const fp = await getUserProfile(firebaseUser.uid);
            console.log('[AuthContext] getUserProfile result:', fp ? 'found' : 'null');
            if (fp) {
              const local = toLocalProfile(fp as FirebaseUserProfile);
              setUser(local);
              setProfile(local);
            } else {
              const local: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || "",
                displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
                photoURL: firebaseUser.photoURL,
                language: "zh",
              };
              setUser(local);
              setProfile(local);
            }
          } catch (err) {
            console.error("Get profile error:", err);
          }
        } else {
          console.log('[AuthContext] firebaseUser is null, clearing user');
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      });
      return unsubscribe;
    }

    // Fallback: localStorage only
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
        setProfile(JSON.parse(saved));
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
    if (isFirebaseConfigured) {
      try {
        const fbUser = await loginWithEmail(email, password);
        const fp = await getUserProfile(fbUser.uid);
        const local = toLocalProfile((fp || {
          uid: fbUser.uid, email: fbUser.email || "", displayName: fbUser.displayName || email.split("@")[0], language: "zh",
        }) as FirebaseUserProfile);
        setUser(local);
        setProfile(local);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || "Login failed" };
      }
    }
    // Fallback
    const newUser: UserProfile = {
      uid: `local_${Date.now()}`,
      email,
      displayName: name || email.split("@")[0],
      language: "zh",
    };
    setUser(newUser);
    setProfile(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const register = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) {
      return { success: false, error: "All fields required" };
    }
    if (isFirebaseConfigured) {
      try {
        const fbUser = await registerWithEmail(email, password, name);
        const local = toLocalProfile(fbUser as FirebaseUserProfile);
        setUser(local);
        setProfile(local);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || "Registration failed" };
      }
    }
    // Fallback
    const newUser: UserProfile = {
      uid: `local_${Date.now()}`,
      email,
      displayName: name,
      language: "zh",
    };
    setUser(newUser);
    setProfile(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const signIn = async (email: string, password: string) => login(email, password);
  const signUp = async (email: string, password: string, name: string) => register(email, password, name);

  const loginWithGoogleFn = async (language: string = "zh") => {
    console.log('[AuthContext] loginWithGoogleFn called, isFirebaseConfigured:', isFirebaseConfigured);
    if (isFirebaseConfigured) {
      try {
        console.log('[AuthContext] Calling firebase.loginWithGoogle with language:', language);
        const fp = await loginWithGoogle(language as "id" | "en" | "zh");
        console.log('[AuthContext] firebase.loginWithGoogle returned:', fp ? 'UserProfile' : 'null');
        const local = toLocalProfile(fp as FirebaseUserProfile);
        console.log('[AuthContext] Setting user:', local.email);
        setUser(local);
        setProfile(local);
        return { success: true };
      } catch (err: any) {
        console.error('[AuthContext] loginWithGoogleFn error:', err);
        return { success: false, error: err.message || "Google login failed" };
      }
    }
    // Fallback
    const newUser: UserProfile = {
      uid: `local_google_${Date.now()}`,
      email: "google.user@gmail.com",
      displayName: "Google User",
      language: language as UserProfile["language"],
    };
    setUser(newUser);
    setProfile(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    if (isFirebaseConfigured) {
      firebaseLogout().catch(console.error);
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = async (data: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      setProfile(updated);
      if (isFirebaseConfigured && db) {
        try {
          await updateUserProfile(user.uid, updated);
        } catch (err) {
          console.error("Update profile error:", err);
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isConfigured: true,
        isFirebaseReady: isFirebaseConfigured,
        login,
        register,
        signIn,
        signUp,
        loginWithGoogle: loginWithGoogleFn,
        logout,
        signOut: logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
