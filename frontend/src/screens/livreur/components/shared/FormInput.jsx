import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { fi, GRAY } from '../../styles/kycStyles';

export default function FormInput({ label, value, onChange, placeholder, autoCapitalize }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={fi.wrap}>
      <Text style={fi.label}>{label}</Text>
      <TextInput
        style={[fi.input, focused && fi.inputFocused]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={GRAY}
        autoCapitalize={autoCapitalize || 'none'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}
