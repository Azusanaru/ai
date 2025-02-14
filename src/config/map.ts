export const MAP_CONFIG = {
  LIBRARIES: ['places', 'geometry'] as google.maps.Libraries,
  DEFAULT_CENTER: { lat: 31.2304, lng: 121.4737 },
  ZOOM: 13
};

export const GOOGLE_MAPS_CONFIG = {
  id: 'google-maps-script',
  version: 'weekly',
  libraries: ['places', 'geometry'] as google.maps.Libraries,
  region: 'CN',
  language: 'zh-CN',
  authReferrerPolicy: 'origin' as const,
  mapIds: [],
  apiKey: process.env.GOOGLE_MAPS_API_KEY!,
  defaultCenter: { lat: 31.2304, lng: 121.4737 }
}; 