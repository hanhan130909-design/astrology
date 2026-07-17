"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { loadFirebaseClient } from "@/lib/loadFirebaseClient";

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

interface FirebaseProfileShape {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  language?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = "astrology_user";

function toLocalProfile(firebaseProfile: FirebaseProfileShape): UserProfile {
  return {
    uid: firebaseProfile.uid,
    email: firebaseProfile.email,
    displayName: firebaseProfile.displayName,
    photoURL: firebaseProfile.photoURL ?? undefined,
    language: (firebaseProfile.language as UserProfile["language"]) || "zh",
  };
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message) return message;
  }
  return fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    const restoreLocalProfile = () => {
      if (!active) return;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const local = JSON.parse(saved) as UserProfile;
          setUser(local);
          setProfile(local);
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      setIsLoading(false);
    };

    void loadFirebaseClient().then((firebase) => {
      if (!active) return;
      setIsFirebaseReady(firebase.isFirebaseConfigured);

      if (!firebase.isFirebaseConfigured || !firebase.auth) {
        restoreLocalProfile();
        return;
      }

      unsubscribe = firebase.onAuthChange(async (firebaseUser) => {
        if (!active) return;
        if (firebaseUser) {
          try {
            const firebaseProfile = await firebase.getUserProfile(firebaseUser.uid);
            if (!active) return;
            const local = firebaseProfile
              ? toLocalProfile(firebaseProfile)
              : toLocalProfile({
                uid: firebaseUser.uid,
                email: firebaseUser.email || "",
                displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
                photoURL: firebaseUser.photoURL,
                language: "zh",
              });
            setUser(local);
            setProfile(local);
          } catch (error: unknown) {
            console.error("Get profile error:", error);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        if (active) setIsLoading(false);
      });
    }).catch((error: unknown) => {
      console.error("Firebase client load error:", error);
      if (active) {
        setIsFirebaseReady(false);
        restoreLocalProfile();
      }
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const login = async (email: string, password: string, name?: string) => {
    if (!email || !password) return { success: false, error: "Email and password required" };
    try {
      const firebase = await loadFirebaseClient();
      if (firebase.isFirebaseConfigured) {
        const firebaseUser = await firebase.loginWithEmail(email, password);
        const firebaseProfile = await firebase.getUserProfile(firebaseUser.uid);
        const local = toLocalProfile(firebaseProfile || {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || email.split("@")[0],
          language: "zh",
        });
        setUser(local);
        setProfile(local);
        return { success: true };
      }

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
    } catch (error: unknown) {
      return { success: false, error: getErrorMessage(error, "Login failed") };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) return { success: false, error: "All fields required" };
    try {
      const firebase = await loadFirebaseClient();
      if (firebase.isFirebaseConfigured) {
        const firebaseProfile = await firebase.registerWithEmail(email, password, name);
        const local = toLocalProfile(firebaseProfile);
        setUser(local);
        setProfile(local);
        return { success: true };
      }

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
    } catch (error: unknown) {
      return { success: false, error: getErrorMessage(error, "Registration failed") };
    }
  };

  const signIn = async (email: string, password: string) => login(email, password);
  const signUp = async (email: string, password: string, name: string) => register(email, password, name);

  const loginWithGoogleFn = async (language: string = "zh") => {
    try {
      const firebase = await loadFirebaseClient();
      if (firebase.isFirebaseConfigured) {
        const firebaseProfile = await firebase.loginWithGoogle(language as UserProfile["language"]);
        const local = toLocalProfile(firebaseProfile);
        setUser(local);
        setProfile(local);
        return { success: true };
      }

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
    } catch (error: unknown) {
      return { success: false, error: getErrorMessage(error, "Google login failed") };
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem(STORAGE_KEY);
    void loadFirebaseClient()
      .then((firebase) => firebase.logout())
      .catch((error: unknown) => console.error("Logout error:", error));
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    setProfile(updated);

    void loadFirebaseClient().then(async (firebase) => {
      if (firebase.isFirebaseConfigured && firebase.db) {
        try {
          await firebase.updateUserProfile(user.uid, updated);
        } catch (error: unknown) {
          console.error("Update error:", error);
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    }).catch((error: unknown) => {
      console.error("Firebase client load error while updating user:", error);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    });
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, isConfigured: true, isFirebaseReady, login, register, signIn, signUp, loginWithGoogle: loginWithGoogleFn, logout, signOut: logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
