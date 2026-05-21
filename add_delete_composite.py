#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Add deleteCompositeChartFromCloud to firebase.ts
"""

with open(r'C:\Users\user\.qclaw\astrology-clean\src\lib\firebase.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add after getSavedCompositeCharts function
old_end = '''export async function getSavedCompositeCharts(maxCount: number = 20): Promise<CompositeChart[]> {
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
}'''

new_end = '''export async function getSavedCompositeCharts(maxCount: number = 20): Promise<CompositeChart[]> {
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
}'''

content = content.replace(old_end, new_end)

with open(r'C:\Users\user\.qclaw\astrology-clean\src\lib\firebase.ts', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print("SUCCESS: Added deleteCompositeChartFromCloud to firebase.ts")
