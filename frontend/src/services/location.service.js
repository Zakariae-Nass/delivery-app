import * as Location from 'expo-location';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const HEADERS = { 'User-Agent': 'DeliveryApp/1.0' };

/**
 * Extracts a short name from a Nominatim address object.
 */
export function buildShortName(item) {
  const a = item.address || {};
  const parts = [
    a.suburb || a.neighbourhood || a.quarter || a.hamlet,
    a.city   || a.town          || a.village || a.county,
    a.state,
  ].filter(Boolean);
  return (
    parts.slice(0, 2).join(', ') ||
    item.display_name.split(',').slice(0, 2).join(',').trim()
  );
}

/**
 * Gets current GPS position and reverse-geocodes it via Nominatim.
 * @returns {{ text: string, lat: number, lng: number } | null}
 */
export async function getCurrentAddress() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;

    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const { latitude, longitude } = loc.coords;

    const res = await fetch(
      `${NOMINATIM_BASE}/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      { headers: HEADERS }
    );
    const data = await res.json();
    const address = data.display_name || `${latitude}, ${longitude}`;
    return { text: address, lat: latitude, lng: longitude };
  } catch {
    return null;
  }
}

/**
 * Searches Nominatim for addresses matching the query (Morocco only).
 * @returns {Array<{ id: string, text: string, lat: number, lng: number, shortName: string }>}
 */
export async function searchAddress(query) {
  const url =
    `${NOMINATIM_BASE}/search` +
    `?q=${encodeURIComponent(query)}` +
    `&format=json&limit=5&countrycodes=ma&addressdetails=1`;
  const res  = await fetch(url, { headers: HEADERS });
  const data = await res.json();

  if (data.length === 0) return [];

  return data.slice(0, 5).map((item, idx) => ({
    id:        item.place_id?.toString() || String(idx),
    text:      item.display_name,
    lat:       parseFloat(item.lat),
    lng:       parseFloat(item.lon),
    shortName: buildShortName(item),
  }));
}
