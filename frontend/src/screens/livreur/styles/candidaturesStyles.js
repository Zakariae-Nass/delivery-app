import { StyleSheet } from 'react-native';

// ─── Design Tokens ────────────────────────────────────────────────────────────
export const CORAL      = '#FF6B5B';
export const WHITE      = '#FFFFFF';
export const LIGHT_BG   = '#F5F5F7';
export const DARK_TEXT  = '#1C1C1E';
export const GRAY_LABEL = '#8E8EA0';
export const GRAY_DIV   = '#ECECF0';
export const SUCCESS    = '#22C55E';
export const ERROR      = '#EF4444';
export const WARNING    = '#F59E0B';

export const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 14,
  elevation: 5,
};

export const VEHICLE_ICONS = {
  moto:        '🛵',
  voiture:     '🚗',
  camionnette: '🚐',
};

// ─── Status Config ────────────────────────────────────────────────────────────
export const STATUS_CFG = {
  en_attente:  { label: 'En attente',  bg: WARNING, prefix: '⏳', sort: 1 },
  selectionne: { label: 'Sélectionné', bg: SUCCESS, prefix: '✅', sort: 0 },
  elimine:     { label: 'Éliminé',     bg: ERROR,   prefix: '✗',  sort: 2 },
};

// ─── Filter Tabs ──────────────────────────────────────────────────────────────
export const FILTERS = [
  { key: 'all',         label: 'Tous',        color: CORAL   },
  { key: 'selectionne', label: 'Sélectionné', color: SUCCESS },
  { key: 'en_attente',  label: 'En attente',  color: WARNING },
  { key: 'elimine',     label: 'Éliminé',     color: ERROR   },
];

// ─── Mock Candidatures ────────────────────────────────────────────────────────
export const MOCK_CANDIDATURES = [
  {
    id: '10',
    agence:        'Express Maroc',
    pickupAdresse: 'Maarif, Casablanca',
    depotAdresse:  'Sidi Maarouf, Casablanca',
    description:   'Téléphone portable',
    prix:          55,
    vehiculeType:  'moto',
    distance:      7.4,
    tempsEstime:   '25 min',
    statut:        'en_attente',
  },
  {
    id: '11',
    agence:        'QuickDel',
    pickupAdresse: 'Ain Sebaa, Casablanca',
    depotAdresse:  'Bernoussi, Casablanca',
    description:   'Colis alimentaire',
    prix:          35,
    vehiculeType:  'moto',
    distance:      3.2,
    tempsEstime:   '12 min',
    statut:        'selectionne',
  },
  {
    id: '12',
    agence:        'MediExpress',
    pickupAdresse: 'Oulfa, Casablanca',
    depotAdresse:  'Lissasfa, Casablanca',
    description:   'Médicaments urgents',
    prix:          70,
    vehiculeType:  'moto',
    distance:      5.1,
    tempsEstime:   '18 min',
    statut:        'elimine',
  },
];

// ─── Screen Styles ────────────────────────────────────────────────────────────
export const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: WHITE },
  scroll:        { flex: 1, backgroundColor: LIGHT_BG },
  scrollContent: { paddingBottom: 20 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: WHITE,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: LIGHT_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow:     { fontSize: 22, color: DARK_TEXT, fontWeight: '700', lineHeight: 26 },
  headerTitle:   { flex: 1, fontSize: 18, fontWeight: '800', color: DARK_TEXT, textAlign: 'center' },
  hamburgerIcon: { fontSize: 20, color: DARK_TEXT, lineHeight: 24 },

  // Filter chips
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: GRAY_DIV,
    ...CARD_SHADOW,
  },
  filterChipText:       { fontSize: 13, fontWeight: '600', color: GRAY_LABEL },
  filterChipTextActive: { color: WHITE, fontWeight: '800' },
  filterCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: LIGHT_BG,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  filterCountText: { fontSize: 11, fontWeight: '800', color: GRAY_LABEL },

  // Featured section
  featuredSection:   { paddingHorizontal: 16, marginBottom: 4 },
  featuredLabel:     { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  featuredDot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: SUCCESS },
  featuredLabelText: { fontSize: 12, fontWeight: '700', color: SUCCESS, textTransform: 'uppercase', letterSpacing: 0.6 },

  // Rest label
  restLabel:     { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 10 },
  restLabelText: { fontSize: 12, fontWeight: '700', color: GRAY_LABEL, textTransform: 'uppercase', letterSpacing: 0.6 },

  list: { paddingHorizontal: 16, gap: 12 },
});

// ─── Candidature Card Styles ──────────────────────────────────────────────────
export const card = StyleSheet.create({
  wrap: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    ...CARD_SHADOW,
  },
  wrapEliminated: { opacity: 0.55 },
  wrapFeatured:   { borderLeftWidth: 3, borderLeftColor: SUCCESS },

  topRow:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  agenceRow:       { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  vehicleIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: LIGHT_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleIconWrapFeatured: { backgroundColor: 'rgba(34,197,94,0.10)' },
  vehicleIcon: { fontSize: 22 },
  agenceName:  { fontSize: 15, fontWeight: '700', color: DARK_TEXT },
  orderId:     { fontSize: 11, color: GRAY_LABEL, marginTop: 2 },

  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  statusText: { fontSize: 11, fontWeight: '800', color: WHITE },

  pricePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    alignSelf: 'flex-start',
    backgroundColor: LIGHT_BG,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 12,
  },
  price:     { fontSize: 18, fontWeight: '800', color: CORAL },
  priceUnit: { fontSize: 11, color: GRAY_LABEL, fontWeight: '600' },

  divider:        { height: 1, backgroundColor: GRAY_DIV, marginBottom: 12 },
  addressSection: { marginBottom: 12 },
  addressRow:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot:            { width: 8, height: 8, borderRadius: 4 },
  addressLine:    { width: 1.5, height: 10, backgroundColor: GRAY_DIV, marginLeft: 3.5, marginVertical: 3 },
  addressText:    { flex: 1, fontSize: 13, color: DARK_TEXT, fontWeight: '500' },

  metaRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  metaBadge:   { backgroundColor: LIGHT_BG, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  metaText:    { fontSize: 11, color: GRAY_LABEL, fontWeight: '600' },
  description: { flex: 1, fontSize: 11, color: GRAY_LABEL },

  detailsBtn: {
    backgroundColor: CORAL,
    borderRadius: 999,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: CORAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  detailsBtnText: { color: WHITE, fontSize: 15, fontWeight: '700' },
});

// ─── Empty State Styles ───────────────────────────────────────────────────────
export const empty = StyleSheet.create({
  wrap:     { alignItems: 'center', paddingHorizontal: 32, paddingTop: 64 },
  emoji:    { fontSize: 60, marginBottom: 20 },
  title:    { fontSize: 20, fontWeight: '800', color: DARK_TEXT, marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 14, color: GRAY_LABEL, textAlign: 'center', lineHeight: 22 },
});
