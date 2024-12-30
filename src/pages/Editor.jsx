import React, { useState, useRef } from 'react';
import ImageEditor from '../components/editor/ImageEditor';
import SaveProjectDialog from '../components/editor/SaveProjectDialog';
import ProjectsList from '../components/editor/ProjectsList';
import Adjustments from '../components/editor/Adjustments';
import ExportOptions from '../components/editor/ExportOptions';
import MultiImageManager from '../components/editor/MultiImageManager';
import { Button } from '../components/ui/button';
import { 
  Save, 
  Share, 
  Download, 
  FolderOpen, 
  X, 
  Plus, 
  ImageIcon 
} from 'lucide-react';
import useEditorStore from '../store/editorStore';
import useProjectStore from '../store/projectStore';
import * as Dialog from '@radix-ui/react-dialog';
import { quickDownload } from '../utils/image-export';

const Editor = () => {
  const [isSaveDialogOpen, setSaveDialogOpen] = useState(false);
  const [isProjectsDialogOpen, setProjectsDialogOpen] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const canvasRef = useRef(null);
  
  const { currentImage } = useEditorStore();
  const { loadProject } = useProjectStore();

  const handleProjectSelect = async (project) => {
    try {
      await loadProject(project.id);
      setProjectsDialogOpen(false);
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  const handleQuickDownload = async () => {
    if (!canvasRef.current) {
      console.error('Canvas reference not available');
      return;
    }

    try {
      await quickDownload(canvasRef.current);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setProjectsDialogOpen(true)}
            >
              <FolderOpen className="w-4 h-4" />
              Open Project
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => {
                useEditorStore.getState().clearImage();
                useProjectStore.getState().clearCurrentProject();
              }}
            >
              <Plus className="w-4 h-4" />
              New Project
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setSaveDialogOpen(true)}
              disabled={!currentImage}
            >
              <Save className="w-4 h-4" />
              Save Project
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setShowImageManager(!showImageManager)}
            >
              <ImageIcon className="w-4 h-4" />
              Manage Images
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleQuickDownload}
              disabled={!currentImage}
            >
              <Download className="w-4 h-4" />
              Quick Download
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Left Sidebar - Image Manager */}
          {showImageManager && (
            <div className="w-80 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
              <MultiImageManager />
            </div>
          )}

          {/* Main Canvas Area */}
          <div className="flex-1 p-4">
            <ImageEditor canvasRef={canvasRef} />
          </div>

          {/* Right Sidebar */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto">
            <div className="space-y-6">
              <Adjustments />
              <ExportOptions canvasRef={canvasRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <SaveProjectDialog
        open={isSaveDialogOpen}
        onOpenChange={setSaveDialogOpen}
      />

      <Dialog.Root open={isProjectsDialogOpen} onOpenChange={setProjectsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold">
                Open Project
              </Dialog.Title>
              <Dialog.Close className="rounded-full p-1.5 hover:bg-gray-100">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <ProjectsList onProjectSelect={handleProjectSelect} />
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setProjectsDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Editor;