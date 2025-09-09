
import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
}

const Slider: React.FC<SliderProps> = ({ label, value, onChange, min = 0, max = 100, step = 1 }) => {
  return (
    <div>
      <label htmlFor={label} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
      />
    </div>
  );
};

export default Slider;
