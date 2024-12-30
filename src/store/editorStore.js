import { create } from 'zustand';

const useEditorStore = create((set, get) => ({
  // Current image being edited
  currentImage: null,
  
  // All images in the project
  projectImages: [],
  
  // Editor settings
  settings: {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    rotation: 0,
    scale: 100,
    isCropping: false,
    cropBox: { x: 0, y: 0, width: 0, height: 0 },
  },
  
  // Watermark settings
  watermark: {
    text: '',
    font: 'Arial',
    size: 24,
    color: '#ffffff',
    opacity: 0.8,
    position: { x: 50, y: 50 },
    rotation: 0,
    alignment: 'center',
    enableShadow: true,
    shadowOpacity: 0.5,
  },
  
  // Actions
  setCurrentImage: (image) => set({ currentImage: image }),
  
  addImages: (newImages) => 
    set((state) => ({
      projectImages: [...state.projectImages, ...newImages]
    })),
    
  removeImage: (index) =>
    set((state) => ({
      projectImages: state.projectImages.filter((_, i) => i !== index),
      currentImage: state.currentImage === state.projectImages[index] 
        ? null 
        : state.currentImage
    })),
    
  clearImages: () =>
    set({
      projectImages: [],
      currentImage: null
    }),
  
  updateSettings: (newSettings) => 
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    })),
    
  updateWatermark: (newWatermarkSettings) =>
    set((state) => ({
      watermark: { ...state.watermark, ...newWatermarkSettings }
    })),
    
  resetSettings: () =>
    set({
      settings: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        rotation: 0,
        scale: 100,
      }
    }),
    
  resetWatermark: () =>
    set({
      watermark: {
        text: '',
        font: 'Arial',
        size: 24,
        color: '#ffffff',
        opacity: 0.8,
        position: { x: 50, y: 50 },
        rotation: 0,
        alignment: 'center',
        enableShadow: true,
        shadowOpacity: 0.5,
      }
    }),
    
  clearImage: () =>
    set({
      currentImage: null,
      settings: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        rotation: 0,
        scale: 100,
      }
    }),
}));

export default useEditorStore;