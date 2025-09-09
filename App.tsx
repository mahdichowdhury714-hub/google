
import React, { useState, useCallback } from 'react';
import ImageEditor from './components/ImageEditor';
import ImageUploader from './components/ImageUploader';
import { AppStep } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setImageSrc(e.target.result);
        setStep(AppStep.EDIT);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = useCallback(() => {
    setImageSrc(null);
    setStep(AppStep.UPLOAD);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-5xl mx-auto text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700">Bangladesh Passport Photo Creator</h1>
        <p className="text-md text-gray-600 mt-2">Create official 4.5cm x 3.5cm photos in seconds.</p>
      </header>
      
      <main className="w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {step === AppStep.UPLOAD && <ImageUploader onImageUpload={handleImageUpload} />}
          {step === AppStep.EDIT && imageSrc && <ImageEditor imageSrc={imageSrc} onReset={handleReset} />}
        </div>
      </main>

      <footer className="w-full max-w-5xl mx-auto text-center mt-8 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AI Photo Generator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
