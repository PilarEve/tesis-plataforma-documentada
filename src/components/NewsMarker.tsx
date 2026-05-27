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
  
  const descripcionMostrar = news.descripcion || news.titulo;

  return (
    <Marker position={[news.latitud, news.longitud]} icon={icon}>
      <Popup className="report-popup custom-news-popup md:min-w-[300px]">
        <div className="w-72 flex flex-col gap-3 p-1">
          {/* Título y Badge */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-gray-900 text-base leading-tight">
              {news.titulo}
            </h3>
            <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
              Histórico
            </span>
          </div>
          
          {/* Imagen Grande (Opcional) */}
          {news.imagen_url && (
            <div className="w-full h-48 sm:h-52 relative rounded-lg overflow-hidden shadow-md border border-gray-200">
              <img 
                src={news.imagen_url} 
                alt={news.titulo} 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}

          {/* Descripción */}
          {descripcionMostrar && (
            <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-100">
              <p className="line-clamp-4 italic">
                "{descripcionMostrar.length > 250 ? `${descripcionMostrar.substring(0, 250)}...` : descripcionMostrar}"
              </p>
            </div>
          )}

          {/* Detalles (Ocultando los vacíos) */}
          <div className="text-xs text-gray-600 flex flex-col gap-1.5 mt-1 border-t border-gray-100 pt-2">
            {news.fecha_publicacion && (
              <p className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-800">Fecha:</span> 
                {format(new Date(news.fecha_publicacion), 'dd/MM/yyyy')}
              </p>
            )}
            
            {news.ubicacion_texto && (
              <p className="flex items-start gap-1.5">
                <span className="font-semibold text-gray-800">Ubicación:</span> 
                <span className="flex-1">{news.ubicacion_texto}</span>
              </p>
            )}
            
            {news.tipo_evento && (
              <p className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-800">Tipo:</span> 
                <span className="capitalize">{news.tipo_evento}</span>
              </p>
            )}
            
            {news.gravedad && (
              <p className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-800">Gravedad:</span> 
                <span className="capitalize font-medium px-1.5 py-0.5 rounded text-orange-700 bg-orange-50">{news.gravedad}</span>
              </p>
            )}

            {news.fuente && (
              <p className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-800">Fuente:</span> 
                <span className="text-gray-500">{news.fuente}</span>
              </p>
            )}
          </div>

          {/* Enlace URL */}
          {news.url && (
            <div className="mt-1 pt-2 border-t border-gray-100">
              <a 
                href={news.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline transition-colors w-full text-center block bg-blue-50 hover:bg-blue-100 py-1.5 rounded"
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
