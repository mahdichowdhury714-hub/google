import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageUpload(e.target.files[0]);
    }
  };

  // FIX: The drag event handlers are attached to a <label> element, so the event type for all handlers must be React.DragEvent<HTMLLabelElement>.
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <label
        htmlFor="image-upload"
        className={`w-full p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center pointer-events-none">
          <UploadIcon className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-lg font-semibold text-gray-700">Drag & drop your photo here</p>
          <p className="text-gray-500">or click to browse</p>
          <p className="text-xs text-gray-400 mt-4">PNG, JPG, or WEBP. High resolution recommended.</p>
        </div>
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUploader;
