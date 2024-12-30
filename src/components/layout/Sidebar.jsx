import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Image, Layout, Settings, FolderOpen } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navigationItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Editor', icon: Image, path: '/editor' },
    { name: 'Saved Projects', icon: FolderOpen, path: '/saved-projects' },
    { name: 'Templates', icon: Layout, path: '/templates' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="hidden sm:flex w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col pt-5 pb-4">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActivePath(item.path)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <IconComponent
                  className={`mr-3 h-6 w-6 ${
                    isActivePath(item.path)
                      ? 'text-gray-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;