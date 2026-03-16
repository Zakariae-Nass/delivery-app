import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { s, EDIT_FIELDS } from '../../styles/driverProfileStyles';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function EditProfileSheet({ visible, editData, onChangeField, onClose, onConfirm }) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 280,
        useNativeDriver: true,
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
      <View style={s.overlay}>
        <TouchableOpacity style={s.overlayBg} activeOpacity={1} onPress={onClose} />

        <Animated.View style={[s.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={s.sheetHandle} />
            <Text style={s.sheetTitle}>Edit Profile</Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {EDIT_FIELDS.map(field => (
                <View key={field.key} style={s.inputWrap}>
                  <Text style={[s.floatLabel, focused === field.key && s.floatLabelActive]}>
                    {field.label}
                  </Text>
                  <TextInput
                    style={[s.input, focused === field.key && s.inputFocused]}
                    value={editData[field.key] || ''}
                    onChangeText={text => onChangeField(field.key, text)}
                    secureTextEntry={field.secure}
                    keyboardType={field.keyboard || 'default'}
                    autoCapitalize="none"
                    onFocus={() => setFocused(field.key)}
                    onBlur={() => setFocused(null)}
                    placeholderTextColor="#C4C4CE"
                    placeholder={field.label}
                  />
                </View>
              ))}

              <TouchableOpacity style={s.confirmBtn} onPress={onConfirm} activeOpacity={0.85}>
                <Text style={s.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}
