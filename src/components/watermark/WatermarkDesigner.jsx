import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Type, Move, RotateCw, Save, Sliders, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import useEditorStore from '../../store/editorStore';

const WatermarkDesigner = () => {
  const { watermark, updateWatermark } = useEditorStore((state) => ({
    watermark: state.watermark,
    updateWatermark: state.updateWatermark
  }));

  const handleChange = (field, value) => {
    updateWatermark({ [field]: value });
  };

  const fontOptions = [
    'Arial',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Helvetica',
    'Courier New',
    'Impact'
  ];

  const alignmentOptions = [
    { value: 'left', icon: AlignLeft },
    { value: 'center', icon: AlignCenter },
    { value: 'right', icon: AlignRight }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="space-y-6">
        {/* Text Settings */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-4">
            <Type className="w-4 h-4" />
            Text Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Watermark Text
              </label>
              <Input
                type="text"
                value={watermark.text}
                onChange={(e) => handleChange('text', e.target.value)}
                placeholder="Enter watermark text..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Family
              </label>
              <select
                className="w-full rounded-md border border-gray-300 py-2 px-3"
                value={watermark.font}
                onChange={(e) => handleChange('font', e.target.value)}
              >
                {fontOptions.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size ({watermark.size}px)
              </label>
              <Slider
                value={[watermark.size]}
                min={12}
                max={120}
                step={1}
                onValueChange={(value) => handleChange('size', value[0])}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={watermark.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="h-10 w-20"
                />
                <Input
                  type="text"
                  value={watermark.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="flex-1"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Position & Alignment */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-4">
            <Move className="w-4 h-4" />
            Position & Alignment
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alignment
              </label>
              <div className="flex gap-2">
                {alignmentOptions.map(({ value, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={watermark.alignment === value ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleChange('alignment', value)}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horizontal Position ({watermark.position.x}%)
              </label>
              <Slider
                value={[watermark.position.x]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleChange('position', { ...watermark.position, x: value[0] })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vertical Position ({watermark.position.y}%)
              </label>
              <Slider
                value={[watermark.position.y]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleChange('position', { ...watermark.position, y: value[0] })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rotation ({watermark.rotation}°)
              </label>
              <Slider
                value={[watermark.rotation]}
                min={0}
                max={360}
                step={1}
                onValueChange={(value) => handleChange('rotation', value[0])}
              />
            </div>
          </div>
        </div>

        {/* Style Settings */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-4">
            <Sliders className="w-4 h-4" />
            Style Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opacity ({Math.round(watermark.opacity * 100)}%)
              </label>
              <Slider
                value={[watermark.opacity * 100]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => handleChange('opacity', value[0] / 100)}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enableShadow"
                checked={watermark.enableShadow}
                onChange={(e) => handleChange('enableShadow', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label
                htmlFor="enableShadow"
                className="text-sm font-medium text-gray-700"
              >
                Enable Shadow
              </label>
            </div>

            {watermark.enableShadow && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shadow Opacity ({Math.round(watermark.shadowOpacity * 100)}%)
                </label>
                <Slider
                  value={[watermark.shadowOpacity * 100]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) =>
                    handleChange('shadowOpacity', value[0] / 100)
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Save Template Button */}
        <Button
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
        >
          <Save className="w-4 h-4" />
          Save as Template
        </Button>
      </div>
    </div>
  );
};

export default WatermarkDesigner;