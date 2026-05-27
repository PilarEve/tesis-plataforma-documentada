export interface Report {
  id: string;
  lat: number;
  lng: number;
  description: string;
  impactTags?: string[];
  dateTime: string;
  imageUrl?: string;
  status: 'pendiente' | 'validado' | 'rechazado';
}
