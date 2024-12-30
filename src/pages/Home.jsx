import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Upload, Image as ImageIcon, Save } from 'lucide-react';
import useEditorStore from '../store/editorStore';
import useProjectStore from '../store/projectStore';

const Home = () => {
  const navigate = useNavigate();
  const clearImage = useEditorStore((state) => state.clearImage);
  const clearCurrentProject = useProjectStore((state) => state.clearCurrentProject);

  const handleStartNewProject = () => {
    // Clear any existing image and project state
    clearImage();
    clearCurrentProject();
    navigate('/editor');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Mom's Watermarker
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Easily add watermarks to your images and protect your creative work
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            onClick={handleStartNewProject}
            className="flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Start New Project
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/templates')}
            className="flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            View Templates
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <FeatureCard
          icon={<Upload className="w-8 h-8" />}
          title="Easy Upload"
          description="Drag and drop your images or select them from your computer"
        />
        <FeatureCard
          icon={<ImageIcon className="w-8 h-8" />}
          title="Customizable Watermarks"
          description="Create and save custom watermarks for future use"
        />
        <FeatureCard
          icon={<Save className="w-8 h-8" />}
          title="Save Templates"
          description="Save your favorite watermark designs as templates"
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="text-blue-500 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Home;