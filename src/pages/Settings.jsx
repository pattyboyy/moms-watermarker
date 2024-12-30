import React from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Save, User, Image, Download } from 'lucide-react';

const Settings = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="space-y-8 max-w-2xl">
        {/* User Preferences */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            User Preferences
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Watermark Text
              </label>
              <Input type="text" placeholder="© Your Name" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Font Family
              </label>
              <select className="w-full rounded-md border border-gray-300 py-2 px-3">
                <option>Arial</option>
                <option>Times New Roman</option>
                <option>Helvetica</option>
              </select>
            </div>
          </div>
        </section>

        {/* Image Settings */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Image className="w-5 h-5" />
            Image Settings
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Image Quality
              </label>
              <select className="w-full rounded-md border border-gray-300 py-2 px-3">
                <option>High (100%)</option>
                <option>Medium (80%)</option>
                <option>Low (60%)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Export Format
              </label>
              <select className="w-full rounded-md border border-gray-300 py-2 px-3">
                <option>PNG</option>
                <option>JPEG</option>
                <option>WebP</option>
              </select>
            </div>
          </div>
        </section>

        {/* Export Settings */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Settings
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input type="checkbox" id="autoSave" className="mr-2" />
              <label htmlFor="autoSave" className="text-sm text-gray-700">
                Auto-save projects
              </label>
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" id="preserveMetadata" className="mr-2" />
              <label htmlFor="preserveMetadata" className="text-sm text-gray-700">
                Preserve image metadata
              </label>
            </div>
          </div>
        </section>

        <div>
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;