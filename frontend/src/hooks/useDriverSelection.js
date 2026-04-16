import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { TIMER_TOTAL } from '../config/constants';
import { findBestDriver, buildDriverNotification } from '../services/driver.service';

export default function useDriverSelection(orderId, navigation) {
  const { orders, updateOrder, addNotification } = useApp();

  const [timeLeft, setTimeLeft] = useState(TIMER_TOTAL);
  const hasAssigned = useRef(false);

  const order = orders.find(o => o.id === orderId);
  const orderRef = useRef(order);
  orderRef.current = order;

  // Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-assign when timer expires
  useEffect(() => {
    if (timeLeft !== 0 || hasAssigned.current) return;
    hasAssigned.current = true;

    const currentOrder = orderRef.current;
    const driver = findBestDriver(currentOrder?.applicants);
    if (!driver) {
      navigation.navigate('OrdersList');
      return;
    }

    updateOrder(orderId, { statut: 'Assigne', assignedDriver: driver });
    addNotification(buildDriverNotification({ orderId, type: 'auto_assigned', driver }));
    Alert.alert(
      'Assignation automatique',
      `Delai expire. ${driver.name} (${driver.rating}) a ete automatiquement assigne.`,
      [{ text: 'OK', onPress: () => navigation.navigate('OrdersList') }]
    );
  }, [timeLeft]);

  // Manual assign
  const handleAssignDriver = (driver) => {
    if (hasAssigned.current) return;
    hasAssigned.current = true;

    updateOrder(orderId, { statut: 'Assigne', assignedDriver: driver });
    addNotification(buildDriverNotification({ orderId, type: 'agency_assigned', driver }));
    Alert.alert(
      'Livreur assigne',
      `${driver.name} a ete notifie et va prendre en charge la commande.`,
      [
        {
          text: 'Voir la navigation',
          onPress: () => navigation.navigate('Navigation', { orderId }),
        },
        {
          text: 'Retour aux commandes',
          style: 'cancel',
          onPress: () => navigation.navigate('OrdersList'),
        },
      ]
    );
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const isTimerUrgent = timeLeft < 30 && timeLeft > 0;
  const applicants = order?.applicants || [];
  const shortId = orderId.slice(-4);

  return {
    timeLeft,
    timerText,
    isTimerUrgent,
    applicants,
    shortId,
    handleAssignDriver,
    TIMER_TOTAL,
  };
}
