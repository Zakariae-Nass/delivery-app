import { StyleSheet, Dimensions } from 'react-native';

export const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Design Tokens ────────────────────────────────────────────────────────────
export const CORAL      = '#FF6B5B';
export const DARK_CARD  = '#1C1C1E';
export const WHITE      = '#FFFFFF';
export const LIGHT_BG   = '#F5F5F7';
export const GRAY_LABEL = '#8E8EA0';
export const GRAY_DIV   = '#ECECF0';
export const DARK_TEXT  = '#1C1C1E';
export const AMBER      = '#F59E0B';
export const AMBER_BG   = 'rgba(245,158,11,0.12)';
export const ORANGE     = '#EA580C';
export const ORANGE_BG  = 'rgba(234,88,12,0.10)';

export const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 14,
  elevation: 5,
};

// ─── KYC Badge Config ────────────────────────────────────────────────────────
export const KYC_BADGE = {
  not_verified: { label: 'Not Verified', color: ORANGE,    bg: ORANGE_BG,  tappable: true  },
  pending:      { label: 'Pending',      color: AMBER,     bg: AMBER_BG,   tappable: false },
  approved:     { label: 'Approved',     color: DARK_CARD, bg: DARK_CARD,  tappable: false, textColor: WHITE },
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
export const INITIAL_DRIVER = {
  firstName:   'Hiroshima',
  lastName:    'Tanaka',
  email:       'hiroshima@gmail.com',
  cin:         'AB123456',
  licence:     'MAR-2023-001',
  vehicleType: 'Moto',
  phone:       '0600000000',
  location:    'Casablanca, Maroc',
};

export const VIEW_FIELDS = (d) => [
  { label: 'First Name',    value: d.firstName },
  { label: 'Last Name',     value: d.lastName },
  { label: 'Email',         value: d.email },
  { label: 'Password',      value: '••••••••••••', isPassword: true },
  { label: 'CIN',           value: d.cin },
  { label: 'Licence',       value: d.licence },
  { label: 'Vehicle Type',  value: d.vehicleType },
  { label: 'Phone Number',  value: d.phone },
  { label: 'Location',      value: d.location },
];

export const EDIT_FIELDS = [
  { key: 'firstName', label: 'First Name',   secure: false },
  { key: 'lastName',  label: 'Last Name',    secure: false },
  { key: 'email',     label: 'Email',        secure: false, keyboard: 'email-address' },
  { key: 'password',  label: 'Password',     secure: true },
  { key: 'phone',     label: 'Phone Number', secure: false, keyboard: 'phone-pad' },
  { key: 'location',  label: 'Location',     secure: false },
];

// ─── Screen Styles ────────────────────────────────────────────────────────────
export const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: WHITE },
  scroll:        { flex: 1, backgroundColor: LIGHT_BG },
  scrollContent: { paddingBottom: 20 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: WHITE,
  },
  hamburgerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: LIGHT_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerIcon: { fontSize: 20, color: DARK_TEXT, lineHeight: 24 },

  // KYC Confirmation popup
  kycOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.52)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  kycPopup: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  kycIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(124,58,237,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  kycIcon:       { fontSize: 32 },
  kycPopupTitle: { fontSize: 20, fontWeight: '800', color: DARK_TEXT, marginBottom: 10, textAlign: 'center' },
  kycPopupMsg:   { fontSize: 14, color: GRAY_LABEL, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  kycBtnRow:     { flexDirection: 'row', gap: 12, width: '100%' },
  kycCancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: GRAY_DIV,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kycCancelText:  { fontSize: 15, fontWeight: '700', color: GRAY_LABEL },
  kycContinueBtn: {
    flex: 1,
    height: 50,
    borderRadius: 999,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  kycContinueText: { fontSize: 15, fontWeight: '800', color: WHITE },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    backgroundColor: WHITE,
    paddingTop: 20,
    paddingBottom: 28,
  },
  avatarWrap:        { position: 'relative' },
  avatarImg:         { width: 112, height: 112, borderRadius: 18, ...CARD_SHADOW },
  avatarPlaceholder: {
    width: 112,
    height: 112,
    borderRadius: 18,
    backgroundColor: '#E6E5EC',
    justifyContent: 'center',
    alignItems: 'center',
    ...CARD_SHADOW,
  },
  avatarLabel: { color: '#9B9BB0', fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
  cameraBtn: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#DDD',
    ...CARD_SHADOW,
  },
  cameraIcon: { fontSize: 15 },

  // Info Card
  infoCard: {
    backgroundColor: WHITE,
    marginHorizontal: 16,
    marginTop: 6,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
    ...CARD_SHADOW,
  },
  editIconBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: LIGHT_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon:   { fontSize: 16 },
  fieldRow:   { paddingVertical: 13, paddingRight: 44 },
  fieldLabel: {
    fontSize: 10,
    color: GRAY_LABEL,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  fieldValue: { fontSize: 15, color: DARK_TEXT, fontWeight: '700' },
  fieldDots:  { letterSpacing: 2.5, fontSize: 12, color: GRAY_LABEL },
  divider:    { height: 1, backgroundColor: GRAY_DIV },

  // Overlay + Sheet
  overlay:   { flex: 1, justifyContent: 'flex-end' },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.48)',
  },
  sheet: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    maxHeight: SCREEN_HEIGHT * 0.88,
  },
  sheetHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DCDCE2',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 2,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK_TEXT,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 22,
  },

  // Inputs
  inputWrap:        { marginBottom: 14 },
  floatLabel:       { fontSize: 12, color: GRAY_LABEL, fontWeight: '600', marginBottom: 7, letterSpacing: 0.2 },
  floatLabelActive: { color: CORAL },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E4E3EC',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: DARK_TEXT,
    backgroundColor: WHITE,
  },
  inputFocused: {
    borderColor: CORAL,
    shadowColor: CORAL,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 2,
  },

  // Confirm
  confirmBtn: {
    backgroundColor: DARK_CARD,
    height: 56,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  confirmText: { color: WHITE, fontSize: 16, fontWeight: '800', letterSpacing: 0.4 },
});

// ─── Badge Styles ─────────────────────────────────────────────────────────────
export const bdg = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1.5,
    gap: 6,
  },
  pillDark: { borderWidth: 0 },
  dot:  { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
});
