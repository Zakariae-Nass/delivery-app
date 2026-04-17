/**
 * Pure business-logic helpers for driver operations.
 * Moved from services/driver.service.js — these are not technical actions
 * (no API calls, no storage) and belong outside the service layer.
 */

/**
 * Finds the best driver (highest rating) from a list of applicants.
 * @returns {object|null} The best driver or null if no applicants.
 */
export function findBestDriver(applicants) {
  if (!applicants?.length) return null;
  return applicants.reduce((best, d) => (d.rating > best.rating ? d : best));
}

/**
 * Builds a notification object for driver-related events.
 */
export function buildDriverNotification({ orderId, type, driver }) {
  return {
    id: Date.now().toString(),
    orderId,
    orderShortId: orderId.slice(-4),
    type,
    driverName: driver.name,
    driverId: driver.id,
    read: false,
    createdAt: new Date(),
  };
}
