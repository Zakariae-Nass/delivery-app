import { StyleSheet, Dimensions } from 'react-native';

export const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Design Tokens ────────────────────────────────────────────────────────────
export const CORAL       = '#FF6B5B';
export const DARK_CARD   = '#1C1C1E';
export const WHITE       = '#FFFFFF';
export const LIGHT_BG    = '#F5F5F7';
export const DARK_TEXT   = '#1C1C1E';
export const GRAY_LABEL  = '#8E8EA0';
export const GRAY_DIV    = '#ECECF0';
export const SUCCESS     = '#22C55E';
export const WARNING     = '#F59E0B';
export const ERROR       = '#EF4444';
export const SUCCESS_BG  = 'rgba(34,197,94,0.12)';
export const ERROR_BG    = 'rgba(239,68,68,0.12)';
export const CORAL_GHOST = 'rgba(255,107,91,0.10)';

export const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 14,
  elevation: 5,
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
export const MOCK_TRANSACTIONS = [
  { id: '1', type: 'credit', montant: 85,  description: 'Livraison #CMD-001 — Commission 15%', date: '18 Oct 2025, 14:32', commande: 'CMD-001' },
  { id: '2', type: 'credit', montant: 102, description: 'Livraison #CMD-008 — Commission 15%', date: '17 Oct 2025, 09:15', commande: 'CMD-008' },
  { id: '3', type: 'debit',  montant: 85,  description: 'Retrait vers compte bancaire',        date: '15 Oct 2025, 11:00', commande: null      },
  { id: '4', type: 'credit', montant: 68,  description: 'Livraison #CMD-003 — Commission 15%', date: '14 Oct 2025, 16:45', commande: 'CMD-003' },
  { id: '5', type: 'debit',  montant: 170, description: 'Retrait vers compte bancaire',        date: '10 Oct 2025, 10:20', commande: null      },
];

export const fmt = (n) => n.toFixed(2).replace('.', ',') + ' MAD';

// ─── Screen Styles ────────────────────────────────────────────────────────────
export const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: WHITE },
  scroll:        { flex: 1, backgroundColor: LIGHT_BG },
  scrollContent: { paddingBottom: 24 },

  // Header
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
  hamburgerIcon: { fontSize: 20, color: DARK_TEXT, lineHeight: 24 },
  bellIcon:      { fontSize: 18 },
  headerTitle:   { flex: 1, fontSize: 18, fontWeight: '800', color: DARK_TEXT, textAlign: 'center' },

  // Balance Card
  balanceCard: {
    backgroundColor: DARK_CARD,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 14,
    borderRadius: 24,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: CORAL,
    shadowColor: DARK_CARD,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  balanceLabel:   { fontSize: 12, color: GRAY_LABEL, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  balanceAmount:  { fontSize: 40, fontWeight: '800', color: WHITE, letterSpacing: -0.5, marginBottom: 12 },
  blockedRow:     { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  blockedIcon:    { fontSize: 12 },
  blockedText:    { fontSize: 12, color: GRAY_LABEL },
  balanceDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 20 },
  balanceBtns:    { flexDirection: 'row', gap: 10 },
  withdrawBtn: {
    flex: 1,
    height: 46,
    borderRadius: 999,
    backgroundColor: CORAL,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: CORAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  withdrawBtnActive: { backgroundColor: '#E85545' },
  withdrawBtnText:   { color: WHITE, fontSize: 14, fontWeight: '800' },
  historyBtn: {
    flex: 1,
    height: 46,
    borderRadius: 999,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.20)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyBtnText: { color: WHITE, fontSize: 14, fontWeight: '700' },

  // Stats Row
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 14 },

  // Withdraw card
  withdrawCard: {
    backgroundColor: WHITE,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    ...CARD_SHADOW,
  },
  withdrawTitle:    { fontSize: 17, fontWeight: '800', color: DARK_TEXT, marginBottom: 6 },
  withdrawSubtitle: { fontSize: 12, color: GRAY_LABEL, marginBottom: 18, lineHeight: 18 },
  withdrawSuccess: {
    backgroundColor: SUCCESS_BG,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.25)',
  },
  withdrawSuccessText: { color: SUCCESS, fontSize: 14, fontWeight: '600', lineHeight: 22 },
  inputGroup:  { marginBottom: 16 },
  inputLabel:  { fontSize: 11, fontWeight: '700', color: GRAY_LABEL, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 },
  amountInput: {
    height: 56,
    borderWidth: 1.5,
    borderColor: GRAY_DIV,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 22,
    fontWeight: '800',
    color: DARK_TEXT,
    backgroundColor: LIGHT_BG,
  },
  amountInputFocused: {
    borderColor: CORAL,
    backgroundColor: WHITE,
    shadowColor: CORAL,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  inputHint: { fontSize: 11, color: GRAY_LABEL, marginTop: 6 },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: LIGHT_BG,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: GRAY_DIV,
  },
  bankIcon:  { fontSize: 22 },
  bankInfo:  { flex: 1 },
  bankLabel: { fontSize: 12, color: GRAY_LABEL, fontWeight: '600', marginBottom: 3 },
  bankRib:   { fontSize: 14, fontWeight: '700', color: DARK_TEXT, letterSpacing: 1 },
  submitBtn: {
    backgroundColor: CORAL,
    borderRadius: 999,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: CORAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  submitBtnDisabled: { opacity: 0.45 },
  submitBtnText:     { color: WHITE, fontSize: 15, fontWeight: '800' },

  // Transactions section
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: DARK_TEXT },
  seeAllText:   { fontSize: 13, color: CORAL, fontWeight: '700' },
  txList:       { paddingHorizontal: 16, gap: 10 },
});

