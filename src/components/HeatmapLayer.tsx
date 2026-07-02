"use client";

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { Report } from '../types/report';

interface HeatmapLayerProps {
  reports: Report[];
  isVisible: boolean;
}

export default function HeatmapLayer({ reports, isVisible }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || !isVisible) return;

    // Convertir reportes a formato [lat, lng, intensity] para leaflet.heat
    const points = reports.map(report => {
      // Calculamos intensidad basándonos en la cantidad de afectaciones reportadas (máx 1.0)
      const numTags = report.impactTags?.length || 0;
      const intensity = Math.min(0.4 + (numTags * 0.15), 1.0);
      return [report.lat, report.lng, intensity] as L.HeatLatLngTuple;
    });

    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 14,
      gradient: {
        0.4: 'blue',
        0.6: 'cyan',
        0.7: 'lime',
        0.8: 'yellow',
        1.0: 'red'
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, reports, isVisible]);

  return null;
}
