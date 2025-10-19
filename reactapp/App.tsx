import React, { useState } from 'react';

const App: React.FC = () => {
  const [backgroundColor, setBackgroundColor] = useState('#6366F1'); // Initial color: Indigo 500

  const generateRandomHexColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setBackgroundColor(randomColor);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: backgroundColor }}
      aria-live="polite"
    >
      <div className="text-center p-8 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg max-w-sm w-full border border-white/20">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 tracking-tight">
          Color Flipper
        </h1>
        <div className="mb-6 p-4 rounded-lg bg-gray-800/80">
           <p className="text-lg text-white font-mono tracking-widest" aria-label={`Current color is ${backgroundColor}`}>
            {backgroundColor}
          </p>
        </div>
        <button
          onClick={generateRandomHexColor}
          className="px-8 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transform hover:scale-105 transition-all duration-200"
          aria-label="Generate a new random color"
        >
          Change Color
        </button>
      </div>
    </div>
  );
};

export default App;
