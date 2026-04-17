import { StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, FontSize } from '../../config/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 56,
    paddingBottom: Spacing.xl,
  },

  // Header
  header: { marginBottom: Spacing.xl },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  backIcon: { fontSize: 20, color: Colors.textPrimary },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },

  // Role
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: Spacing.lg },
  roleCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    position: 'relative',
  },
  roleCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryGhost },
  roleIcon: { fontSize: 32, marginBottom: Spacing.sm },
  roleLabel: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textSecondary, marginBottom: 2 },
  roleLabelActive: { color: Colors.textPrimary },
  roleDesc: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
  roleDescActive: { color: Colors.textSecondary },
  roleCheckmark: {
    position: 'absolute', top: 8, right: 8,
    width: 20, height: 20, borderRadius: Radius.full,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  roleCheckmarkText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  // Card
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },

  // Input
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgInput,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  inputWrapperFocused: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255, 107, 53, 0.05)',
  },
  inputIcon: { fontSize: 16, marginRight: Spacing.sm },
  prefixText: { color: Colors.textSecondary, fontSize: FontSize.md, marginRight: 2 },
  input: { flex: 1, color: Colors.textPrimary, fontSize: FontSize.md },

  // Password strength
  passwordStrength: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: 6,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgElevated,
  },
  strengthLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginLeft: Spacing.xs,
    width: 35,
  },

  // Info box
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  infoIcon: { fontSize: 16 },
  infoText: { flex: 1, fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },

  // Error box
  errorBox: {
    backgroundColor: '#2A1215',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#4A1520',
  },
  errorText: {
    fontSize: FontSize.sm,
    color: '#FF6B6B',
    lineHeight: 18,
  },

  // Bouton
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  btnDisabled: { opacity: 0.45 },
  btnPrimaryText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '700' },

  // Footer
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  footerLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '700' },
});
