// Firebase 配置 - 用户系统和社交功能

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment
} from 'firebase/firestore';

// Clean env vars that may contain BOM characters (from Vercel dashboard input)
function cleanEnv(val: string | undefined): string {
  if (!val) return "";
  return val.replace(/^﻿/, "").replace(/^�/, "").trim();
}

// Detect environment - use actual hostname for authDomain to avoid domain mismatch
function getAuthDomain(): string {
  // Always use configured auth domain from env var
  const configured = cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  if (configured) return configured;
  if (typeof window === 'undefined') return 'localhost';
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return 'localhost';
  return host;
}

// Firebase config (from env vars)
const firebaseConfig = {
  apiKey: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: getAuthDomain(),
  projectId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  measurementId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID)
};

// 检查配置是否完整
export const isFirebaseConfigured = 
  !!firebaseConfig.apiKey && 
  !!firebaseConfig.projectId && 
  !!firebaseConfig.appId;

// 只在有完整配置时初始化 Firebase
let app: ReturnType<typeof initializeApp> | null = null;
let authInstance: ReturnType<typeof getAuth> | null = null;
let dbInstance: ReturnType<typeof getFirestore> | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export const auth = authInstance;
export const db = dbInstance;
export const googleProvider = new GoogleAuthProvider();

// ==================== 用户类型定义 ====================

export type { FirebaseUser as User };

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  language: 'id' | 'en' | 'zh' | 'th' | 'vi' | 'ms' | 'ja' | 'ko';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  birthChart?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    city: string;
    latitude: number;
    longitude: number;
    sunSign: string;
    moonSign: string;
    risingSign: string;
  };
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  category: 'daily' | 'question' | 'experience' | 'learning';
  zodiacTag?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ==================== 认证函数 ====================

export async function registerWithEmail(
  email: string, 
  password: string, 
  displayName: string,
  language: 'id' | 'en' | 'zh' | 'th' | 'vi' | 'ms' | 'ja' | 'ko' = 'id'
): Promise<UserProfile> {
  if (!auth || !db) throw new Error("Firebase not configured");
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  const profile: UserProfile = {
    uid: user.uid,
    email: user.email!,
    displayName,
    language,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    stats: { postsCount: 0, followersCount: 0, followingCount: 0 }
  };
  
  await setDoc(doc(db, 'users', user.uid), profile);
  return profile;
}

export async function loginWithEmail(email: string, password: string): Promise<FirebaseUser> {
  if (!auth) throw new Error("Firebase not configured");
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function loginWithGoogle(language: 'zh' | 'en' | 'id' | 'th' | 'vi' | 'ms' | 'ja' | 'ko' = 'zh'): Promise<UserProfile> {
  if (!auth || !db) throw new Error("Firebase not configured");

  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  const existingProfile = await getUserProfile(user.uid);
  if (existingProfile) return existingProfile;

  const profile: UserProfile = {
    uid: user.uid,
    email: user.email!,
    displayName: user.displayName || 'User',
    photoURL: user.photoURL || undefined,
    language,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    stats: { postsCount: 0, followersCount: 0, followingCount: 0 }
  };

  await setDoc(doc(db, 'users', user.uid), profile);
  return profile;
}

export async function logout(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) return null;
  const docSnap = await getDoc(doc(db, 'users', uid));
  return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, 'users', uid), { ...updates, updatedAt: Timestamp.now() });
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
  if (!auth) { callback(null); return () => {}; }
  return onAuthStateChanged(auth, callback);
}

// ==================== 帖子函数 ====================

export async function createPost(
  authorId: string,
  authorName: string,
  authorPhoto: string | undefined,
  content: string,
  category: Post['category'],
  zodiacTag?: string
): Promise<Post> {
  if (!db) throw new Error("Firebase not configured");
  
  // Firestore 不接受 undefined 值，需要转换为 null 或省略
  const postData: any = {
    authorId,
    authorName,
    authorPhoto: authorPhoto || null, // 使用 null 替代 undefined
    content,
    category,
    zodiacTag: zodiacTag || null,
    likesCount: 0,
    commentsCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  
  const docRef = await addDoc(collection(db, 'posts'), postData);
  return { id: docRef.id, ...postData } as Post;
}

export async function getPosts(maxCount: number = 20): Promise<Post[]> {
  if (!db) return [];
  
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(maxCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Post));
}

