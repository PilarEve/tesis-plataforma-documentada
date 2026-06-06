"use client";

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { NoticiaHistorica } from '../types/report';
import { format } from 'date-fns';
import Image from 'next/image';

const ORANGE_COLOR = '#f97316'; // orange-500

const createCustomIcon = () => {
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${ORANGE_COLOR}" width="32" height="32" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

interface NewsMarkerProps {
  news: NoticiaHistorica;
}

export default function NewsMarker({ news }: NewsMarkerProps) {
  const icon = createCustomIcon();
  
  // Requirement 1: Fallback description
  const descripcionMostrar = news.descripcion?.trim() || news.titulo;
  
  // Utility for conditional rendering Requirement 3
  const hasValue = (val: string | undefined | null) => val && val.trim() !== "";

  return (
    <Marker position={[news.latitud, news.longitud]} icon={icon}>
      <Popup className="report-popup custom-news-popup">
        <div className="w-56 sm:w-60 flex flex-col gap-1 p-0.5">
          {/* 1. Título y Badge Requirement 9 */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-gray-900 text-sm leading-tight uppercase tracking-tight">
              {news.titulo}
            </h3>
            <span className="bg-orange-100 text-orange-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap border border-orange-200">
              Histórico
            </span>
          </div>
          
          {news.imagen_url && (
            <div className="w-full h-24 sm:h-28 relative rounded overflow-hidden border border-gray-100">
              <Image 
                src={news.imagen_url} 
                alt={news.titulo} 
                fill
                className="object-cover"
                sizes="(max-width: 640px) 224px, 240px"
              />
            </div>
          )}

          <div className="text-[11px] text-gray-700 px-0.5">
            <p className="leading-tight">
              {descripcionMostrar}
            </p>
          </div>

          <div className="text-[10px] text-gray-600 grid grid-cols-2 gap-x-2 gap-y-0 border-t border-gray-50 pt-1">
            {hasValue(news.fecha_publicacion) && (
              <p className="flex items-center gap-1">
                <span className="font-bold text-gray-800">Fecha:</span> 
                <span className="text-gray-600 truncate">
                  {format(new Date(news.fecha_publicacion), 'dd/MM/yyyy')}
                </span>
              </p>
            )}
            
            {hasValue(news.tipo_evento) && (
              <p className="flex items-center gap-1">
                <span className="font-bold text-gray-800">Tipo:</span> 
                <span className="capitalize text-gray-600 truncate">{news.tipo_evento}</span>
              </p>
            )}
            
            {hasValue(news.gravedad) && (
              <p className="flex items-center gap-1">
                <span className="font-bold text-gray-800">Gravedad:</span> 
                <span className="capitalize font-bold text-orange-700 truncate">
                  {news.gravedad}
                </span>
              </p>
            )}

            {hasValue(news.fuente) && (
              <p className="flex items-center gap-1">
                <span className="font-bold text-gray-800">Fuente:</span> 
                <span className="text-gray-500 italic truncate">{news.fuente}</span>
              </p>
            )}

            {hasValue(news.ubicacion_texto) && (
              <p className="flex items-start gap-1 col-span-2 mt-0.5 border-t border-gray-50/50 pt-0.5">
                <span className="font-bold text-gray-800 shrink-0">Ubicación:</span> 
                <span className="flex-1 text-gray-600 leading-tight">{news.ubicacion_texto}</span>
              </p>
            )}
          </div>

          {/* 9. Enlace URL Requirement 5 */}
          {news.url && (
            <div className="mt-0.5">
              <a 
                href={news.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[9px] font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all duration-200 w-full text-center block py-1 rounded shadow-sm uppercase tracking-wide"
              >
                Ver Noticia Completa
              </a>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
