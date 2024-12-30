import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Download, Settings2 } from 'lucide-react';
import { exportImageWithSettings } from '../../utils/image-export';

const ExportOptions = ({ canvasRef }) => {
  const [settings, setSettings] = useState({
    filename: 'watermarked-image',
    format: 'png',
    quality: 80,
    preserveMetadata: true,
  });

  const handleExport = async () => {
    if (!canvasRef?.current) {
      console.error('Canvas reference not available');
      return;
    }

    try {
      await exportImageWithSettings(canvasRef.current, settings);
    } catch (error) {
      console.error('Export failed:', error);
      // You might want to show an error message to the user here
    }
  };

  const formats = [
    { value: 'png', label: 'PNG' },
    { value: 'jpeg', label: 'JPEG' },
    { value: 'webp', label: 'WebP' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Export Settings</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filename
          </label>
          <Input
            type="text"
            value={settings.filename}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, filename: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Format
          </label>
          <select
            className="w-full rounded-md border border-gray-300 py-2 px-3"
            value={settings.format}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, format: e.target.value }))
            }
          >
            {formats.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quality ({settings.quality}%)
          </label>
          <Slider
            value={[settings.quality]}
            min={1}
            max={100}
            step={1}
            onValueChange={(value) =>
              setSettings((prev) => ({ ...prev, quality: value[0] }))
            }
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="preserveMetadata"
            checked={settings.preserveMetadata}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                preserveMetadata: e.target.checked,
              }))
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
          />
          <label
            htmlFor="preserveMetadata"
            className="ml-2 block text-sm text-gray-700"
          >
            Preserve image metadata
          </label>
        </div>

        <Button
          onClick={handleExport}
          className="w-full flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Image
        </Button>
      </div>
    </div>
  );
};

export default ExportOptions;