import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { s } from '../../styles/driverProfileStyles';

export default function KycConfirmModal({ visible, onClose, onContinue }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={s.kycOverlay}>
        <View style={s.kycPopup}>
          <View style={s.kycIconWrap}>
            <Text style={s.kycIcon}>🪪</Text>
          </View>
          <Text style={s.kycPopupTitle}>Verify Your Identity</Text>
          <Text style={s.kycPopupMsg}>
            Complete KYC verification to get approved as a delivery driver.
          </Text>
          <View style={s.kycBtnRow}>
            <TouchableOpacity style={s.kycCancelBtn} onPress={onClose} activeOpacity={0.75}>
              <Text style={s.kycCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.kycContinueBtn} onPress={onContinue} activeOpacity={0.85}>
              <Text style={s.kycContinueText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
