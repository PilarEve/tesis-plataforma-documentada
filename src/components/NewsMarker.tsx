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
      <Popup className="report-popup custom-news-popup md:min-w-[320px]">
        <div className="w-72 sm:w-80 flex flex-col gap-3 p-1">
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
            <div className="w-full h-48 sm:h-[200px] relative rounded-xl overflow-hidden shadow-lg border border-gray-100">
              <img 
                src={news.imagen_url} 
                alt={news.titulo} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}

          {/* 3. Descripción Requirement 4 & 5 */}
          <div className="text-sm text-gray-700 bg-orange-50/30 p-3 rounded-lg border border-orange-100/50">
            <p className="leading-relaxed">
              {descripcionMostrar}
            </p>
          </div>

          {/* Detalles Requirement 3 & 5 */}
          <div className="text-xs text-gray-600 flex flex-col gap-2 mt-1 border-t border-gray-100 pt-3">
            {hasValue(news.fecha_publicacion) && (
              <p className="flex items-center gap-2">
                <span className="font-bold text-gray-800 w-16">Fecha:</span> 
                <span className="text-gray-600 font-medium">
                  {format(new Date(news.fecha_publicacion), 'dd/MM/yyyy')}
                </span>
              </p>
            )}
            
            {hasValue(news.ubicacion_texto) && (
              <p className="flex items-start gap-2">
                <span className="font-bold text-gray-800 w-16">Ubicación:</span> 
                <span className="flex-1 text-gray-600">{news.ubicacion_texto}</span>
              </p>
            )}
            
            {hasValue(news.tipo_evento) && (
              <p className="flex items-center gap-2">
                <span className="font-bold text-gray-800 w-16">Tipo:</span> 
                <span className="capitalize text-gray-600 px-2 py-0.5 bg-gray-100 rounded">{news.tipo_evento}</span>
              </p>
            )}
            
            {hasValue(news.gravedad) && (
              <p className="flex items-center gap-2">
                <span className="font-bold text-gray-800 w-16">Gravedad:</span> 
                <span className="capitalize font-bold px-2 py-0.5 rounded text-orange-700 bg-orange-100/50 border border-orange-200/50">
                  {news.gravedad}
                </span>
              </p>
            )}

            {hasValue(news.fuente) && (
              <p className="flex items-center gap-2">
                <span className="font-bold text-gray-800 w-16">Fuente:</span> 
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
                className="text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all duration-200 w-full text-center block py-2.5 rounded-lg shadow-sm hover:shadow-md uppercase tracking-wide"
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
