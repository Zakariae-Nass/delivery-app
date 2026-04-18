import { StyleSheet } from 'react-native';
import { Spacing, Radius, FontSize } from '../../../config/theme';

const WHITE      = '#FFFFFF';
const LIGHT_BG   = '#F5F5F7';
const DARK_TEXT  = '#1C1C1E';
const GRAY_LABEL = '#8E8EA0';
const GRAY_DIV   = '#ECECF0';
const CORAL      = '#FF6B35';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: LIGHT_BG },
  container: { flex: 1, backgroundColor: LIGHT_BG },
  scrollContent: { paddingBottom: 32 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: WHITE,
  },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: LIGHT_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: { fontSize: FontSize.sm, color: GRAY_LABEL },
  agenceName: { fontSize: FontSize.xl, fontWeight: '800', color: DARK_TEXT },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notifBtn: { position: 'relative', padding: Spacing.xs },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },

  statsScroll: { marginBottom: Spacing.md, marginTop: Spacing.md },
  statsContent: { paddingHorizontal: Spacing.lg, gap: 10 },

  newCommandeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CORAL,
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    height: 52,
    gap: 8,
    marginBottom: Spacing.lg,
    shadowColor: CORAL,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  newCommandeText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '700' },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  voirTout: { fontSize: FontSize.sm, color: CORAL, fontWeight: '600' },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: DARK_TEXT },
  sectionCount: {
    backgroundColor: LIGHT_BG,
    color: GRAY_LABEL,
    fontSize: FontSize.xs,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: GRAY_DIV,
  },

  filtersScroll: { marginBottom: Spacing.md },
  filtersContent: { paddingHorizontal: Spacing.lg, gap: 8 },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: GRAY_DIV,
  },
  filterChipActive: {
    backgroundColor: 'rgba(255,107,53,0.1)',
    borderColor: 'rgba(255,107,53,0.5)',
  },
  filterText: { fontSize: FontSize.sm, color: GRAY_LABEL, fontWeight: '600' },
  filterTextActive: { color: CORAL },

  commandesList: { paddingHorizontal: Spacing.lg, gap: 12 },

  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText:  { fontSize: FontSize.sm, color: GRAY_LABEL, marginBottom: 12 },
  emptyLink:  { fontSize: FontSize.sm, color: CORAL, fontWeight: '700' },
});
