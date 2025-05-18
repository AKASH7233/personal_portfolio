
import { useEffect, useRef } from 'react';

export default function DeveloperGif() {
  return (
    <div className="flex items-center justify-center h-[400px] md:h-[500px] w-full">
      <div className="relative w-full h-full max-w-[400px] overflow-hidden rounded-lg shadow-lg border-2 border-aqua/20">
        {/* Using coding developer gif */}
        <img 
          src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif" 
          alt="Developer coding" 
          className="w-full h-full object-cover"
        />
        
        {/* Overlay for better contrast with text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Text overlay */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-white text-shadow-md font-medium">Building amazing web experiences</p>
        </div>
      </div>
    </div>
  );
}
