// ⚠️ Port corrigé : le backend NestJS tourne sur 5000 (voir backend/src/main.ts)
export const API_URL = 'http://192.168.1.10:5000';
// Mets l'IP locale de ton PC (pas localhost)
// car le téléphone physique ne connaît pas "localhost" http://192.168.X.X:3000
// Tape "ipconfig" dans le terminal pour trouver ton IP
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
};

// ── Agence Colors ────────────────────────────────────────────────────────────
export const COLORS = {
  blue:      '#4361EE',
  blueLight: '#EEF1FF',
  bg:        '#F5F7FF',
  success:   '#2DC653',
  danger:    '#E63946',
  warning:   '#FF9F1C',
  dark:      '#1A1A2E',
};

// ── Package Types ────────────────────────────────────────────────────────────
export const PACKAGE_TYPES = [
  { id: 'general',      icon: '📦', label: 'Colis général' },
  { id: 'vetements',    icon: '👗', label: 'Vêtements' },
  { id: 'electronique', icon: '📱', label: 'Électronique' },
  { id: 'alimentation', icon: '🍔', label: 'Alimentation' },
  { id: 'medical',      icon: '💊', label: 'Médical' },
  { id: 'documents',    icon: '📄', label: 'Documents' },
];

// ── Vehicle Types ────────────────────────────────────────────────────────────
export const VEHICLE_TYPES = [
  { id: 'moto',    icon: '🏍️', label: 'Moto' },
  { id: 'voiture', icon: '🚗', label: 'Voiture' },
  { id: 'camion',  icon: '🚛', label: 'Camion' },
];

export const VEHICLE_LIMITS = {
  moto:    { maxWeightKg: 10,  maxSizeId: 'medium', label: '⚠️ Moto: max 10 kg · taille Medium maximum' },
  voiture: { maxWeightKg: 50,  maxSizeId: 'large',  label: '⚠️ Voiture: max 50 kg · taille Large maximum' },
  camion:  { maxWeightKg: 500, maxSizeId: 'large',  label: '✅ Camion: pas de limite pratique' },
};

// ── Package Sizes ────────────────────────────────────────────────────────────
export const SIZE_ORDER = ['small', 'medium', 'large'];

export const SIZE_DEFAULT = [
  { id: 'small',  icon: '📦', label: 'Small',  dim: 'Max 14x22x18 cm', weight: 'Max 3.5 kg' },
  { id: 'medium', icon: '📦', label: 'Medium', dim: 'Max 25x35x30 cm', weight: 'Max 10 kg' },
  { id: 'large',  icon: '📦', label: 'Large',  dim: 'Max 50x60x50 cm', weight: 'Max 30 kg' },
];

// ── Icon Mappings ────────────────────────────────────────────────────────────
export const PKG_ICONS = {
  general: '📦', vetements: '👗', electronique: '📱',
  alimentation: '🍔', medical: '💊', documents: '📄',
};

export const VEHICLE_ICONS = {
  moto: '🏍️', voiture: '🚗', camion: '🚛', camionnette: '🚐',
};

// ── Status Config (Dashboard / OrdersList) ───────────────────────────────────
export const STATUS_CONFIG = {
  'En attente': { label: 'En attente', color: '#FF9F1C', bg: '#FFF8EE', icon: '⏳', dots: [true, false, false] },
  'Assigne':    { label: 'Assigne',    color: '#4361EE', bg: '#EEF1FF', icon: '✅', dots: [true, true, false] },
  'En cours':   { label: 'En cours',   color: '#4361EE', bg: '#EEF1FF', icon: '🚴', dots: [true, true, false] },
  'Livre':      { label: 'Livre',      color: '#2DC653', bg: '#EAFAF1', icon: '✅', dots: [true, true, true] },
  'Annulee':    { label: 'Annulee',    color: '#E63946', bg: '#FFF0F0', icon: '❌', dots: [true, false, false] },
  en_attente:   { label: 'En attente', color: '#FF9F1C', bg: '#FFF8EE', icon: '⏳', dots: [true, false, false] },
  acceptee:     { label: 'Acceptee',   color: '#4361EE', bg: '#EEF1FF', icon: '✅', dots: [true, true, false] },
  en_route:     { label: 'En route',   color: '#FF6B35', bg: 'rgba(255, 107, 53, 0.12)', icon: '🚴', dots: [true, true, false] },
  livree:       { label: 'Livree',     color: '#2DC653', bg: '#EAFAF1', icon: '✅', dots: [true, true, true] },
  annulee:      { label: 'Annulee',    color: '#E63946', bg: '#FFF0F0', icon: '❌', dots: [true, false, false] },
};

// ── Dashboard Filters ────────────────────────────────────────────────────────
export const DASHBOARD_FILTERS = [
  { key: 'toutes',     label: 'Toutes' },
  { key: 'en_attente', label: 'En attente' },
  { key: 'en_cours',   label: 'En cours' },
  { key: 'livrees',    label: 'Livrees' },
];

// ── Timer ────────────────────────────────────────────────────────────────────
export const TIMER_TOTAL = 120;
