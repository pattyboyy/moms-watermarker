// src/components/editor/Canvas.jsx

import React, { useEffect, useState, forwardRef } from 'react';
import useEditorStore from '../../store/editorStore';
import { applyWatermark } from '../../utils/imageProcessing';

const Canvas = forwardRef((props, ref) => {
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const {
    currentImage,
    watermark,
  } = useEditorStore((state) => ({
    currentImage: state.currentImage,
    watermark: state.watermark,
  }));

  // Calculate canvas dimensions while maintaining aspect ratio
  const calculateCanvasDimensions = (img, maxWidth = 800) => {
    let { naturalWidth: width, naturalHeight: height } = img;

    if (width > maxWidth) {
      const ratio = maxWidth / width;
      width = maxWidth;
      height *= ratio;
    }

    return { width, height };
  };

  // Draw the image and apply watermark
  const drawCanvas = () => {
    if (!currentImage || !ref.current) return;

    setIsLoading(true);
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'anonymous'; // Handle CORS if needed

    img.onload = () => {
      try {
        // 1) Calculate and set canvas dimensions
        const { width, height } = calculateCanvasDimensions(img);
        canvas.width = width;
        canvas.height = height;
        setCanvasDimensions({ width, height });

        // 2) Clear the canvas and draw the base image
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // 3) Apply the watermark (make sure it has text/color/etc.)
        applyWatermark(canvas, watermark);

        setIsLoading(false);
      } catch (error) {
        console.error('Error drawing image:', error);
        setIsLoading(false);
      }
    };

    img.onerror = (error) => {
      console.error('Error loading image:', error);
      setIsLoading(false);
    };

    img.src = currentImage;
  };

  // Re-draw whenever the image or watermark changes
  useEffect(() => {
    if (currentImage) {
      drawCanvas();
    }
    // Include 'watermark' so it updates if text/position changes
  }, [currentImage, watermark]);

  // Optionally handle click events to reposition watermark
  const handleCanvasClick = (e) => {
    if (!ref.current || !watermark.text) return;

    const canvas = ref.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    useEditorStore.getState().updateWatermark({
      position: { x, y },
    });
  };

  if (!currentImage) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">No image selected</span>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <div className="text-white">Processing...</div>
        </div>
      )}

      <canvas
        ref={ref}
        onClick={handleCanvasClick}
        className="max-w-full h-auto rounded-lg shadow-lg cursor-crosshair"
        style={{
          opacity: isLoading ? 0.5 : 1,
          transition: 'opacity 0.2s ease-in-out',
        }}
      />

      {canvasDimensions.width > 0 && (
        <div className="mt-2 text-sm text-gray-500 text-center">
          {`${Math.round(canvasDimensions.width)} × ${Math.round(canvasDimensions.height)} px`}
        </div>
      )}
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
