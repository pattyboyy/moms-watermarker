import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { Edit2, Trash2, Clock, Image as ImageIcon } from 'lucide-react';
import useProjectStore from '../../store/projectStore';

const ProjectsList = ({ onProjectSelect }) => {
  const { projects, fetchProjects, deleteProject, isLoading } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new project
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {project.name}
              </h3>
              {project.description && (
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {project.description}
                </p>
              )}
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Clock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                Last modified: {formatDate(project.lastModified)}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onProjectSelect(project)}
                className="text-blue-600"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteProject(project.id)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {project.imageData && (
            <div className="mt-4 flex justify-center">
              <img
                src={project.imageData}
                alt={project.name}
                className="h-24 w-40 object-cover rounded-md"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectsList;