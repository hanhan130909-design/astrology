import { db } from './firebase';
import { doc, setDoc, getDocs, collection, query, orderBy, deleteDoc } from 'firebase/firestore';

export interface SavedChart {
  id?: string;
  name: string;
  birthData: {
    name: string;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    houseSystem: string;
    lat: number;
    lng: number;
  };
  chartData: any;
  ts: number; // timestamp
}

// Save chart to Firestore (user logged in) or localStorage (not logged in)
export async function saveChartToCloud(chart: SavedChart, userId: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  
  const chartId = chart.id || `chart_${Date.now()}`;
  await setDoc(doc(db, 'users', userId, 'charts', chartId), {
    ...chart,
    id: chartId,
    updatedAt: Date.now()
  });
}

// Load charts from Firestore
export async function loadChartsFromCloud(userId: string): Promise<SavedChart[]> {
  if (!db) return [];
  
  const q = query(
    collection(db, 'users', userId, 'charts'),
    orderBy('updatedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data() as SavedChart);
}

// Delete chart from Firestore
export async function deleteChartFromCloud(chartId: string, userId: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'users', userId, 'charts', chartId));
}

// Sync localStorage charts to Firestore (on login)
export async function syncLocalChartsToCloud(userId: string): Promise<void> {
  if (!db) return;
  
  const localCharts = localStorage.getItem('natal_charts');
  if (!localCharts) return;
  
  let charts: SavedChart[] = [];
  try { charts = JSON.parse(localCharts); } catch { return; }
  for (const chart of charts) {
    await saveChartToCloud(chart, userId);
  }
  
  // Clear localStorage after sync
  localStorage.removeItem('natal_charts');
}

// ==================== Composite Charts ====================

export interface SavedCompositeChart {
  id?: string;
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
    cityId: string;
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
    cityId: string;
  };
  chartData: any;
  houseSystem: string;
  ts: number;
}

// Save composite chart to Firestore
export async function saveCompositeChartToCloud(chart: SavedCompositeChart, userId: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  
  const chartId = chart.id || `composite_${Date.now()}`;
  await setDoc(doc(db, 'users', userId, 'composite_charts', chartId), {
    ...chart,
    id: chartId,
    updatedAt: Date.now()
  });
}

// Load composite charts from Firestore
export async function loadCompositeChartsFromCloud(userId: string): Promise<SavedCompositeChart[]> {
  if (!db) return [];
  
  const q = query(
    collection(db, 'users', userId, 'composite_charts'),
    orderBy('updatedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data() as SavedCompositeChart);
}

// Delete composite chart from Firestore
export async function deleteCompositeChartFromCloud(chartId: string, userId: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'users', userId, 'composite_charts', chartId));
}
