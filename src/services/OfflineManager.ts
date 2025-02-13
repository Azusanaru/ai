import { 
  encode as polylineEncode,
  decode as polylineDecode 
} from '@googlemaps/polyline-codec';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'map_tile_';

export class OfflineMapManager {
  static async cacheArea(bounds: {
    ne: google.maps.LatLngLiteral;
    sw: google.maps.LatLngLiteral;
  }, zoomLevels: number[]) {
    const tiles = this.generateTileUrls(bounds, zoomLevels);
    await Promise.all(tiles.map(url => 
      this.cacheTile(url)
    ));
  }

  private static generateTileUrls(bounds: any, zooms: number[]) {
    const urls: string[] = [];
    zooms.forEach(z => {
      const tileNE = this.latLngToTile(bounds.ne, z);
      const tileSW = this.latLngToTile(bounds.sw, z);
      
      for (let x = tileSW.x; x <= tileNE.x; x++) {
        for (let y = tileNE.y; y <= tileSW.y; y++) {
          urls.push(`https://mt1.google.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}`);
        }
      }
    });
    return urls;
  }

  private static async cacheTile(url: string) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      await AsyncStorage.setItem(
        CACHE_PREFIX + url, 
        URL.createObjectURL(blob)
      );
    } catch (error) {
      console.error('缓存失败:', url, error);
    }
  }

  private static latLngToTile(pos: google.maps.LatLngLiteral, zoom: number) {
    const scale = 1 << zoom;
    const siny = Math.sin(pos.lat * Math.PI / 180);
    const x = (0.5 + pos.lng / 360) * scale;
    const y = (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)) * scale;
    return { x: Math.floor(x), y: Math.floor(y) };
  }
} 