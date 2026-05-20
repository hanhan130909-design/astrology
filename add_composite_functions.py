#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Add saveCompositeChart and getSavedCompositeCharts functions to firebase.ts
"""

import re

# Read firebase.ts
with open(r'C:\Users\user\.qclaw\astrology-clean\src\lib\firebase.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# New functions to add at the end of file
new_functions = '''

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
'''

# Append to file
with open(r'C:\Users\user\.qclaw\astrology-clean\src\lib\firebase.ts', 'a', encoding='utf-8') as f:
    f.write(new_functions)

print("✅ Added saveCompositeChart functions to firebase.ts")
