import React from 'react';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { RotateCw, RefreshCw, Sun, Contrast, Droplet } from 'lucide-react';
import useEditorStore from '../../store/editorStore';

const Adjustments = () => {
  const { settings, updateSettings, resetSettings } = useEditorStore((state) => ({
    settings: state.settings,
    updateSettings: state.updateSettings,
    resetSettings: state.resetSettings,
  }));

  const adjustments = [
    {
      name: 'Brightness',
      key: 'brightness',
      icon: Sun,
      min: 0,
      max: 200,
      step: 1,
    },
    {
      name: 'Contrast',
      key: 'contrast',
      icon: Contrast,
      min: 0,
      max: 200,
      step: 1,
    },
    {
      name: 'Saturation',
      key: 'saturation',
      icon: Droplet,
      min: 0,
      max: 200,
      step: 1,
    },
    {
      name: 'Rotation',
      key: 'rotation',
      icon: RotateCw,
      min: 0,
      max: 360,
      step: 1,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Image Adjustments</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={resetSettings}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      <div className="space-y-6">
        {adjustments.map((adjustment) => (
          <div key={adjustment.key}>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <adjustment.icon className="w-4 h-4" />
                {adjustment.name}
              </label>
              <span className="text-sm text-gray-500">
                {Math.round(settings[adjustment.key])}
                {adjustment.key === 'rotation' ? '°' : '%'}
              </span>
            </div>
            <Slider
              value={[settings[adjustment.key]]}
              min={adjustment.min}
              max={adjustment.max}
              step={adjustment.step}
              onValueChange={(value) =>
                updateSettings({ [adjustment.key]: value[0] })
              }
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-6">
        <Button
          variant="outline"
          onClick={() =>
            updateSettings({
              rotation: (settings.rotation - 90 + 360) % 360,
            })
          }
        >
          Rotate Left
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            updateSettings({
              rotation: (settings.rotation + 90) % 360,
            })
          }
        >
          Rotate Right
        </Button>
      </div>
    </div>
  );
};

export default Adjustments;