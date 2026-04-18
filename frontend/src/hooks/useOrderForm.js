import { useState, useEffect, useRef } from 'react';
import { Alert, Animated } from 'react-native';
import { useDispatch } from 'react-redux';
import apiClient from '../api/axios.config';
import { addCommande } from '../redux/slices/commandesSlice';
import { VEHICLE_LIMITS, SIZE_ORDER } from '../config/constants';
import * as locationService from '../services/location.service';

function validateOrder({ depart, destination, clientNom, clientTelephone, prix }) {
  const errors = {};
  if (!depart.text || !depart.lat) errors.depart = 'Adresse de départ requise';
  if (!destination.text || !destination.lat) errors.destination = 'Adresse de destination requise';
  if (!clientNom || clientNom.trim().length < 3) errors.clientNom = 'Nom minimum 3 caractères';
  if (!clientTelephone || !/^0[67]\d{8}$/.test(clientTelephone.trim())) {
    errors.clientTelephone = 'Format invalide (06/07XXXXXXXX)';
  }
  if (!prix || parseFloat(prix) <= 0) errors.prix = 'Prix doit être supérieur à 0';
  return errors;
}

export default function useOrderForm(navigation) {
  const dispatch = useDispatch();

  const [depart, setDepart]           = useState({ text: '', lat: null, lng: null });
  const [destination, setDestination] = useState({ text: '', lat: null, lng: null });
  const [departLoading, setDepartLoading] = useState(true);

  const [clientNom, setClientNom]             = useState('');
  const [clientTelephone, setClientTelephone] = useState('');
  const [packageType, setPackageType]         = useState('general');
  const [vehicleType, setVehicleType]         = useState('voiture');
  const [sizeTab, setSizeTab]                 = useState('default');
  const [packageSize, setPackageSize]         = useState('small');
  const [customWeight, setCustomWeight]       = useState('');
  const [customDimensions, setCustomDimensions] = useState('');
  const [prix, setPrix]                       = useState('');
  const [isUrgent, setIsUrgent]               = useState(false);
  const [errors, setErrors]                   = useState({});
  const [submitting, setSubmitting]           = useState(false);

  const urgentAnim   = useRef(new Animated.Value(0)).current;
  const urgentLoopRef = useRef(null);

  useEffect(() => {
    return () => { if (urgentLoopRef.current) urgentLoopRef.current.stop(); };
  }, []);

  useEffect(() => {
    locationService.getCurrentAddress()
      .then(addr => addr && setDepart(addr))
      .finally(() => setDepartLoading(false));
  }, []);

  const handleVehicleChange = (newType) => {
    setVehicleType(newType);
    const maxIdx = SIZE_ORDER.indexOf(VEHICLE_LIMITS[newType].maxSizeId);
    const curIdx = SIZE_ORDER.indexOf(packageSize);
    if (curIdx > maxIdx) setPackageSize(VEHICLE_LIMITS[newType].maxSizeId);
  };

  const isSizeDisabled = (sizeId) =>
    SIZE_ORDER.indexOf(sizeId) > SIZE_ORDER.indexOf(VEHICLE_LIMITS[vehicleType].maxSizeId);

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

  const validate = () => {
    const e = validateOrder({ depart, destination, clientNom, clientTelephone, prix });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        price: parseFloat(prix),
        packageType,
        vehiculeType: vehicleType,
        isUrgent,
        clientName: clientNom.trim(),
        clientPhone: clientTelephone.trim(),
        pickupAddress: depart.text,
        deliveryAddress: destination.text,
        pickupLat: depart.lat,
        pickupLng: depart.lng,
        deliveryLat: destination.lat,
        deliveryLng: destination.lng,
        weight: customWeight ? parseFloat(customWeight) : null,
        dimension: customDimensions || null,
      };

      const { data } = await apiClient.post('/commandes', payload);
      dispatch(addCommande(data));
      Alert.alert('Commande créée', `Commande ${data.numero} créée avec succès`, [
        { text: 'OK', onPress: () => navigation.navigate('OrdersList') },
      ]);
    } catch (e) {
      const msg = e?.response?.data?.message;
      Alert.alert('Erreur', Array.isArray(msg) ? msg.join('\n') : (msg || 'Une erreur est survenue'));
    } finally {
      setSubmitting(false);
    }
  };

  const urgentScale = urgentAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });
  const vehicleLimit = VEHICLE_LIMITS[vehicleType];
  const customWtNum = parseFloat(customWeight);
  const customWeightExceeds =
    sizeTab === 'custom' && customWeight.trim() !== '' &&
    !isNaN(customWtNum) && customWtNum > vehicleLimit.maxWeightKg;

  return {
    depart, setDepart,
    destination, setDestination,
    departLoading,
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
    urgentScale,
    vehicleLimit,
    customWeightExceeds,
    isSubmitDisabled: departLoading || submitting,
    submitting,
    isSizeDisabled,
    handleSubmit,
  };
}
