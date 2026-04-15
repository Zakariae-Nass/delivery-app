import React from 'react';
import { View, Text } from 'react-native';
import { pb } from '../../styles/kycStyles';

export default function StepProgress({ step }) {
  const steps = ['CIN', 'Licence', 'Confirm'];
  return (
    <View style={pb.row}>
      {steps.map((label, i) => {
        const num      = i + 1;
        const isActive = step >= num;
        const isDone   = step > num;
        return (
          <View key={label} style={pb.stepWrap}>
            {i > 0 && (
              <View style={[pb.line, isActive && pb.lineActive]} />
            )}
            <View style={{ alignItems: 'center' }}>
              <View style={[pb.dot, isActive && pb.dotActive]}>
                <Text style={[pb.dotText, isActive && pb.dotTextActive]}>
                  {isDone ? '✓' : num}
                </Text>
              </View>
              <Text style={[pb.label, isActive && pb.labelActive]}>{label}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
