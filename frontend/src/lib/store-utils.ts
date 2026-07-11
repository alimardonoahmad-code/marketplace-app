import { User } from '@/types';
import { CITY_COORDS } from '@/lib/store-meta';
import { normalizeStoreText } from '@/lib/store-search';

export function getStoreName(user?: User | null) {
  if (!user) return '';
  return user.storeName || user.name;
}

export function getStoreLocation(user?: User | null) {
  if (!user) return '';
  const parts = [user.storeAddress, user.storeCity].filter(Boolean);
  if (parts.length) return parts.join(', ');
  return user.address || '';
}

export function getStoreCoords(user?: User | null): { lat: number; lng: number } | null {
  if (!user) return null;
  if (user.storeLatitude != null && user.storeLongitude != null) {
    return { lat: Number(user.storeLatitude), lng: Number(user.storeLongitude) };
  }
  const city = user.storeCity?.trim();
  if (city) {
    const exact = CITY_COORDS[city];
    if (exact) return exact;
    const key = Object.keys(CITY_COORDS).find(
      (k) => normalizeStoreText(k) === normalizeStoreText(city),
    );
    if (key) return CITY_COORDS[key];
  }
  return CITY_COORDS['Душанбе'];
}
