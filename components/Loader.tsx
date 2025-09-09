
import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Processing...' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-t-emerald-500 border-gray-200 rounded-full animate-spin"></div>
      <p className="text-white text-lg mt-4">{message}</p>
    </div>
  );
};

export default Loader;
