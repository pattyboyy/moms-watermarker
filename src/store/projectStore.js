import { create } from 'zustand';
import { saveProject, loadProject, getAllProjects, deleteProject } from '../services/projectService';

const useProjectStore = create((set, get) => ({
  // State
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  // Actions
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await getAllProjects();
      set({ projects, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      const newProject = {
        ...projectData,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };
      const savedProject = await saveProject(newProject);
      set(state => ({
        projects: [...state.projects, savedProject],
        currentProject: savedProject,
        isLoading: false,
      }));
      return savedProject;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateProject: async (projectId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const currentProject = get().projects.find(p => p.id === projectId);
      if (!currentProject) throw new Error('Project not found');

      const updatedProject = {
        ...currentProject,
        ...updates,
        lastModified: new Date().toISOString(),
      };

      const savedProject = await saveProject(updatedProject);
      set(state => ({
        projects: state.projects.map(p => 
          p.id === projectId ? savedProject : p
        ),
        currentProject: savedProject,
        isLoading: false,
      }));
      return savedProject;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  loadProject: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const project = await loadProject(projectId);
      set({ currentProject: project, isLoading: false });
      return project;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteProject: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      await deleteProject(projectId);
      set(state => ({
        projects: state.projects.filter(p => p.id !== projectId),
        currentProject: state.currentProject?.id === projectId 
          ? null 
          : state.currentProject,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearCurrentProject: () => {
    set({ currentProject: null });
  },
}));

export default useProjectStore;