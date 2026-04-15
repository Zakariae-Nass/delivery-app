import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { s } from '../../styles/driverProfileStyles';

export default function ProfileInfoCard({ fields, onEdit }) {
  return (
    <View style={s.infoCard}>
      <TouchableOpacity style={s.editIconBtn} onPress={onEdit} activeOpacity={0.75}>
        <Text style={s.editIcon}>✏️</Text>
      </TouchableOpacity>

      {fields.map((field, i) => (
        <View key={field.label}>
          <View style={s.fieldRow}>
            <Text style={s.fieldLabel}>{field.label}</Text>
            <Text style={[s.fieldValue, field.isPassword && s.fieldDots]}>
              {field.value}
            </Text>
          </View>
          {i < fields.length - 1 && <View style={s.divider} />}
        </View>
      ))}
    </View>
  );
}
