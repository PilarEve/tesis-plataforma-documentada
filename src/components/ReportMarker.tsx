"use client";

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Report } from '../types/report';
import { format } from 'date-fns';
import Image from 'next/image';


const createCustomIcon = () => {
  const color = '#3b82f6'; // blue-500
  
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
  const icon = createCustomIcon();
  
  return (
    <Marker position={[report.lat, report.lng]} icon={icon}>
      <Popup className="report-popup min-w-[250px]">
        <div className="w-64 p-0">
          {report.imageUrl && (
            <div className="-mx-5 -mt-4 mb-3">
              <Image 
                src={report.imageUrl} 
                alt="Imagen del reporte" 
                width={256}
                height={128}
                className="w-full h-32 object-cover rounded-t-lg"
                unoptimized
              />
            </div>
          )}
          <div>
            {report.impactTags && report.impactTags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                {report.impactTags.map(tag => (
                  <span key={tag} className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-700 mb-2">{report.description}</p>
            <div className="text-xs text-gray-500 flex flex-col gap-1">
              <p>Fecha: {format(new Date(report.dateTime), 'dd/MM/yyyy HH:mm')}</p>
              <p>Estado: <span className="capitalize">{report.status}</span></p>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
