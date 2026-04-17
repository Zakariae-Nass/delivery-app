/**
 * Pure business-logic helpers for order operations.
 * Moved from services/order.service.js — these are not technical actions
 * (no API calls, no storage) and belong outside the service layer.
 */

import { VEHICLE_TYPES, VEHICLE_LIMITS } from '../config/constants';

/**
 * Validates order form fields. Returns an errors object (empty = valid).
 */
export function validateOrder({ depart, destination, clientNom, clientTelephone, prix, sizeTab, customWeight, vehicleType }) {
  const e = {};
  if (!depart.lat) e.depart = 'Choisissez une adresse de depart dans la liste';
  if (!destination.lat) e.destination = 'Choisissez une adresse de destination dans la liste';
  if (!clientNom.trim()) e.clientNom = 'Nom du client requis';
  if (!clientTelephone.trim()) e.clientTelephone = 'Telephone requis';
  if (!prix.trim()) e.prix = 'Prix requis';
  if (sizeTab === 'custom') {
    if (!customWeight.trim()) {
      e.customWeight = 'Poids requis';
    } else {
      const wt = parseFloat(customWeight);
      const limit = VEHICLE_LIMITS[vehicleType];
      if (!isNaN(wt) && wt > limit.maxWeightKg) {
        const vLabel = VEHICLE_TYPES.find(v => v.id === vehicleType)?.label || vehicleType;
        e.customWeight = `Poids max pour ${vLabel} : ${limit.maxWeightKg} kg`;
      }
    }
  }
  return e;
}

/**
 * Builds a normalized order object from form data.
 */
export function buildOrder({ depart, destination, clientNom, clientTelephone, packageType, vehicleType, sizeTab, packageSize, customWeight, customDimensions, prix, isUrgent }) {
  return {
    id: Date.now().toString(),
    clientNom,
    clientTelephone,
    departTexte: depart.text,
    departLat: depart.lat,
    departLng: depart.lng,
    destinationTexte: destination.text,
    destinationLat: destination.lat,
    destinationLng: destination.lng,
    packageType,
    vehicleType,
    packageSize: sizeTab === 'custom' ? 'custom' : packageSize,
    customWeight,
    customDimensions,
    prix,
    isUrgent,
    statut: 'En attente',
    createdAt: new Date().toISOString(),
    applicants: [],
  };
}
