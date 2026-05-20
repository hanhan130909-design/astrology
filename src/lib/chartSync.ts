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
  
  const charts: SavedChart[] = JSON.parse(localCharts);
  for (const chart of charts) {
    await saveChartToCloud(chart, userId);
  }
  
  // Clear localStorage after sync
  localStorage.removeItem('natal_charts');
}
