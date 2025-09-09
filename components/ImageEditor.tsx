
import React, { useState, useCallback, useMemo } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import { changeBackground } from '../services/geminiService';
import { createCroppedImage, downloadImage } from '../utils/imageUtils';
import Slider from './Slider';
import ColorPicker from './ColorPicker';
import Loader from './Loader';
import { ArrowPathIcon } from './icons/ArrowPathIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageEditorProps {
  imageSrc: string;
  onReset: () => void;
}

const PASSPORT_ASPECT_RATIO = 3.5 / 4.5;

const ImageEditor: React.FC<ImageEditorProps> = ({ imageSrc, onReset }) => {
  const [currentImage, setCurrentImage] = useState(imageSrc);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleChangeBackground = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resultImage = await changeBackground(currentImage, backgroundColor);
      setCurrentImage(resultImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!croppedAreaPixels) return;
    setIsLoading(true);
    setError(null);
    try {
      const croppedImage = await createCroppedImage(
        currentImage,
        croppedAreaPixels,
        backgroundColor,
        brightness,
        contrast
      );
      downloadImage(croppedImage);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const imageStyle = useMemo(() => ({
    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
  }), [brightness, contrast]);

  return (
    <div className="space-y-6">
      {isLoading && <Loader message={error ? "Error" : "AI is processing your image..."} />}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 relative aspect-[3.5/4.5] bg-gray-200 rounded-lg overflow-hidden shadow-inner">
          <Cropper
            image={currentImage}
            crop={crop}
            zoom={zoom}
            aspect={PASSPORT_ASPECT_RATIO}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            // FIX: The 'react-easy-crop' library uses 'mediaStyle' to style the image/video element, not 'imageStyle'.
            style={{
              containerStyle: { backgroundColor: backgroundColor },
              mediaStyle: imageStyle,
            }}
          />
        </div>

        <div className="space-y-6 flex flex-col">
            <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-semibold text-lg mb-3">Controls</h3>
                <div className="space-y-4">
                    <Slider label="Zoom" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} min={1} max={3} step={0.01} />
                    <Slider label="Brightness" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} min={50} max={150} />
                    <Slider label="Contrast" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} min={50} max={150} />
                </div>
            </div>
          
            <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-semibold text-lg mb-3">Background Color</h3>
                <ColorPicker selectedColor={backgroundColor} onColorChange={setBackgroundColor} />
            </div>

            <div className="mt-auto space-y-2 pt-4">
              <button
                onClick={handleChangeBackground}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
              >
                <SparklesIcon className="w-5 h-5" />
                Change Background (AI)
              </button>
              <button
                onClick={handleDownload}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-300"
              >
                <DownloadIcon className="w-5 h-5" />
                Download Photo
              </button>
              <button
                onClick={onReset}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                <ArrowPathIcon className="w-5 h-5" />
                Start Over
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;