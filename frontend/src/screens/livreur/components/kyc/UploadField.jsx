import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { uf } from '../../styles/kycStyles';

export default function UploadField({ label, uri, onPress }) {
  return (
    <View style={uf.wrap}>
      <Text style={uf.label}>{label}</Text>
      <TouchableOpacity
        style={[uf.area, uri && uf.areaFilled]}
        onPress={onPress}
        activeOpacity={0.75}
      >
        {uri ? (
          <View style={uf.previewWrap}>
            <Image source={{ uri }} style={uf.preview} />
            <View style={uf.changeOverlay}>
              <Text style={uf.changeText}>Change</Text>
            </View>
          </View>
        ) : (
          <>
            <View style={uf.iconCircle}>
              <Text style={uf.icon}>📎</Text>
            </View>
            <Text style={uf.uploadText}>Tap to upload a photo</Text>
            <Text style={uf.uploadHint}>JPG, PNG supported</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
