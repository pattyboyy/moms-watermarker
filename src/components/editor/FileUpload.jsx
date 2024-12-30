import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { formatFileSize } from '../../lib/utils';
import useEditorStore from '../../store/editorStore';

const FileUpload = () => {
  const setCurrentImage = useEditorStore((state) => state.setCurrentImage);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        // Create a new FileReader
        const reader = new FileReader();
        
        // Create a promise to handle the file reading
        const imageLoadPromise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
        });

        // Start reading the file
        reader.readAsDataURL(file);

        // Wait for the file to be read
        const result = await imageLoadPromise;
        
        // Create an image to verify it loads correctly
        const img = new Image();
        const imageVerifyPromise = new Promise((resolve, reject) => {
          img.onload = () => resolve(result);
          img.onerror = reject;
        });
        img.src = result;

        // Wait for image to load and then set it in store
        const verifiedImage = await imageVerifyPromise;
        setCurrentImage(verifiedImage);
      } catch (error) {
        console.error('Error loading image:', error);
        // Here you might want to show an error message to the user
      }
    }
  }, [setCurrentImage]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {acceptedFiles.length > 0 ? (
            <>
              <ImageIcon className="w-12 h-12 text-gray-400" />
              <div className="text-sm text-gray-600">
                {acceptedFiles[0].name} ({formatFileSize(acceptedFiles[0].size)})
              </div>
              <Button variant="outline" size="sm">
                Choose Another Image
              </Button>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drop your image here
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to select a file
                </p>
              </div>
              <p className="text-xs text-gray-500">
                Supports: JPG, JPEG, PNG, GIF
              </p>
            </>
          )}
        </div>
      </div>

      {acceptedFiles.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Button 
            onClick={() => onDrop(acceptedFiles)}
            className="flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            Edit Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;