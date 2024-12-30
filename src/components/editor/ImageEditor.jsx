import React from 'react';
import FileUpload from './FileUpload';
import WatermarkDesigner from '../watermark/WatermarkDesigner';
import ImageCropper from './ImageCropper';
import useEditorStore from '../../store/editorStore';

const ImageEditor = ({ canvasRef }) => {
  const currentImage = useEditorStore((state) => state.currentImage);

  return (
    <div className="h-full flex flex-col">
      {!currentImage ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <FileUpload />
        </div>
      ) : (
        <div className="flex-1 flex gap-4 p-4">
          <div className="flex-1">
            <ImageCropper canvasRef={canvasRef} />
          </div>
          <div className="w-80">
            <WatermarkDesigner />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;