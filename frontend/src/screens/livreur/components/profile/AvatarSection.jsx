import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { s } from '../../styles/driverProfileStyles';

export default function AvatarSection({ avatar, onPickImage }) {
  return (
    <View style={s.avatarSection}>
      <View style={s.avatarWrap}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={s.avatarImg} />
        ) : (
          <View style={s.avatarPlaceholder}>
            <Text style={s.avatarLabel}>PHOTO</Text>
          </View>
        )}
        <TouchableOpacity style={s.cameraBtn} onPress={onPickImage} activeOpacity={0.8}>
          <Text style={s.cameraIcon}>📷</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
