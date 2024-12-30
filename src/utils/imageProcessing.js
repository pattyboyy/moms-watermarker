// Image processing utilities for handling images, watermarks, and adjustments

export const processImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          resolve(img);
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  export const applyWatermark = (canvas, watermarkSettings) => {
    const ctx = canvas.getContext('2d');
    const {
      text,
      font,
      size,
      color,
      opacity,
      position,
      rotation,
      alignment,
      enableShadow,
      shadowOpacity
    } = watermarkSettings;
  
    if (!text) return;
  
    // Save current context state
    ctx.save();
  
    // Set watermark style
    ctx.globalAlpha = opacity;
    ctx.font = `${size}px ${font}`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
  
    // Calculate text metrics
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    
    // Calculate position based on alignment and position settings
    let x = (canvas.width * position.x) / 100;
    let y = (canvas.height * position.y) / 100;
  
    // Adjust x position based on alignment
    switch (alignment) {
      case 'left':
        break;
      case 'center':
        x -= textWidth / 2;
        break;
      case 'right':
        x -= textWidth;
        break;
    }
  
    // Set up rotation if needed
    if (rotation !== 0) {
      // Move to rotation center point
      ctx.translate(x + textWidth / 2, y);
      // Rotate
      ctx.rotate((rotation * Math.PI) / 180);
      // Move back
      ctx.translate(-(x + textWidth / 2), -y);
    }
  
    // Apply shadow if enabled
    if (enableShadow) {
      ctx.shadowColor = `rgba(0, 0, 0, ${shadowOpacity})`;
      ctx.shadowBlur = size / 8;
      ctx.shadowOffsetX = size / 16;
      ctx.shadowOffsetY = size / 16;
    }
  
    // Draw the watermark text
    ctx.fillText(text, x, y);
  
    // Restore context state
    ctx.restore();
  };
  
  export const applyImageAdjustments = (canvas, settings) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
  
    const brightness = settings.brightness / 100;
    const contrast = settings.contrast / 100;
    const saturation = settings.saturation / 100;
  
    // Create a lookup table for faster processing
    const brightnessLookup = new Uint8Array(256);
    const contrastLookup = new Uint8Array(256);
    
    for (let i = 0; i < 256; i++) {
      brightnessLookup[i] = Math.min(255, Math.max(0, i * brightness));
      contrastLookup[i] = Math.min(255, Math.max(0, 
        ((i - 128) * contrast + 128)));
    }
  
    for (let i = 0; i < data.length; i += 4) {
      // Apply brightness and contrast using lookup tables
      data[i] = contrastLookup[brightnessLookup[data[i]]];       // R
      data[i + 1] = contrastLookup[brightnessLookup[data[i + 1]]]; // G
      data[i + 2] = contrastLookup[brightnessLookup[data[i + 2]]]; // B
  
      // Apply saturation
      if (saturation !== 1) {
        const gray = 0.2989 * data[i] + 0.5870 * data[i + 1] + 0.1140 * data[i + 2];
        data[i] = Math.min(255, Math.max(0, gray + (data[i] - gray) * saturation));
        data[i + 1] = Math.min(255, Math.max(0, gray + (data[i + 1] - gray) * saturation));
        data[i + 2] = Math.min(255, Math.max(0, gray + (data[i + 2] - gray) * saturation));
      }
    }
  
    ctx.putImageData(imageData, 0, 0);
  };
  
  export const rotateImage = (canvas, angle) => {
    const ctx = canvas.getContext('2d');
    
    // Create a temporary canvas
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // Set the temporary canvas to the same size
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    // Copy the original image to the temporary canvas
    tempCtx.drawImage(canvas, 0, 0);
    
    // Clear the original canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate new dimensions if needed
    let newWidth = canvas.width;
    let newHeight = canvas.height;
    
    if (angle === 90 || angle === 270) {
      // Swap dimensions for 90° or 270° rotation
      canvas.width = newHeight;
      canvas.height = newWidth;
    }
    
    // Rotate and draw
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.drawImage(
      tempCanvas,
      -tempCanvas.width / 2,
      -tempCanvas.height / 2
    );
    ctx.restore();
  };
  
  export const resizeImage = (canvas, scale) => {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    const scaleValue = scale / 100;
    
    // Store original dimensions
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    
    // Copy original image
    tempCanvas.width = originalWidth;
    tempCanvas.height = originalHeight;
    tempCtx.drawImage(canvas, 0, 0);
    
    // Set new dimensions
    canvas.width = Math.round(originalWidth * scaleValue);
    canvas.height = Math.round(originalHeight * scaleValue);
    
    // Draw resized image
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      tempCanvas,
      0, 0,
      originalWidth, originalHeight,
      0, 0,
      canvas.width, canvas.height
    );
  };
  
  export const exportImage = (canvas, format = 'png', quality = 0.8) => {
    // Determine the MIME type
    const mimeTypes = {
      'png': 'image/png',
      'jpeg': 'image/jpeg',
      'webp': 'image/webp'
    };
  
    const mimeType = mimeTypes[format.toLowerCase()] || 'image/png';
    
    // For PNG, quality is ignored as it's lossless
    if (format.toLowerCase() === 'png') {
      return canvas.toDataURL(mimeType);
    }
    
    // For JPEG and WebP, apply quality setting
    return canvas.toDataURL(mimeType, quality);
  };
  
  export const createThumbnail = async (image, maxWidth = 300, maxHeight = 300) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      // Calculate thumbnail dimensions while maintaining aspect ratio
      let width = image.width;
      let height = image.height;
      
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
  
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
  
      // Draw thumbnail
      ctx.drawImage(image, 0, 0, width, height);
      
      // Convert to data URL
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    });
  };
  
  export const applyFilter = (canvas, filterType) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
  
    switch (filterType) {
      case 'grayscale':
        for (let i = 0; i < data.length; i += 4) {
          const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = gray;     // R
          data[i + 1] = gray; // G
          data[i + 2] = gray; // B
        }
        break;
  
      case 'sepia':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));     // R
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168)); // G
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131)); // B
        }
        break;
  
      case 'invert':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];         // R
          data[i + 1] = 255 - data[i + 1]; // G
          data[i + 2] = 255 - data[i + 2]; // B
        }
        break;
  
      default:
        return;
    }
  
    ctx.putImageData(imageData, 0, 0);
  };