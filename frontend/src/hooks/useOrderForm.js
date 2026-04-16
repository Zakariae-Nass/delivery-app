import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useApp } from '../context/AppContext';
import { simulateDriversApplying } from '../utils/simulationData';
import { VEHICLE_LIMITS, SIZE_ORDER } from '../config/constants';
import { validateOrder, buildOrder } from '../services/order.service';
import { buildDriverNotification } from '../services/driver.service';
import * as locationService from '../services/location.service';

export default function useOrderForm(navigation) {
  const { addOrder, setOrders, addNotification } = useApp();

  // Address state
  const [depart, setDepart] = useState({ text: '', lat: null, lng: null });
  const [destination, setDestination] = useState({ text: '', lat: null, lng: null });
  const [departLoading, setDepartLoading] = useState(true);

  // Order fields
  const [clientNom, setClientNom] = useState('');
  const [clientTelephone, setClientTelephone] = useState('');
  const [packageType, setPackageType] = useState('general');
  const [vehicleType, setVehicleType] = useState('voiture');
  const [sizeTab, setSizeTab] = useState('default');
  const [packageSize, setPackageSize] = useState('small');
  const [customWeight, setCustomWeight] = useState('');
  const [customDimensions, setCustomDimensions] = useState('');
  const [prix, setPrix] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [errors, setErrors] = useState({});

  // Animation refs
  const urgentAnim = useRef(new Animated.Value(0)).current;
  const urgentLoopRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => { if (urgentLoopRef.current) urgentLoopRef.current.stop(); };
  }, []);

  // GPS auto-fill on mount
  useEffect(() => {
    locationService.getCurrentAddress()
      .then(addr => addr && setDepart(addr))
      .finally(() => setDepartLoading(false));
  }, []);

  // Vehicle change with auto-reset
  const handleVehicleChange = (newType) => {
    setVehicleType(newType);
    const maxIdx = SIZE_ORDER.indexOf(VEHICLE_LIMITS[newType].maxSizeId);
    const curIdx = SIZE_ORDER.indexOf(packageSize);
    if (curIdx > maxIdx) setPackageSize(VEHICLE_LIMITS[newType].maxSizeId);
  };

  const isSizeDisabled = (sizeId) =>
    SIZE_ORDER.indexOf(sizeId) > SIZE_ORDER.indexOf(VEHICLE_LIMITS[vehicleType].maxSizeId);

  // Urgent toggle
  const toggleUrgent = () => {
    const next = !isUrgent;
    setIsUrgent(next);
    if (next) {
      urgentLoopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(urgentAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(urgentAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      );
      urgentLoopRef.current.start();
    } else {
      if (urgentLoopRef.current) urgentLoopRef.current.stop();
      Animated.timing(urgentAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    }
  };

  // Validation (delegates to service)
  const validate = () => {
    const e = validateOrder({ depart, destination, clientNom, clientTelephone, prix, sizeTab, customWeight, vehicleType });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const isSubmitDisabled = departLoading;

  // Submit
  const handleSubmit = () => {
    if (!validate()) return;
    const order = buildOrder({
      depart, destination, clientNom, clientTelephone,
      packageType, vehicleType, sizeTab, packageSize,
      customWeight, customDimensions, prix, isUrgent,
    });

    addOrder(order);
    simulateDriversApplying((driver) => {
      setOrders(prev =>
        prev.map(o =>
          o.id === order.id
            ? { ...o, applicants: [...(o.applicants || []), driver] }
            : o
        )
      );
      addNotification(buildDriverNotification({
        orderId: order.id,
        type: 'driver_applied',
        driver,
      }));
    });
    navigation.navigate('OrdersList');
  };

  // Derived values
  const urgentScale = urgentAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });
  const vehicleLimit = VEHICLE_LIMITS[vehicleType];
  const customWtNum = parseFloat(customWeight);
  const customWeightExceeds =
    sizeTab === 'custom' && customWeight.trim() !== '' &&
    !isNaN(customWtNum) && customWtNum > vehicleLimit.maxWeightKg;

  return {
    // Address
    depart, setDepart,
    destination, setDestination,
    departLoading,
    // Fields
    clientNom, setClientNom,
    clientTelephone, setClientTelephone,
    packageType, setPackageType,
    vehicleType, handleVehicleChange,
    sizeTab, setSizeTab,
    packageSize, setPackageSize,
    customWeight, setCustomWeight,
    customDimensions, setCustomDimensions,
    prix, setPrix,
    isUrgent, toggleUrgent,
    errors,
    // Derived
    urgentScale,
    vehicleLimit,
    customWeightExceeds,
    isSubmitDisabled,
    isSizeDisabled,
    // Actions
    handleSubmit,
  };
}
