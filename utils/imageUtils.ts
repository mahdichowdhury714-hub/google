
import { Area } from '../types';

export const createCroppedImage = (
  imageSrc: string,
  pixelCrop: Area,
  backgroundColor: string,
  brightness: number,
  contrast: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Failed to get canvas context'));
      }

      // Bangladesh Passport Photo aspect ratio 3.5:4.5
      // Standard resolution: 413px x 531px @ 300 DPI
      const outputWidth = 413;
      const outputHeight = 531;

      canvas.width = outputWidth;
      canvas.height = outputHeight;

      // Fill background color first
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outputWidth,
        outputHeight
      );

      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    image.onerror = (error) => {
      reject(error);
    };
  });
};

export const downloadImage = (dataUrl: string, filename = 'passport-photo.jpg') => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
