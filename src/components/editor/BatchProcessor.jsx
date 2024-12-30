import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Trash2, Upload, Play, Download } from 'lucide-react';
import { formatFileSize } from '../../lib/utils';

const BatchProcessor = ({ watermarkSettings, onProcess }) => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
  });

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    setProcessing(true);
    setProgress(0);

    const results = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await onProcess(files[i], watermarkSettings);
        results.push(result);
      } catch (error) {
        console.error(`Error processing ${files[i].name}:`, error);
      }
      setProgress(((i + 1) / files.length) * 100);
    }

    setProcessing(false);
    return results;
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-gray-400"
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop images here, or click to select files
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">
            {files.length} file(s) selected
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="h-10 w-10 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {processing && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-gray-600 text-center">
            Processing: {Math.round(progress)}%
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          onClick={processFiles}
          disabled={files.length === 0 || processing}
          className="flex-1"
        >
          <Play className="h-4 w-4 mr-2" />
          Process Files
        </Button>
        <Button
          variant="outline"
          onClick={() => setFiles([])}
          disabled={files.length === 0 || processing}
        >
          Clear All
        </Button>
      </div>
    </div>
  );
};

export default BatchProcessor;