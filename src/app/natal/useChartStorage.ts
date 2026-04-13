// Chart Storage Hook - Save/Load natal charts to localStorage
"use client";

import { useState, useEffect, useCallback } from 'react';

export interface SavedChart {
  id: string;
  name: string;
  birthData: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    cityName: string;
    lat: number;
    lng: number;
    tz: number;
  };
  chartData?: any;
  houseSystem: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'astrology_saved_charts';

export function useChartStorage() {
  const [charts, setCharts] = useState<SavedChart[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCharts(parsed);
      }
    } catch (e) {
      console.error('Failed to load charts:', e);
    }
    setLoaded(true);
  }, []);

  // Save to localStorage
  const saveCharts = useCallback((newCharts: SavedChart[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCharts));
      setCharts(newCharts);
    } catch (e) {
      console.error('Failed to save charts:', e);
    }
  }, []);

  // Save a new chart or update existing
  const saveChart = useCallback((chart: Omit<SavedChart, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const existingIndex = charts.findIndex(
      c => c.birthData.year === chart.birthData.year &&
           c.birthData.month === chart.birthData.month &&
           c.birthData.day === chart.birthData.day &&
           c.birthData.hour === chart.birthData.hour &&
           c.birthData.cityName === chart.birthData.cityName
    );

    if (existingIndex >= 0) {
      // Update existing
      const updated = [...charts];
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...chart,
        updatedAt: now,
      };
      saveCharts(updated);
      return updated[existingIndex].id;
    } else {
      // Create new
      const newChart: SavedChart = {
        ...chart,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        createdAt: now,
        updatedAt: now,
      };
      saveCharts([newChart, ...charts]);
      return newChart.id;
    }
  }, [charts, saveCharts]);

  // Delete a chart
  const deleteChart = useCallback((id: string) => {
    saveCharts(charts.filter(c => c.id !== id));
  }, [charts, saveCharts]);

  // Rename a chart
  const renameChart = useCallback((id: string, name: string) => {
    saveCharts(charts.map(c => c.id === id ? { ...c, name, updatedAt: new Date().toISOString() } : c));
  }, [charts, saveCharts]);

  return {
    charts,
    loaded,
    saveChart,
    deleteChart,
    renameChart,
  };
}
