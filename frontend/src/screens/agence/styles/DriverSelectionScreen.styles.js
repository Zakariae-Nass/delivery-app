import { StyleSheet } from 'react-native';
import { COLORS } from '../../../config/constants';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backBtnText: { fontSize: 26, color: '#333' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E' },
  orderBadge: {
    backgroundColor: COLORS.blueLight,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  orderBadgeText: { color: COLORS.blue, fontWeight: '700', fontSize: 13 },

  list: { padding: 16, paddingBottom: 40 },

  timerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  timerDisplay: {
    fontSize: 58,
    fontWeight: '700',
    color: '#1A1A2E',
    letterSpacing: 4,
    marginBottom: 6,
    fontVariant: ['tabular-nums'],
  },
  timerUrgent: { color: COLORS.danger },
  timerLabel: { fontSize: 13, color: '#999', marginBottom: 18 },
  barBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#F0F0F5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    backgroundColor: COLORS.blue,
    borderRadius: 3,
  },
  waitingText: { fontSize: 14, color: '#999', marginTop: 14 },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    marginBottom: 10,
    marginLeft: 2,
  },
});
