import { useApp } from '../context/AppContext';
import * as navigationService from '../services/navigation.service';

export default function useNavigation(orderId) {
  const { orders } = useApp();
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return { order: null, distance: null, openMaps: () => {}, hasCoords: false };
  }

  const hasCoords =
    order.departLat != null &&
    order.departLng != null &&
    order.destinationLat != null &&
    order.destinationLng != null;

  const distance = navigationService.getDistance(order);
  const openMaps = () => navigationService.openMapsForOrder(order);

  return { order, distance, openMaps, hasCoords };
}