// ─── MiniStat Styles ──────────────────────────────────────────────────────────
export const stat = StyleSheet.create({
  card:  { flex: 1, backgroundColor: WHITE, borderRadius: 16, padding: 14, alignItems: 'center', ...CARD_SHADOW },
  icon:  { fontSize: 20, marginBottom: 6 },
  value: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  label: { fontSize: 10, color: GRAY_LABEL, textAlign: 'center', fontWeight: '500' },
});

// ─── Transaction Row Styles ───────────────────────────────────────────────────
export const tx_row = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    ...CARD_SHADOW,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  arrow:  { fontSize: 20, fontWeight: '800' },
  info:   { flex: 1 },
  desc:   { fontSize: 13, fontWeight: '700', color: DARK_TEXT, marginBottom: 3 },
  date:   { fontSize: 11, color: GRAY_LABEL },
  right:  { alignItems: 'flex-end', gap: 5 },
  amount: { fontSize: 15, fontWeight: '800' },
  cmdPill: {
    backgroundColor: CORAL_GHOST,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  cmdText: { fontSize: 10, color: CORAL, fontWeight: '700' },
});

// ─── History Modal Styles ─────────────────────────────────────────────────────
export const m = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.48)',
  },
  sheet: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: SCREEN_HEIGHT * 0.82,
    paddingHorizontal: 20,
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: GRAY_DIV,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  sheetTitle:  { fontSize: 18, fontWeight: '800', color: DARK_TEXT },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: LIGHT_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: { fontSize: 15, color: GRAY_LABEL, fontWeight: '700' },
  filterRow:          { flexDirection: 'row', gap: 4, marginBottom: 0 },
  filterTab:          { flex: 1, alignItems: 'center', paddingVertical: 10, position: 'relative' },
  filterTabText:      { fontSize: 14, fontWeight: '600', color: GRAY_LABEL },
  filterTabTextActive:{ color: CORAL, fontWeight: '800' },
  filterUnderline: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2.5,
    borderRadius: 2,
    backgroundColor: CORAL,
  },
  filterDivider: { height: 1, backgroundColor: GRAY_DIV, marginBottom: 12 },
  listContent:   { gap: 10, paddingBottom: 24 },
  emptyState:    { alignItems: 'center', paddingTop: 32 },
  emptyText:     { fontSize: 15, color: GRAY_LABEL, fontWeight: '600' },
});
