"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { Report } from '../types/report';
import { MapPin, Camera, X, Loader2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

const AVAILABLE_TAGS = [
  'Calle inundada',
  'Deslizamiento',
  'Árbol caído',
  'Vivienda afectada',
  'Vehículo afectado',
  'Persona atrapada',
  'Fallecimiento reportado',
  'Interrupción de tránsito',
  'Servicio público afectado',
  'Sin daños visibles'
];
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultIcon = L.divIcon({
  className: 'custom-leaflet-icon bg-transparent border-0',
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" width="32" height="32" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3" fill="white"></circle>
    </svg>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function LocationSelector({ setLocation }: { setLocation: (lat: string, lng: string) => void }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng.lat.toString(), e.latlng.lng.toString());
    },
  });
  return null;
}

function MapUpdater({ lat, lng }: { lat: string; lng: string }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([parseFloat(lat), parseFloat(lng)], map.getZoom() < 15 ? 15 : map.getZoom(), { animate: true });
    }
  }, [lat, lng, map]);
  return null;
}

interface ReportFormProps {
  onClose: () => void;
  onSubmit: (report: Omit<Report, 'id' | 'status'>) => void;
}

export default function ReportForm({ onClose, onSubmit }: ReportFormProps) {
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [impactTags, setImpactTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAfectacionesOpen, setIsAfectacionesOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const handleGetLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toString());
          setLng(position.coords.longitude.toString());
          setIsLocating(false);
          setIsMapOpen(true); // Desplegar mapa para confirmación visual
        },
        (error) => {
          console.error("Error al obtener ubicación", error);
          alert("No se pudo obtener la ubicación. Por favor, ingrese las coordenadas manualmente.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocalización no soportada por el navegador.");
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lat || !lng) {
      alert("Seleccioná una ubicación en el mapa antes de enviar el reporte.");
      return;
    }
    const description = descriptionRef.current?.value || '';
    
    if (!imageUrl && !imageFile) {
      alert("Subí una foto del reporte antes de enviar.");
      return;
    }

    setIsSubmitting(true);
    let finalImageUrl = imageUrl;

    try {
      // 1. Subir imagen a Supabase Storage si existe un archivo seleccionado
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        const filePath = `reportes/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('reportes')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // 2. Obtener la URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('reportes')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      // 3. Enviar datos al componente padre
      onSubmit({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        description,
        impactTags,
        dateTime: new Date().toISOString(),
        imageUrl: finalImageUrl || undefined
      });
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      alert('Error al subir la imagen. El reporte se enviará sin imagen.');
      
      onSubmit({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        description,
        impactTags,
        dateTime: new Date().toISOString(),
        imageUrl: undefined
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-900/60 backdrop-blur-sm flex items-end md:items-center justify-center md:p-4 transition-all">
      <div className="bg-white md:rounded-3xl rounded-t-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300">
        
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <h2 className="text-xl font-bold relative z-10">Nuevo Reporte Ciudadano</h2>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition-colors relative z-10"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          <div className="space-y-3 border border-slate-100 rounded-2xl p-4 bg-slate-50/30">
            <div className="flex justify-between items-start select-none">
              <div>
                <label className="text-sm font-bold text-slate-700">Ubicación <span className="text-red-500">*</span></label>
                {lat && lng && !isMapOpen && (
                  <p className="text-xs text-green-600 font-semibold mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Ubicación seleccionada
                  </p>
                )}
              </div>
            </div>
            
            <p className="text-xs text-slate-500">
              Confirmá la ubicación del problema. Podés obtenerla automáticamente o marcarla en el mapa.
            </p>

            <div className="flex flex-col gap-2 md:flex-row">
              <button 
                type="button" 
                onClick={handleGetLocation}
                disabled={isLocating}
                className="flex-1 flex justify-center items-center gap-2 py-3 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-blue-100 cursor-pointer"
              >
                <MapPin size={18} /> 
                {isLocating ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
              </button>

              <button 
                type="button"
                onClick={() => setIsMapOpen(!isMapOpen)}
                className={`flex-1 flex justify-center items-center gap-2 py-3 text-sm font-bold border rounded-xl transition-all cursor-pointer ${
                  isMapOpen 
                    ? 'bg-slate-100 border-slate-300 text-slate-700' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span>Ubicar manualmente</span>
                {isMapOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isMapOpen ? 'max-h-[350px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
              <p className="text-xs text-slate-500 mb-2 pt-2">Marcá la ubicación exacta del evento tocando o haciendo clic en el mapa.</p>
              <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-200 relative z-0">
                {useMemo(() => (
                  <MapContainer 
                    center={[-25.2855, -57.6150]} 
                    zoom={13} 
                    zoomControl={false}
                    className="w-full h-full"
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                    <LocationSelector setLocation={(l, lg) => { setLat(l); setLng(lg); }} />
                    <MapUpdater lat={lat} lng={lng} />
                    {lat && lng && (
                      <Marker position={[parseFloat(lat), parseFloat(lng)]} icon={defaultIcon} />
                    )}
                  </MapContainer>
                ), [lat, lng])}
              </div>
            </div>
          </div>

          <div className="space-y-3 border border-slate-100 rounded-2xl p-4 bg-slate-50/30">
            <div 
              onClick={() => setIsAfectacionesOpen(!isAfectacionesOpen)}
              className="flex items-center justify-between cursor-pointer select-none group"
            >
              <div>
                <label className="text-sm font-bold text-slate-700 cursor-pointer group-hover:text-blue-600 transition-colors">
                  ¿Qué afectaciones se observan?
                </label>
                {!isAfectacionesOpen && impactTags.length > 0 && (
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">
                    {impactTags.length} {impactTags.length === 1 ? 'afectación seleccionada' : 'afectaciones seleccionadas'}
                  </p>
                )}
              </div>
              <div className="text-slate-400 bg-slate-100 group-hover:bg-slate-200 p-1.5 rounded-full transition-colors">
                {isAfectacionesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isAfectacionesOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="text-xs text-slate-500 mb-3 pt-2">Opcional. Podés seleccionar una o varias opciones.</p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => {
                  const isSelected = impactTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setImpactTags(prev => prev.filter(t => t !== tag));
                        } else {
                          setImpactTags(prev => [...prev, tag]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-100 border-blue-500 text-blue-800' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {(impactTags.includes('Persona atrapada') || impactTags.includes('Fallecimiento reportado')) && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-red-700 font-medium">
                  Si hay personas en riesgo o una emergencia activa, contactá inmediatamente a los servicios de emergencia correspondientes.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-600">Descripción del evento</label>
            <p className="text-xs text-slate-500">Opcional. Podés agregar más detalles sobre la situación.</p>
            <textarea 
              ref={descriptionRef}
              placeholder="Describa la situación de la inundación (ej: agua sobre la vereda, arroyo desbordado)..."
              className="w-full text-sm p-4 bg-slate-50 border border-slate-200 rounded-xl h-28 resize-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-600">Fotografía <span className="text-red-500">*</span></label>
            <div className="relative border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group min-h-[150px] flex flex-col items-center justify-center">
              {imageUrl ? (
                <div className="w-full h-48 relative">
                  <Image 
                    src={imageUrl} 
                    alt="Imagen enviada por ciudadano sobre evento reportado" 
                    fill
                    className="object-cover"
                    unoptimized={imageUrl.startsWith('blob:')}
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-slate-900/60 px-3 py-1.5 rounded-full backdrop-blur-sm">Cambiar Imagen</span>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex flex-col items-center justify-center text-slate-500">
                  <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Camera size={24} className="text-slate-400 group-hover:text-blue-500" />
                  </div>
                  <span className="text-sm text-center font-medium">Haga clic para adjuntar evidencia gráfica o tomar foto</span>
                </div>
              )}
              
              <input 
                type="file" 
                id="file-upload"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  if(e.target.files && e.target.files[0]) {
                     const file = e.target.files[0];
                     setImageFile(file);
                     setImageUrl(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
            {imageUrl && <p className="text-xs text-green-600 mt-2 font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Imagen adjuntada correctamente.</p>}
          </div>

          <div className="pt-6 pb-2">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-xl shadow-[0_8px_20px_rgb(37,99,235,0.3)] hover:shadow-[0_8px_25px_rgb(37,99,235,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Enviando reporte...
                </>
              ) : 'Confirmar y Enviar Reporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
