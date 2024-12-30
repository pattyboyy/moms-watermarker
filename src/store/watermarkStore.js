import { create } from 'zustand';

const useWatermarkStore = create((set) => ({
  // Saved watermark templates
  templates: [],
  
  // Currently selected template
  currentTemplate: null,
  
  // Template being edited
  editingTemplate: null,
  
  // Actions
  addTemplate: (template) =>
    set((state) => ({
      templates: [...state.templates, { ...template, id: Date.now() }]
    })),
    
  updateTemplate: (id, updatedTemplate) =>
    set((state) => ({
      templates: state.templates.map((template) =>
        template.id === id ? { ...template, ...updatedTemplate } : template
      )
    })),
    
  deleteTemplate: (id) =>
    set((state) => ({
      templates: state.templates.filter((template) => template.id !== id)
    })),
    
  setCurrentTemplate: (template) =>
    set({ currentTemplate: template }),
    
  setEditingTemplate: (template) =>
    set({ editingTemplate: template }),
    
  clearEditingTemplate: () =>
    set({ editingTemplate: null }),
}));

export default useWatermarkStore;