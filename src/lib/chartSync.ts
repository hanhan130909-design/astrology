// Chart sync — Firebase lazy-loaded for performance
export interface SavedChart {
  id?: string;
  name: string;
  birthData: { name: string; year: number; month: number; day: number; hour: number; minute: number; houseSystem: string; lat: number; lng: number };
  chartData: any;
  ts: number;
}

export interface SavedCompositeChart {
  id?: string;
  person1Name: string; person2Name: string;
  person1Data: { year: number; month: number; day: number; hour: number; minute: number; lat: number; lng: number; tz: number; cityId: string };
  person2Data: { year: number; month: number; day: number; hour: number; minute: number; lat: number; lng: number; tz: number; cityId: string };
  chartData: any; houseSystem: string; ts: number;
}

async function getFirestore() {
  const fb = await import("./firebase");
  const fs = await import("firebase/firestore");
  if (!fb.db) throw new Error("Firestore not initialized");
  return { db: fb.db, ...fs };
}

export async function saveChartToCloud(chart: SavedChart, userId: string): Promise<void> {
  const { db, setDoc, doc } = await getFirestore();
  const chartId = chart.id || `chart_${Date.now()}`;
  await setDoc(doc(db, "users", userId, "charts", chartId), { ...chart, id: chartId, updatedAt: Date.now() });
}

export async function loadChartsFromCloud(userId: string): Promise<SavedChart[]> {
  const { db, getDocs, collection, query, orderBy } = await getFirestore();
  const q = query(collection(db, "users", userId, "charts"), orderBy("updatedAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d: any) => d.data() as SavedChart);
}

export async function deleteChartFromCloud(chartId: string, userId: string): Promise<void> {
  const { db, deleteDoc, doc } = await getFirestore();
  await deleteDoc(doc(db, "users", userId, "charts", chartId));
}

export async function syncLocalChartsToCloud(userId: string): Promise<void> {
  const { db, setDoc, doc } = await getFirestore();
  const localCharts = localStorage.getItem("natal_charts");
  if (!localCharts) return;
  for (const chart of JSON.parse(localCharts)) {
    await setDoc(doc(db, "users", userId, "charts", chart.id || `chart_${Date.now()}`), { ...chart, id: chart.id || `chart_${Date.now()}`, updatedAt: Date.now() });
  }
  localStorage.removeItem("natal_charts");
}

export async function saveCompositeChartToCloud(chart: SavedCompositeChart, userId: string): Promise<void> {
  const { db, setDoc, doc } = await getFirestore();
  const chartId = chart.id || `composite_${Date.now()}`;
  await setDoc(doc(db, "users", userId, "composite_charts", chartId), { ...chart, id: chartId, updatedAt: Date.now() });
}

export async function loadCompositeChartsFromCloud(userId: string): Promise<SavedCompositeChart[]> {
  const { db, getDocs, collection, query, orderBy } = await getFirestore();
  const q = query(collection(db, "users", userId, "composite_charts"), orderBy("updatedAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d: any) => d.data() as SavedCompositeChart);
}

export async function deleteCompositeChartFromCloud(chartId: string, userId: string): Promise<void> {
  const { db, deleteDoc, doc } = await getFirestore();
  await deleteDoc(doc(db, "users", userId, "composite_charts", chartId));
}
