import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Crop, Check, X } from 'lucide-react';
import Canvas from './Canvas';
import useEditorStore from '../../store/editorStore';

const ImageCropper = ({ canvasRef }) => {
  const { settings, updateSettings } = useEditorStore((state) => ({
    settings: state.settings,
    updateSettings: state.updateSettings
  }));

  const [startPos, setStartPos] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const startCropping = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      updateSettings({
        isCropping: true,
        cropBox: {
          x: 0,
          y: 0,
          width: canvas.width,
          height: canvas.height
        }
      });
    }
  };

  const handleMouseDown = (e) => {
    if (!settings.isCropping) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    setStartPos({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !startPos || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;

    updateSettings({
      cropBox: {
        x: Math.min(startPos.x, currentX),
        y: Math.min(startPos.y, currentY),
        width: Math.abs(currentX - startPos.x),
        height: Math.abs(currentY - startPos.y)
      }
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const applyCrop = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Create temporary canvas with cropped image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = settings.cropBox.width;
    tempCanvas.height = settings.cropBox.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Copy the cropped portion
    tempCtx.drawImage(
      canvas,
      settings.cropBox.x, settings.cropBox.y, 
      settings.cropBox.width, settings.cropBox.height,
      0, 0, settings.cropBox.width, settings.cropBox.height
    );
    
    // Clear original canvas and resize it
    canvas.width = settings.cropBox.width;
    canvas.height = settings.cropBox.height;
    
    // Draw cropped image back
    ctx.drawImage(tempCanvas, 0, 0);
    
    // Reset cropping state
    updateSettings({
      isCropping: false,
      cropBox: { x: 0, y: 0, width: 0, height: 0 }
    });
  };

  const cancelCrop = () => {
    updateSettings({
      isCropping: false,
      cropBox: { x: 0, y: 0, width: 0, height: 0 }
    });
  };

  // Draw crop overlay
  useEffect(() => {
    if (settings.isCropping && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Store the original image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      const drawOverlay = () => {
        // Restore the original image
        ctx.putImageData(imageData, 0, 0);
        
        // Draw semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Clear crop area
        ctx.clearRect(
          settings.cropBox.x, 
          settings.cropBox.y, 
          settings.cropBox.width, 
          settings.cropBox.height
        );
        
        // Draw crop border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          settings.cropBox.x, 
          settings.cropBox.y, 
          settings.cropBox.width, 
          settings.cropBox.height
        );
      };

      drawOverlay();

      return () => {
        // Restore the original image when unmounting or when crop mode ends
        ctx.putImageData(imageData, 0, 0);
      };
    }
  }, [settings.isCropping, settings.cropBox]);

  return (
    <div className="relative">
      <div 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={settings.isCropping ? 'cursor-crosshair' : ''}
      >
        <Canvas ref={canvasRef} />
      </div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {!settings.isCropping ? (
          <Button
            onClick={startCropping}
            variant="default"
            className="flex items-center gap-2"
          >
            <Crop className="w-4 h-4" />
            Crop Image
          </Button>
        ) : (
          <>
            <Button
              onClick={applyCrop}
              variant="default"
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Apply Crop
            </Button>
            <Button
              onClick={cancelCrop}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCropper;