// Auth Context — Firebase lazy-loaded for performance
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

// Lazy load Firebase only when needed
let firebaseModule: any = null;
async function getFirebase() {
  if (firebaseModule) return firebaseModule;
  try {
    firebaseModule = await import("@/lib/firebase");
  } catch {
    firebaseModule = null;
  }
  return firebaseModule;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  // Lightweight init: check localStorage only, defer Firebase
  useEffect(() => {
    const init = async () => {
      const fb = await getFirebase();
      if (fb?.isFirebaseConfigured) {
        setIsConfigured(true);
        fb.onAuthChange(async (firebaseUser: any) => {
          if (firebaseUser) {
            try {
              const fp = await fb.getUserProfile(firebaseUser.uid);
              if (fp) {
                const local: UserProfile = { uid: fp.uid, email: fp.email, displayName: fp.displayName, photoURL: fp.photoURL, language: fp.language || "zh" };
                setUser(local); setProfile(local);
              } else {
                const local: UserProfile = { uid: firebaseUser.uid, email: firebaseUser.email || "", displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User", photoURL: firebaseUser.photoURL, language: "zh" };
                setUser(local); setProfile(local);
              }
            } catch (err) { console.error("Get profile error:", err); }
          } else {
            setUser(null); setProfile(null);
          }
          setIsLoading(false);
        });
      } else {
        // Fallback: localStorage only
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try { const u = JSON.parse(saved); setUser(u); setProfile(u); } catch { localStorage.removeItem(STORAGE_KEY); }
        }
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string, name?: string) => {
    if (!email || !password) return { success: false, error: "Email and password required" };
    try {
      const fb = await getFirebase();
      if (fb?.isFirebaseConfigured) {
        const fbUser = await fb.loginWithEmail(email, password);
        const fp = await fb.getUserProfile(fbUser.uid);
        const local: UserProfile = { uid: fbUser.uid, email: fbUser.email || "", displayName: fbUser.displayName || email.split("@")[0], language: "zh" };
        if (fp) { local.displayName = fp.displayName; local.language = fp.language || "zh"; }
        setUser(local); setProfile(local); return { success: true };
      }
    } catch (err: any) { return { success: false, error: err.message || "Login failed" }; }
    const newUser: UserProfile = { uid: `local_${Date.now()}`, email, displayName: name || email.split("@")[0], language: "zh" };
    setUser(newUser); setProfile(newUser); localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const register = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) return { success: false, error: "All fields required" };
    try {
      const fb = await getFirebase();
      if (fb?.isFirebaseConfigured) {
        const fbUser = await fb.registerWithEmail(email, password, name);
        const local: UserProfile = { uid: fbUser.uid, email: fbUser.email || email, displayName: name, language: "zh" };
        setUser(local); setProfile(local); return { success: true };
      }
    } catch (err: any) { return { success: false, error: err.message || "Registration failed" }; }
    const newUser: UserProfile = { uid: `local_${Date.now()}`, email, displayName: name, language: "zh" };
    setUser(newUser); setProfile(newUser); localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const signIn = async (email: string, password: string) => login(email, password);
  const signUp = async (email: string, password: string, name: string) => register(email, password, name);

  const loginWithGoogleFn = async (language: string = "zh") => {
    try {
      const fb = await getFirebase();
      if (fb?.isFirebaseConfigured) {
        const fp = await fb.loginWithGoogle(language as "id" | "en" | "zh");
        const local: UserProfile = { uid: fp.uid, email: fp.email, displayName: fp.displayName, photoURL: fp.photoURL, language: fp.language || "zh" };
        setUser(local); setProfile(local); return { success: true };
      }
    } catch (err: any) { return { success: false, error: err.message || "Google login failed" }; }
    const newUser: UserProfile = { uid: `local_google_${Date.now()}`, email: "google.user@gmail.com", displayName: "Google User", language: language as UserProfile["language"] };
    setUser(newUser); setProfile(newUser); localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const logout = async () => {
    try {
      const fb = await getFirebase();
      if (fb?.isFirebaseConfigured) fb.logout().catch(console.error);
    } catch {}
    setUser(null); setProfile(null); localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = async (data: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated); setProfile(updated);
      try {
        const fb = await getFirebase();
        if (fb?.isFirebaseConfigured && fb.db) await fb.updateUserProfile(user.uid, updated);
        else localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) { console.error("Update error:", err); }
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, isConfigured: true, isFirebaseReady: isConfigured, login, register, signIn, signUp, loginWithGoogle: loginWithGoogleFn, logout, signOut: logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
