import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      // User preferences
      preferences: {
        defaultWatermarkText: '© Your Name',
        defaultFont: 'Arial',
        defaultImageQuality: 80,
        defaultExportFormat: 'PNG',
        autoSave: true,
        preserveMetadata: true,
      },
      
      // Recent projects
      recentProjects: [],
      
      // Actions
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences }
        })),
        
      addRecentProject: (project) =>
        set((state) => ({
          recentProjects: [
            { ...project, timestamp: Date.now() },
            ...state.recentProjects
          ].slice(0, 10) // Keep only last 10 projects
        })),
        
      clearRecentProjects: () =>
        set({ recentProjects: [] }),
        
      resetPreferences: () =>
        set({
          preferences: {
            defaultWatermarkText: '© Your Name',
            defaultFont: 'Arial',
            defaultImageQuality: 80,
            defaultExportFormat: 'PNG',
            autoSave: true,
            preserveMetadata: true,
          }
        }),
    }),
    {
      name: 'user-preferences', // localStorage key
    }
  )
);

export default useUserStore;