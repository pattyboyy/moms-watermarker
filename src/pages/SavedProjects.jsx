import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectsList from '../components/editor/ProjectsList';
import { Button } from '../components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '../components/ui/input';

const SavedProjects = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleProjectSelect = (project) => {
    navigate('/editor', { state: { projectId: project.id } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Saved Projects</h1>
        <Button 
          onClick={() => navigate('/editor')}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ProjectsList 
        onProjectSelect={handleProjectSelect}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default SavedProjects;