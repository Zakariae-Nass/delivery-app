import { Linking } from 'react-native';
import { haversine } from '../utils/geo';

/**
 * Builds a Google Maps directions URL.
 */
export function buildGoogleMapsUrl(departLat, departLng, destLat, destLng) {
  return (
    `https://www.google.com/maps/dir/?api=1` +
    `&origin=${departLat},${departLng}` +
    `&destination=${destLat},${destLng}` +
    `&travelmode=driving`
  );
}

/**
 * Returns the haversine distance in km for an order, or null if coords missing.
 */
export function getDistance(order) {
  const hasCoords =
    order.departLat != null &&
    order.departLng != null &&
    order.destinationLat != null &&
    order.destinationLng != null;

  if (!hasCoords) return null;
  return haversine(order.departLat, order.departLng, order.destinationLat, order.destinationLng);
}

/**
 * Opens Google Maps navigation for the given order.
 */
export function openMapsForOrder(order) {
  const hasCoords =
    order.departLat != null &&
    order.departLng != null &&
    order.destinationLat != null &&
    order.destinationLng != null;

  if (!hasCoords) return;

  const url = buildGoogleMapsUrl(
    order.departLat, order.departLng,
    order.destinationLat, order.destinationLng
  );
  Linking.openURL(url);
}
