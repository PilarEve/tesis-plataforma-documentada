"use client";

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Report } from '../types/report';
import { format } from 'date-fns';
import Image from 'next/image';

const getSeverityColor = (severity: Report['severity']) => {
  switch (severity) {
    case 'bajo': return '#22c55e'; // green-500
    case 'medio': return '#eab308'; // yellow-500
    case 'alto': return '#f97316'; // orange-500
    case 'critico': return '#ef4444'; // red-500
    default: return '#3b82f6'; // blue-500
  }
};

const getSeverityBg = (severity: Report['severity']) => {
  switch (severity) {
    case 'bajo': return 'bg-green-100/50 border-green-200 text-green-700';
    case 'medio': return 'bg-yellow-100/50 border-yellow-200 text-yellow-700';
    case 'alto': return 'bg-orange-100/50 border-orange-200 text-orange-700';
    case 'critico': return 'bg-red-100/50 border-red-200 text-red-700';
    default: return 'bg-blue-100/50 border-blue-200 text-blue-700';
  }
};

const createCustomIcon = (severity: Report['severity']) => {
  const color = getSeverityColor(severity);
  
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3" fill="white"></circle>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-icon bg-transparent border-0',
    html: svgIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface ReportMarkerProps {
  report: Report;
}

export default function ReportMarker({ report }: ReportMarkerProps) {
  const icon = createCustomIcon(report.severity);
  
  return (
    <Marker position={[report.lat, report.lng]} icon={icon}>
      <Popup className="report-popup custom-report-popup md:min-w-[320px]">
        <div className="w-72 sm:w-80 flex flex-col gap-3 p-1">
          {/* Header & Severity Badge */}
          <div className="flex justify-between items-center gap-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-gray-500">Reporte Ciudadano</span>
            <span className={`text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wider border shadow-sm ${getSeverityBg(report.severity)}`}>
              {report.severity}
            </span>
          </div>

          {/* Image */}
          {report.imageUrl && (
            <div className="w-full h-48 sm:h-[180px] relative rounded-xl overflow-hidden shadow-lg border border-gray-100">
              <Image 
                src={report.imageUrl} 
                alt="Imagen del reporte" 
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                unoptimized
              />
            </div>
          )}

          {/* Description */}
          <div className="text-sm text-gray-700 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
            <p className="leading-relaxed font-medium text-gray-800">
              {report.description}
            </p>
          </div>

          {/* Footer Details */}
          <div className="text-[11px] text-gray-500 flex flex-col gap-1.5 mt-1 border-t border-gray-100 pt-3">
            <p className="flex items-center gap-2">
              <span className="font-bold text-gray-700 w-14">Fecha:</span> 
              <span>{format(new Date(report.dateTime), 'dd/MM/yyyy HH:mm')}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-bold text-gray-700 w-14">Estado:</span> 
              <span className="capitalize px-1.5 py-0.5 bg-gray-100 rounded-md font-semibold text-gray-600 border border-gray-200">
                {report.status}
              </span>
            </p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
