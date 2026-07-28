import MapClient from '@/components/MapClient';

export const metadata = {
  title: 'Mapa de Inundaciones - Área Metropolitana de Asunción',
  description: 'Mapa interactivo para monitoreo y visualización de inundaciones urbanas',
};

export default function MapaPage() {
  return (
    <main className="w-full h-full min-h-full overflow-hidden bg-slate-100 relative">
      <MapClient />
    </main>
  );
}
