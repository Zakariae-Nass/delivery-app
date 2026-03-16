import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { m, CORAL } from '../../styles/walletStyles';
import TransactionRow from './TransactionRow';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const FILTER_TABS = [
  { key: 'all',     label: 'Tous'    },
  { key: 'credits', label: 'Crédits' },
  { key: 'debits',  label: 'Débits'  },
];

export default function HistorySheet({ visible, onClose, historyData, historyFilter, onFilterChange }) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0, tension: 65, friction: 11, useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT, duration: 280, useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={m.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <Animated.View style={[m.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <SafeAreaView edges={['bottom']}>
            <View style={m.handle} />

            <View style={m.sheetHeader}>
              <Text style={m.sheetTitle}>Historique</Text>
              <TouchableOpacity style={m.closeBtn} onPress={onClose} activeOpacity={0.7}>
                <Text style={m.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={m.filterRow}>
              {FILTER_TABS.map(tab => (
                <TouchableOpacity
                  key={tab.key}
                  style={m.filterTab}
                  onPress={() => onFilterChange(tab.key)}
                  activeOpacity={0.7}
                >
                  <Text style={[m.filterTabText, historyFilter === tab.key && m.filterTabTextActive]}>
                    {tab.label}
                  </Text>
                  {historyFilter === tab.key && <View style={m.filterUnderline} />}
                </TouchableOpacity>
              ))}
            </View>
            <View style={m.filterDivider} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={m.listContent}
            >
              {historyData.map(tx => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
              {historyData.length === 0 && (
                <View style={m.emptyState}>
                  <Text style={m.emptyText}>Aucune transaction</Text>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}
