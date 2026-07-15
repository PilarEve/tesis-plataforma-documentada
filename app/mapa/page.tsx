import MapClient from '@/components/MapClient';

export const metadata = {
  title: 'Mapa de Inundaciones - Área Metropolitana de Asunción',
  description: 'Mapa interactivo para monitoreo y visualización de inundaciones urbanas',
};

export default function MapaPage() {
  return (
    <main className="w-full flex-1 min-h-0 overflow-hidden bg-slate-100">
      <MapClient />
    </main>
  );
}
