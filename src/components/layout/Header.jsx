import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Upload, Settings as SettingsIcon } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Mom's Watermarker</h1>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Upload size={20} />
              Upload Image
            </Button>
            
            <Link to="/settings">
              <Button variant="ghost" size="icon">
                <SettingsIcon size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;