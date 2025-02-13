export const GOOGLE_MAPS_CONFIG = {
  apiKey: process.env.GOOGLE_MAPS_API_KEY!,
  libraries: ['places', 'geometry'] as google.maps.Libraries
}; 