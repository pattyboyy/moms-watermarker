import { downloadFile } from '../lib/utils';

export const exportImageWithSettings = async (canvas, settings = {}) => {
  if (!canvas) {
    throw new Error('No canvas element provided');
  }

  try {
    // Determine the MIME type based on format
    const mimeTypes = {
      'png': 'image/png',
      'jpeg': 'image/jpeg',
      'webp': 'image/webp'
    };
    const mimeType = mimeTypes[settings.format?.toLowerCase()] || 'image/png';
    
    // For PNG, quality is ignored as it's lossless
    const quality = settings.format?.toLowerCase() === 'png' ? 1 : (settings.quality || 80) / 100;
    
    // Get the data URL from canvas
    const dataUrl = canvas.toDataURL(mimeType, quality);
    
    // Generate filename with extension
    const filename = `${settings.filename || 'watermarked-image'}.${settings.format?.toLowerCase() || 'png'}`;
    
    // Download the file
    downloadFile(dataUrl, filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Error exporting image:', error);
    throw new Error('Failed to export image');
  }
};

export const quickDownload = async (canvas) => {
  if (!canvas) {
    throw new Error('No canvas element provided');
  }

  try {
    // Use PNG format for quick downloads
    const dataUrl = canvas.toDataURL('image/png');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `watermarked-image-${timestamp}.png`;
    
    downloadFile(dataUrl, filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('Failed to download image');
  }
};

export const applyWatermarkToMultipleImages = async (images, watermarkSettings) => {
  const results = [];
  
  for (const imageData of images) {
    try {
      // Create a temporary canvas for each image
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      const img = new Image();
      
      // Load the image and process it
      await new Promise((resolve, reject) => {
        img.onload = () => {
          // Set canvas dimensions to match image
          tempCanvas.width = img.width;
          tempCanvas.height = img.height;
          
          // Draw the image
          ctx.drawImage(img, 0, 0);
          
          // Apply watermark
          if (watermarkSettings?.text) {
            applyWatermark(tempCanvas, watermarkSettings);
          }
          
          resolve();
        };
        img.onerror = reject;
        img.src = imageData;
      });
      
      // Get the processed image data
      const processedImageData = tempCanvas.toDataURL('image/png');
      results.push({
        success: true,
        data: processedImageData
      });
    } catch (error) {
      console.error('Error processing image:', error);
      results.push({
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
};