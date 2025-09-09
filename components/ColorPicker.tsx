
import React from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const PRESET_COLORS = ['#ffffff', '#0073e6', '#e60000', '#cccccc'];

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange }) => {
  return (
    <div className="flex items-center gap-2">
      {PRESET_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onColorChange(color)}
          className={`w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110 ${selectedColor.toLowerCase() === color ? 'border-emerald-500 scale-110' : 'border-transparent'}`}
          style={{ backgroundColor: color }}
          aria-label={`Select ${color} background`}
        />
      ))}
      <div className="relative w-8 h-8">
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Select custom background color"
        />
        <div 
          className="w-full h-full rounded-full border-2 border-gray-300" 
          style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} 
        />
      </div>
    </div>
  );
};

export default ColorPicker;
