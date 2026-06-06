"use client";

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { NoticiaHistorica } from '../types/report';
import { format } from 'date-fns';

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
        <div className="w-60 sm:w-64 flex flex-col gap-1.5 p-0.5">
          {/* 1. Título y Badge Requirement 9 */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-gray-900 text-lg leading-tight uppercase tracking-tight">
              {news.titulo}
            </h3>
            <span className="bg-orange-100 text-orange-700 text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm border border-orange-200">
              Histórico
            </span>
          </div>
          
          {/* 2. Imagen Grande Requirement 2 & 6 */}
          {news.imagen_url && (
            <div className="w-full h-32 sm:h-36 relative rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <img 
                src={news.imagen_url} 
                alt={news.titulo} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="text-xs text-gray-700 px-0.5">
            <p className="leading-snug">
              {descripcionMostrar}
            </p>
          </div>

          <div className="text-[11px] text-gray-600 flex flex-col gap-0.5 mt-0.5 border-t border-gray-50 pt-1.5">
            {hasValue(news.fecha_publicacion) && (
              <p className="flex items-center gap-1">
                <span className="font-bold text-gray-800 w-14">Fecha:</span> 
                <span className="text-gray-600">
                  {format(new Date(news.fecha_publicacion), 'dd/MM/yyyy')}
                </span>
              </p>
            )}
            
            {hasValue(news.ubicacion_texto) && (
              <p className="flex items-start gap-1">
                <span className="font-bold text-gray-800 w-14">Ubicación:</span> 
                <span className="flex-1 text-gray-600 leading-tight">{news.ubicacion_texto}</span>
              </p>
            )}
            
            {hasValue(news.tipo_evento) && (
              <p className="flex items-center gap-1">
                <span className="font-bold text-gray-800 w-14">Tipo:</span> 
                <span className="capitalize text-gray-600">{news.tipo_evento}</span>
              </p>
            )}
            
            {hasValue(news.gravedad) && (
              <p className="flex items-center gap-1">
                <span className="font-bold text-gray-800 w-14">Gravedad:</span> 
                <span className="capitalize font-bold text-orange-700">
                  {news.gravedad}
                </span>
              </p>
            )}

            {hasValue(news.fuente) && (
              <p className="flex items-center gap-1">
                <span className="font-bold text-gray-800 w-14">Fuente:</span> 
                <span className="text-gray-500 italic truncate">{news.fuente}</span>
              </p>
            )}
          </div>

          {/* 9. Enlace URL Requirement 5 */}
          {news.url && (
            <div className="mt-1 pt-2 border-t border-gray-50">
              <a 
                href={news.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all duration-200 w-full text-center block py-1.5 rounded shadow-sm hover:shadow-md uppercase tracking-wide"
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
