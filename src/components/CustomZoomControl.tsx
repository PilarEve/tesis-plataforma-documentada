"use client";

import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface CustomZoomControlProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export default function CustomZoomControl({ onZoomIn, onZoomOut }: CustomZoomControlProps) {
  // Evitar que el mapa detecte clics, arrastres o scroll al interactuar con el control
  const handleInteraction = (e: React.MouseEvent | React.TouchEvent | React.WheelEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="flex flex-col bg-white rounded-xl shadow-[0_4px_18px_rgba(0,0,0,0.12)] border border-slate-200/60 overflow-hidden z-[1000]"
      onClick={handleInteraction}
      onMouseDown={handleInteraction}
      onDoubleClick={handleInteraction}
      onTouchStart={handleInteraction}
      onWheel={handleInteraction}
    >
      <button 
        onClick={onZoomIn}
        className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 hover:text-slate-900 border-b border-slate-100 transition-all duration-150 cursor-pointer"
        title="Acercar"
      >
        <Plus size={20} className="stroke-[2.5]" />
      </button>
      <button 
        onClick={onZoomOut}
        className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 hover:text-slate-900 transition-all duration-150 cursor-pointer"
        title="Alejar"
      >
        <Minus size={20} className="stroke-[2.5]" />
      </button>
    </div>
  );
}
