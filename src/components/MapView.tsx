"use client";

import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockReports } from '../data/reports';
import { Report, NoticiaHistorica } from '../types/report';
import ReportMarker from './ReportMarker';
import NewsMarker from './NewsMarker';
import FilterPanel from './FilterPanel';
import SidebarReports from './SidebarReports';
import HeatmapLayer from './HeatmapLayer';
import ReportForm from './ReportForm';
import { Plus, ListFilter, X, Loader2, ChevronRight, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';


const ASUNCION_CENTER: [number, number] = [-25.2855, -57.6150];

export default function MapView() {
  const [reports, setReports] = useState<Report[]>([]); // Inicializamos vacío
  const [news, setNews] = useState<NoticiaHistorica[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [isHeatmapVisible, setIsHeatmapVisible] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return false;
    }
    return true;
  });

  // Invalidar el tamaño del mapa de Leaflet cuando el sidebar se colapsa/despliega
  useEffect(() => {
    if (mapRef) {
      const timer = setTimeout(() => {
        mapRef.invalidateSize();
      }, 350); // Ligeramente mayor que la transición del sidebar (300ms)
      return () => clearTimeout(timer);
    }
  }, [isSidebarOpen, mapRef]);

  // Cargar reportes desde Supabase al montar el componente
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('reportes')
          .select('*')
          .order('creado_en', { ascending: false });

        if (error) {
          console.error('Error fetching reports:', error);
          setReports(mockReports);
        } else if (data) {
          // Mapeamos los datos de la DB a nuestro formato de Report
          const mappedReports: Report[] = data.map(dbReport => ({
            id: dbReport.id,
            lat: Number(dbReport.latitud),
            lng: Number(dbReport.longitud),
            description: dbReport.descripcion || 'Sin descripción',
            impactTags: dbReport.afectaciones || [],
            dateTime: dbReport.creado_en || new Date().toISOString(),
            imageUrl: dbReport.imagen_url || undefined,
            status: (dbReport.estado || 'pendiente') as Report['status'],
            archivoTipo: dbReport.archivo_tipo || null
          }));
          setReports(mappedReports);
        }

        const { data: newsData, error: newsError } = await supabase
          .from('noticias_historicas')
          .select('*')
          .order('fecha_publicacion', { ascending: false });

        if (newsError) {
          console.error('Error fetching news:', newsError);
        } else if (newsData) {
          const validNews = newsData
            .filter(n => 
              n.latitud != null && 
              n.longitud != null && 
              n.latitud !== '' && 
              n.longitud !== '' && 
              !isNaN(Number(n.latitud)) && 
              !isNaN(Number(n.longitud))
            )
            .map(n => {
              const parsedLat = Number(n.latitud);
              const parsedLng = Number(n.longitud);
              console.log('Noticia Histórica:', n.titulo, '| Lat:', parsedLat, '| Lng:', parsedLng);
              return {
                ...n,
                latitud: parsedLat,
                longitud: parsedLng
              };
            }) as NoticiaHistorica[];
          setNews(validNews);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setReports(mockReports);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchTags = selectedTags.length === 0 || 
        (report.impactTags && report.impactTags.some(tag => selectedTags.includes(tag)));
      const matchStatus = selectedStatus === 'todos' || report.status === selectedStatus;
      return matchTags && matchStatus;
    });
  }, [reports, selectedTags, selectedStatus]);

  const handleFilterChange = (tags: string[], status: string) => {
    setSelectedTags(tags);
    setSelectedStatus(status);
  };

  const handleAddReport = (newReport: Report) => {
    setReports(prev => [newReport, ...prev]);
    setShowReportForm(false);
    if (mapRef) mapRef.setView([newReport.lat, newReport.lng], 15);
  };

  const handleSelectReportFromSidebar = (report: Report) => {
    if (mapRef) {
      mapRef.setView([report.lat, report.lng], 16);
      if (window.innerWidth < 768) setIsSidebarOpen(false); // Cierra sidebar en móvil
    }
  };

  return (
    <div className="flex w-full h-full min-h-0 bg-slate-50 overflow-hidden relative font-sans text-slate-800">
      
      {/* Botones Flotantes Inferiores Derechos */}
      <div className="absolute bottom-24 right-4 md:bottom-8 md:right-8 z-[1000] flex flex-col gap-3 md:gap-4 items-end">
        
        {/* Botón Ver Reportes (Solo Móvil) */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`md:hidden bg-white text-slate-700 font-bold py-3.5 px-5 rounded-full shadow-[0_8px_20px_rgb(0,0,0,0.15)] flex items-center gap-2 transition-all transform active:scale-95 border border-slate-200 ${isSidebarOpen ? 'bg-slate-100' : ''}`}
        >
          {isSidebarOpen ? <X size={20} /> : <ListFilter size={20} />}
          <span className="text-sm">{isSidebarOpen ? 'Cerrar Lista' : 'Ver Reportes'}</span>
        </button>

        {/* Botón Flotante para Nuevo Reporte */}
        <button 
          onClick={() => setShowReportForm(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3.5 px-6 md:py-4 md:px-8 rounded-full shadow-2xl shadow-blue-500/30 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 border border-blue-400/20"
        >
          <Plus size={22} className="drop-shadow-md" />
          <span className="text-sm md:text-base drop-shadow-md">Nuevo Reporte</span>
        </button>

      </div>

      {/* Overlay Oscuro para móvil cuando el sidebar está abierto */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1500] md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar de Lista de Reportes */}
      <div className={`
        fixed md:relative top-0 left-0 h-full z-[2000] md:z-10
        transform transition-all duration-300 ease-in-out
        ${isSidebarOpen 
          ? 'translate-x-0 w-80 md:w-96 opacity-100' 
          : '-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:overflow-hidden pointer-events-none'
        }
      `}>
        <SidebarReports 
          reports={filteredReports} 
          onSelectReport={handleSelectReportFromSidebar} 
          onCollapse={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Contenedor Principal del Mapa */}
      <div className="flex-1 relative h-full w-full min-h-0">
        {/* Botón flotante para abrir el sidebar (Solo visible en escritorio cuando está contraído) */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="hidden md:flex absolute top-6 left-6 z-[1000] bg-white/95 backdrop-blur-md text-slate-800 font-bold py-3.5 px-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 border border-slate-200/50 cursor-pointer"
            title="Mostrar reportes recientes"
          >
            <AlertTriangle className="text-blue-600 animate-pulse" size={18} />
            <span className="text-sm font-semibold">Reportes Recientes</span>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-100">
              {filteredReports.length}
            </span>
            <ChevronRight size={18} className="text-slate-400 ml-1" />
          </button>
        )}

        <FilterPanel 
          selectedTags={selectedTags}
          selectedStatus={selectedStatus}
          onFilterChange={handleFilterChange}
          isHeatmapVisible={isHeatmapVisible}
          onToggleHeatmap={setIsHeatmapVisible}
        />

        <MapContainer 
          center={ASUNCION_CENTER} 
          zoom={13} 
          zoomControl={false}
          className="w-full h-full z-0"
          ref={setMapRef}
        >
          {/* Mapa Base: CartoDB Positron */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          />

          {!isHeatmapVisible && filteredReports.map(report => (
            <ReportMarker key={report.id} report={report} />
          ))}

          {!isHeatmapVisible && news.map(noticia => (
            <NewsMarker key={`news-${noticia.id}`} news={noticia} />
          ))}

          <HeatmapLayer 
            reports={filteredReports} 
            isVisible={isHeatmapVisible} 
          />
        </MapContainer>
      </div>

      {/* Modal de Nuevo Reporte */}
      {showReportForm && (
        <ReportForm 
          onClose={() => setShowReportForm(false)} 
          onSubmit={handleAddReport} 
        />
      )}
      {/* Indicador de Carga */}
      {loading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[3000] bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-blue-100 flex items-center gap-2">
          <Loader2 size={18} className="text-blue-600 animate-spin" />
          <span className="text-sm font-medium text-slate-600">Actualizando datos...</span>
        </div>
      )}
    </div>
  );
}
