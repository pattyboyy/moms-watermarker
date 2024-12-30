import React from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { Button } from '../components/ui/button';

const Templates = () => {
  // Mock data for templates
  const templates = [
    { id: 1, name: 'Basic Watermark', lastUsed: '2024-12-29' },
    { id: 2, name: 'Copyright Text', lastUsed: '2024-12-28' },
    { id: 3, name: 'Logo Overlay', lastUsed: '2024-12-27' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Watermark Templates</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Template
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500">
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="h-32 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
              <span className="text-gray-500">Preview</span>
            </div>
            
            <div className="text-sm text-gray-500">
              Last used: {template.lastUsed}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;