import { StyleSheet } from 'react-native';

export const CORAL     = '#FF6B5B';
export const DARK_CARD = '#1C1C1E';
export const WHITE     = '#FFFFFF';
export const LIGHT_BG  = '#F5F5F7';
export const DARK_TEXT = '#1C1C1E';
export const GRAY_LABEL= '#8E8EA0';
export const GRAY_DIV  = '#ECECF0';
export const ERROR_RED = '#E63946';

export const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 14,
  elevation: 5,
};

export const s = StyleSheet.create({
  root:  { flex: 1, backgroundColor: LIGHT_BG },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  // Brand
  brand: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
  },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,107,91,0.20)',
    ...CARD_SHADOW,
  },
  logoEmoji: { fontSize: 36 },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: DARK_TEXT,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 13,
    color: GRAY_LABEL,
    fontWeight: '500',
  },

  // Card
  card: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    ...CARD_SHADOW,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: DARK_TEXT,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: GRAY_LABEL,
    marginBottom: 24,
    lineHeight: 20,
  },

  // Fields
  fieldGroup: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: GRAY_LABEL,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_BG,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: GRAY_DIV,
    paddingHorizontal: 14,
    height: 52,
    gap: 8,
  },
  inputWrapFocused: {
    borderColor: CORAL,
    backgroundColor: 'rgba(255,107,91,0.04)',
    shadowColor: CORAL,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  inputIcon: { fontSize: 16 },
  input: {
    flex: 1,
    fontSize: 15,
    color: DARK_TEXT,
  },
  eyeIcon: { fontSize: 16 },

  // Forgot
  forgotRow: { alignSelf: 'flex-end', marginBottom: 16, marginTop: -4 },
  forgotText: { fontSize: 13, color: CORAL, fontWeight: '600' },

  // Error box
  errorBox: {
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    fontSize: 13,
    color: ERROR_RED,
    fontWeight: '500',
    lineHeight: 18,
  },

  // Submit
  submitBtn: {
    backgroundColor: DARK_CARD,
    borderRadius: 999,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: DARK_CARD,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius: 12,
    elevation: 6,
  },
  submitBtnDisabled: { opacity: 0.45 },
  submitText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: { fontSize: 14, color: GRAY_LABEL },
  footerLink: { fontSize: 14, color: CORAL, fontWeight: '800' },
});
