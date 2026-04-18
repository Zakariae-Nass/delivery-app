export const API_URL = 'http://172.17.36.34:5000';
export const WS_URL = 'http://172.17.36.34:5000';

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
};

export const COLORS = {
  blue:      '#4361EE',
  blueLight: '#EEF1FF',
  bg:        '#F5F7FF',
  success:   '#2DC653',
  danger:    '#E63946',
  warning:   '#FF9F1C',
  dark:      '#1A1A2E',
};

export const PACKAGE_TYPES = [
  { id: 'general',      label: 'Colis général' },
  { id: 'vetements',    label: 'Vêtements' },
  { id: 'electronique', label: 'Électronique' },
  { id: 'alimentation', label: 'Alimentation' },
  { id: 'medical',      label: 'Médical' },
  { id: 'documents',    label: 'Documents' },
];

export const VEHICLE_TYPES = [
  { id: 'moto',    label: 'Moto' },
  { id: 'voiture', label: 'Voiture' },
  { id: 'camion',  label: 'Camion' },
];

export const VEHICLE_LIMITS = {
  moto:    { maxWeightKg: 10,  maxSizeId: 'medium' },
  voiture: { maxWeightKg: 50,  maxSizeId: 'large' },
  camion:  { maxWeightKg: 500, maxSizeId: 'large' },
};

export const SIZE_ORDER = ['small', 'medium', 'large'];

export const SIZE_DEFAULT = [
  { id: 'small',  label: 'Small',  dim: 'Max 14x22x18 cm', weight: 'Max 3.5 kg' },
  { id: 'medium', label: 'Medium', dim: 'Max 25x35x30 cm', weight: 'Max 10 kg' },
  { id: 'large',  label: 'Large',  dim: 'Max 50x60x50 cm', weight: 'Max 30 kg' },
];

export const STATUS_CONFIG = {
  en_attente:      { label: 'En attente',    color: '#FF9F1C', bg: '#FFF8EE' },
  en_cours_pickup: { label: 'En cours',      color: '#4361EE', bg: '#EEF1FF' },
  colis_recupere:  { label: 'Colis récupéré', color: '#FF6B35', bg: 'rgba(255,107,53,0.1)' },
  livree:          { label: 'Livrée',        color: '#2DC653', bg: '#EAFAF1' },
  annulee:         { label: 'Annulée',       color: '#E63946', bg: '#FFF0F0' },
};

export const DASHBOARD_FILTERS = [
  { key: 'toutes',     label: 'Toutes' },
  { key: 'en_attente', label: 'En attente' },
  { key: 'en_cours',   label: 'En cours' },
  { key: 'livrees',    label: 'Livrées' },
];

export const TIMER_TOTAL = 120;
