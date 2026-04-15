import { StyleSheet } from 'react-native';

// ─── Design Tokens ────────────────────────────────────────────────────────────
export const CORAL        = '#FF6B5B';
export const DARK_CARD    = '#1C1C1E';
export const WHITE        = '#FFFFFF';
export const LIGHT_BG     = '#F5F5F7';
export const DARK_TEXT    = '#1C1C1E';
export const GRAY_LABEL   = '#8E8EA0';
export const GRAY_DIV     = '#ECECF0';
export const SUCCESS      = '#22C55E';
export const SUCCESS_BG   = 'rgba(34,197,94,0.10)';
export const SUCCESS_BORDER = 'rgba(34,197,94,0.30)';
export const ERROR        = '#EF4444';
export const ERROR_BG     = 'rgba(239,68,68,0.10)';
export const WARNING      = '#F59E0B';

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

// ─── Screen Styles ────────────────────────────────────────────────────────────
export const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: WHITE },
  scroll:        { flex: 1, backgroundColor: LIGHT_BG },
  scrollContent: { paddingBottom: 20 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: WHITE,
    gap: 10,
  },
  hamburgerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: LIGHT_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerIcon:  { fontSize: 20, color: DARK_TEXT, lineHeight: 24 },
  headerCenter:   { flex: 1 },
  greeting:       { fontSize: 12, color: GRAY_LABEL, fontWeight: '500', marginBottom: 2 },
  driverName:     { fontSize: 18, fontWeight: '800', color: DARK_TEXT },
  headerRight:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LIGHT_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifIcon:  { fontSize: 18 },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderWidth: 1.5,
    borderColor: SUCCESS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: SUCCESS, fontWeight: '800', fontSize: 13 },

  // Status Card
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: WHITE,
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: GRAY_DIV,
    ...CARD_SHADOW,
  },
  statusCardOnline: { borderColor: SUCCESS_BORDER, backgroundColor: SUCCESS_BG },
  statusLeft:       { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusDot:        { width: 10, height: 10, borderRadius: 5 },
  statusTitle:      { fontSize: 15, fontWeight: '700', color: DARK_TEXT },
  statusSubtitle:   { fontSize: 11, color: GRAY_LABEL, marginTop: 2 },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 14,
  },

  // Earnings Card
  earningsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: SUCCESS,
    ...CARD_SHADOW,
  },
  earningsLabel:   { fontSize: 11, color: GRAY_LABEL, fontWeight: '500', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 },
  earningsValue:   { fontSize: 22, fontWeight: '800', color: SUCCESS },
  earningsDivider: { width: 1, height: 40, backgroundColor: GRAY_DIV, marginHorizontal: 20 },
  earningsRight:   { flex: 1 },
  totalValue:      { fontSize: 18, fontWeight: '800', color: DARK_TEXT },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: DARK_TEXT },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ERROR_BG,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
  },
  liveDot:  { width: 6, height: 6, borderRadius: 3, backgroundColor: ERROR },
  liveText: { fontSize: 10, color: ERROR, fontWeight: '800', letterSpacing: 1 },

  ordersList:   { paddingHorizontal: 16, gap: 12 },

  // Offline Box
  offlineBox:   { alignItems: 'center', paddingHorizontal: 32, paddingTop: 32 },
  offlineEmoji: { fontSize: 56, marginBottom: 16 },
  offlineTitle: { fontSize: 20, fontWeight: '700', color: DARK_TEXT, marginBottom: 8 },
  offlineSub:   { fontSize: 13, color: GRAY_LABEL, textAlign: 'center', lineHeight: 22 },
});

// ─── MiniStat Styles ──────────────────────────────────────────────────────────
export const stat = StyleSheet.create({
  card:  { flex: 1, backgroundColor: WHITE, borderRadius: 16, padding: 14, alignItems: 'center', ...CARD_SHADOW },
  icon:  { fontSize: 20, marginBottom: 6 },
  value: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  label: { fontSize: 10, color: GRAY_LABEL, textAlign: 'center', fontWeight: '500' },
});

// ─── OrderCard Styles ─────────────────────────────────────────────────────────
export const card = StyleSheet.create({
  wrap:   { backgroundColor: WHITE, borderRadius: 20, padding: 16, ...CARD_SHADOW },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  agenceRow:       { flexDirection: 'row', alignItems: 'center', gap: 10 },
  vehicleIconWrap: { width: 42, height: 42, borderRadius: 12, backgroundColor: LIGHT_BG, justifyContent: 'center', alignItems: 'center' },
  vehicleIcon:     { fontSize: 22 },
  agenceName:      { fontSize: 15, fontWeight: '700', color: DARK_TEXT },
  orderId:         { fontSize: 11, color: GRAY_LABEL, marginTop: 2 },
  pricePill: {
    backgroundColor: LIGHT_BG,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price:          { fontSize: 18, fontWeight: '800', color: CORAL },
  priceUnit:      { fontSize: 11, color: GRAY_LABEL, fontWeight: '600' },
  divider:        { height: 1, backgroundColor: GRAY_DIV, marginBottom: 12 },
  addressSection: { marginBottom: 12 },
  addressRow:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot:            { width: 8, height: 8, borderRadius: 4 },
  addressLine:    { width: 1.5, height: 10, backgroundColor: GRAY_DIV, marginLeft: 3.5, marginVertical: 3 },
  addressText:    { flex: 1, fontSize: 13, color: DARK_TEXT, fontWeight: '500' },
  metaRow:        { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  metaBadge:      { backgroundColor: LIGHT_BG, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  metaText:       { fontSize: 11, color: GRAY_LABEL, fontWeight: '600' },
  description:    { flex: 1, fontSize: 11, color: GRAY_LABEL },
  acceptBtn: {
    backgroundColor: DARK_CARD,
    borderRadius: 999,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: DARK_CARD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptBtnText: { color: WHITE, fontSize: 15, fontWeight: '700' },
  appliedBox: {
    backgroundColor: 'rgba(245,158,11,0.10)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.30)',
    alignItems: 'center',
  },
  appliedText: { color: WARNING, fontSize: 13, fontWeight: '600' },
});
