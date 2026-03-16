import { StyleSheet, Dimensions } from 'react-native';

export const { width: SW } = Dimensions.get('window');

// ─── Design Tokens ────────────────────────────────────────────────────────────
export const VIOLET       = '#7C3AED';
export const VIOLET_BG    = '#EDE8FF';
export const VIOLET_MID   = '#DDD6FE';
export const VIOLET_LIGHT = '#EDE9FE';
export const WHITE        = '#FFFFFF';
export const DARK_TEXT    = '#1C1C1E';
export const GRAY         = '#8E8EA0';
export const GRAY_DIV     = '#ECECF0';
export const LIGHT_BG     = '#F5F5F7';
export const SKIN         = '#F5CBA7';
export const SKIN_DARK    = '#E8A87C';

export const CARD_SHADOW = {
  shadowColor: '#5B21B6',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.12,
  shadowRadius: 20,
  elevation: 8,
};

export const ILL_PHONE_W = 110;
export const ILL_PHONE_H = 180;

// ─── Step Validation ──────────────────────────────────────────────────────────
export const isValid = (step, cinNum, licNum) =>
  step === 1 ? cinNum.trim().length >= 2 : licNum.trim().length >= 2;

// ─── Screen Styles ────────────────────────────────────────────────────────────
export const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: VIOLET_BG },
  topArea: { backgroundColor: VIOLET_BG },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow:   { fontSize: 22, color: DARK_TEXT, fontWeight: '700', lineHeight: 26 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: DARK_TEXT },

  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },

  illustrationArea: { alignItems: 'center', marginTop: 8, marginBottom: 24 },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: DARK_TEXT,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: GRAY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 12,
  },

  formCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 20,
    ...CARD_SHADOW,
  },

  ctaContainer: {
    backgroundColor: VIOLET_BG,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: VIOLET_MID,
  },
  ctaBtn: {
    backgroundColor: VIOLET,
    borderRadius: 999,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: VIOLET,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  ctaBtnDisabled: { opacity: 0.45 },
  ctaBtnText: { color: WHITE, fontSize: 17, fontWeight: '800', letterSpacing: 0.3 },
});

// ─── Progress Bar Styles ──────────────────────────────────────────────────────
export const pb = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 4,
  },
  stepWrap:      { alignItems: 'center', flexDirection: 'row' },
  line:          { width: (SW - 240) / 2, height: 2, backgroundColor: VIOLET_MID, marginBottom: 16 },
  lineActive:    { backgroundColor: VIOLET },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: WHITE,
    borderWidth: 2,
    borderColor: VIOLET_MID,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotActive:     { backgroundColor: VIOLET, borderColor: VIOLET },
  dotText:       { fontSize: 11, fontWeight: '800', color: GRAY },
  dotTextActive: { color: WHITE },
  label:         { fontSize: 10, fontWeight: '600', color: GRAY, marginTop: 4, textAlign: 'center' },
  labelActive:   { color: VIOLET, fontWeight: '700' },
});

// ─── Illustration Styles ──────────────────────────────────────────────────────
export const ill = StyleSheet.create({
  scene: { alignItems: 'center', justifyContent: 'center', height: 220 },
  palm:  { width: ILL_PHONE_W + 40, alignItems: 'center', position: 'relative' },
  fingers: { flexDirection: 'row', justifyContent: 'center', marginBottom: -12, zIndex: 0 },
  finger: {
    width: 18,
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: SKIN_DARK,
    marginLeft: 6,
  },
  phone: {
    width: ILL_PHONE_W,
    height: ILL_PHONE_H,
    borderRadius: 18,
    backgroundColor: WHITE,
    borderWidth: 2.5,
    borderColor: VIOLET_MID,
    overflow: 'hidden',
    zIndex: 1,
    shadowColor: VIOLET,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  notch: {
    width: 36,
    height: 8,
    backgroundColor: VIOLET_MID,
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  screen: {
    flex: 1,
    backgroundColor: VIOLET_LIGHT,
    marginHorizontal: 6,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  homeBar: {
    width: 36,
    height: 4,
    backgroundColor: VIOLET_MID,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 7,
  },
  thumb: {
    width: 22,
    height: 60,
    borderRadius: 11,
    backgroundColor: SKIN,
    position: 'absolute',
    right: -8,
    bottom: 20,
    zIndex: 2,
  },
  card: {
    width: '100%',
    backgroundColor: WHITE,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: VIOLET,
    padding: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: VIOLET_LIGHT,
    borderRadius: 3,
    padding: 3,
    marginBottom: 5,
    gap: 4,
  },
  cardFlag:      { width: 10, height: 8, backgroundColor: VIOLET, borderRadius: 1 },
  cardTitleLine: { flex: 1, height: 4, backgroundColor: VIOLET_MID, borderRadius: 2 },
  cardBody:      { flexDirection: 'row', gap: 4, marginBottom: 2 },
  cardPhoto:     { width: 18, height: 22, backgroundColor: VIOLET_MID, borderRadius: 3 },
  cardLines:     { flex: 1, justifyContent: 'space-between' },
  cardLine:      { height: 4, backgroundColor: VIOLET_MID, borderRadius: 2, marginBottom: 3, width: '100%' },
});

// ─── Form Input Styles ────────────────────────────────────────────────────────
export const fi = StyleSheet.create({
  wrap:  { marginBottom: 16 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: GRAY,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: GRAY_DIV,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: DARK_TEXT,
    backgroundColor: LIGHT_BG,
  },
  inputFocused: {
    borderColor: VIOLET,
    backgroundColor: WHITE,
    shadowColor: VIOLET,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
});

// ─── Upload Field Styles ──────────────────────────────────────────────────────
export const uf = StyleSheet.create({
  wrap:  { marginBottom: 4 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: GRAY,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  area: {
    height: 120,
    borderWidth: 2,
    borderColor: VIOLET_MID,
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: VIOLET_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  areaFilled: {
    borderStyle: 'solid',
    borderColor: VIOLET,
    backgroundColor: LIGHT_BG,
    padding: 0,
    overflow: 'hidden',
  },
  previewWrap:   { width: '100%', height: '100%' },
  preview:       { width: '100%', height: '100%', borderRadius: 14 },
  changeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(124,58,237,0.7)',
    paddingVertical: 6,
    alignItems: 'center',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  changeText:  { color: WHITE, fontSize: 12, fontWeight: '700' },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(124,58,237,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon:       { fontSize: 20 },
  uploadText: { fontSize: 13, fontWeight: '700', color: VIOLET },
  uploadHint: { fontSize: 11, color: GRAY },
});
