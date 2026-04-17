import React from 'react';
import { Text } from 'react-native';

export default function StarRating({ rating }) {
  const filled = Math.min(5, Math.round(rating));
  return (
    <Text style={{ fontSize: 13, marginBottom: 3 }}>
      {'⭐'.repeat(filled)}
      {'☆'.repeat(Math.max(0, 5 - filled))}
      {'  '}
      {rating.toFixed(1)}
    </Text>
  );
}
