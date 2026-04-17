import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../config/constants';
import useDriverSelection from '../../hooks/useDriverSelection';
import DriverCard from './components/DriverCard';
import { styles } from './styles/DriverSelectionScreen.styles';

export default function DriverSelectionScreen({ navigation, route }) {
  const { orderId } = route.params;
  const {
    timeLeft,
    timerText,
    isTimerUrgent,
    applicants,
    shortId,
    handleAssignDriver,
    TIMER_TOTAL,
  } = useDriverSelection(orderId, navigation);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choisir un livreur</Text>
        <View style={styles.orderBadge}>
          <Text style={styles.orderBadgeText}>#{shortId}</Text>
        </View>
      </View>

      <FlatList
        data={applicants}
        keyExtractor={item => item.id}
        extraData={applicants.length}
        ListHeaderComponent={(
          <>
            <View style={styles.timerCard}>
              <Text style={[styles.timerDisplay, isTimerUrgent && styles.timerUrgent]}>
                {timerText}
              </Text>
              <Text style={styles.timerLabel}>Temps restant pour choisir</Text>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${(timeLeft / TIMER_TOTAL) * 100}%` },
                    isTimerUrgent && { backgroundColor: COLORS.danger },
                  ]}
                />
              </View>
              {applicants.length === 0 && (
                <Text style={styles.waitingText}>En attente de livreurs...</Text>
              )}
            </View>
            {applicants.length > 0 && (
              <Text style={styles.sectionLabel}>
                {applicants.length} livreur{applicants.length > 1 ? 's' : ''} disponible{applicants.length > 1 ? 's' : ''}
              </Text>
            )}
          </>
        )}
        renderItem={({ item }) => (
          <DriverCard driver={item} onAssign={handleAssignDriver} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
