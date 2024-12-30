import { generateUniqueId } from '../lib/utils';

export const saveProject = async (project) => {
  try {
    // Get existing projects from localStorage
    const existingProjects = JSON.parse(localStorage.getItem('watermark-projects') || '[]');
    
    // Generate unique ID for new project if it doesn't have one
    const projectToSave = {
      ...project,
      id: project.id || generateUniqueId(),
      lastModified: new Date().toISOString(),
    };

    // Update existing project or add new one
    const updatedProjects = project.id 
      ? existingProjects.map(p => p.id === project.id ? projectToSave : p)
      : [...existingProjects, projectToSave];

    // Save to localStorage
    localStorage.setItem('watermark-projects', JSON.stringify(updatedProjects));
    
    return projectToSave;
  } catch (error) {
    console.error('Error saving project:', error);
    throw new Error('Failed to save project');
  }
};

export const loadProject = async (projectId) => {
  try {
    const projects = JSON.parse(localStorage.getItem('watermark-projects') || '[]');
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  } catch (error) {
    console.error('Error loading project:', error);
    throw new Error('Failed to load project');
  }
};

export const getAllProjects = async () => {
  try {
    return JSON.parse(localStorage.getItem('watermark-projects') || '[]');
  } catch (error) {
    console.error('Error getting projects:', error);
    throw new Error('Failed to get projects');
  }
};

export const deleteProject = async (projectId) => {
  try {
    const projects = JSON.parse(localStorage.getItem('watermark-projects') || '[]');
    const updatedProjects = projects.filter(p => p.id !== projectId);
    localStorage.setItem('watermark-projects', JSON.stringify(updatedProjects));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
};