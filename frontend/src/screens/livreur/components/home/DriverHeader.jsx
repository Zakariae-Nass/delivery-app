import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { s } from '../../styles/livreurHomeStyles';

export default function DriverHeader({ onMenuOpen, navigation }) {
  const { user } = useSelector((state) => state.auth);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '?';

  return (
    <SafeAreaView edges={['top']} style={s.header}>
      <TouchableOpacity style={s.hamburgerBtn} onPress={onMenuOpen} activeOpacity={0.7}>
        <Ionicons name="menu-outline" size={26} color="#1C1C1E" />
      </TouchableOpacity>

      <View style={s.headerCenter}>
        <Text style={s.greeting}>Bonjour</Text>
        <Text style={s.driverName}>{user?.username || 'Livreur'}</Text>
      </View>

      <View style={s.headerRight}>
        <TouchableOpacity
          style={s.avatarBtn}
          onPress={() => navigation.navigate('DriverProfile')}
          activeOpacity={0.8}
        >
          <Text style={s.avatarText}>{initials}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