export async function likePost(postId: string, userId: string): Promise<void> {
  if (!db) return;
  await addDoc(collection(db, 'likes'), { postId, userId, createdAt: Timestamp.now() });
  await updateDoc(doc(db, 'posts', postId), { likesCount: increment(1) });
}

// 批量获取用户点赞的帖子ID（性能优化）
export async function getUserLikedPosts(userId: string, postIds: string[]): Promise<Set<string>> {
  if (!db || postIds.length === 0) return new Set();
  
  try {
    // 一次性查询用户的所有点赞
    const q = query(
      collection(db, 'likes'), 
      where('userId', '==', userId),
      where('postId', 'in', postIds.slice(0, 10)) // Firestore限制in最多10个
    );
    const snapshot = await getDocs(q);
    const likedPostIds = new Set<string>();
    snapshot.docs.forEach(d => {
      const data = d.data();
      if (data.postId) likedPostIds.add(data.postId);
    });
    
    // 如果超过10个帖子，分批查询
    if (postIds.length > 10) {
      const remaining = postIds.slice(10);
      for (let i = 0; i < remaining.length; i += 10) {
        const batch = remaining.slice(i, i + 10);
        const batchQ = query(
          collection(db, 'likes'),
          where('userId', '==', userId),
          where('postId', 'in', batch)
        );
        const batchSnapshot = await getDocs(batchQ);
        batchSnapshot.docs.forEach(d => {
          const data = d.data();
          if (data.postId) likedPostIds.add(data.postId);
        });
      }
    }
    
    return likedPostIds;
  } catch (err) {
    console.error("Get liked posts error:", err);
    return new Set();
  }
}

export async function hasLiked(postId: string, userId: string): Promise<boolean> {
  if (!db) return false;
  const q = query(collection(db, 'likes'), where('postId', '==', postId), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

export async function addComment(
  postId: string,
  authorId: string,
  authorName: string,
  authorPhoto: string | undefined,
  content: string
): Promise<void> {
  if (!db) return;
  await addDoc(collection(db, 'comments'), {
    postId, authorId, authorName, authorPhoto, content, createdAt: Timestamp.now()
  });
  await updateDoc(doc(db, 'posts', postId), { commentsCount: 1 });
}

export async function getComments(postId: string): Promise<any[]> {
  if (!db) return [];
  const q = query(collection(db, 'comments'), where('postId', '==', postId), orderBy('createdAt', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ==================== 合盘保存函数 ====================

export interface CompositeChart {
  id?: string;
  userId: string;
  person1Name: string;
  person2Name: string;
  person1Data: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    lat: number;
    lng: number;
    tz: number;
  };
  person2Data: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    lat: number;
    lng: number;
    tz: number;
  };
  chartData: any;
  houseSystem: string;
  createdAt: Timestamp;
}

export async function saveCompositeChart(
  person1Name: string,
  person2Name: string,
  person1Data: CompositeChart['person1Data'],
  person2Data: CompositeChart['person2Data'],
  chartData: any,
  houseSystem: string
): Promise<CompositeChart> {
  if (!db || !auth) throw new Error("Firebase not configured");
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");
  
  const docRef = await addDoc(collection(db, 'composite_charts'), {
    userId: user.uid,
    person1Name,
    person2Name,
    person1Data,
    person2Data,
    chartData,
    houseSystem,
    createdAt: Timestamp.now()
  });
  
  const docSnap = await getDoc(docRef);
  return { id: docRef.id, ...docSnap.data() } as CompositeChart;
}

export async function getSavedCompositeCharts(maxCount: number = 20): Promise<CompositeChart[]> {
  if (!db || !auth) return [];
  const user = auth.currentUser;
  if (!user) return [];
  
  const q = query(
    collection(db, 'composite_charts'),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc'),
    limit(maxCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CompositeChart));
}

export async function deleteCompositeChartFromCloud(chartId: string, userId: string): Promise<void> {
  if (!db || !auth) throw new Error("Firebase not configured");
  const docRef = doc(db, 'composite_charts', chartId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error("Chart not found");
  if (docSnap.data().userId !== userId) throw new Error("Unauthorized");
  await deleteDoc(docRef);
}
