import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s } from '../../styles/livreurHomeStyles';

export default function DriverHeader({ onMenuOpen, navigation }) {
  return (
    <SafeAreaView edges={['top']} style={s.header}>
      {/* Hamburger */}
      <TouchableOpacity style={s.hamburgerBtn} onPress={onMenuOpen} activeOpacity={0.7}>
        <Text style={s.hamburgerIcon}>☰</Text>
      </TouchableOpacity>

      <View style={s.headerCenter}>
        <Text style={s.greeting}>Bonjour 👋</Text>
        <Text style={s.driverName}>Youssef Benali</Text>
      </View>

    {/* Profile Icone */}
      <View style={s.headerRight}>
        <TouchableOpacity style={s.notifBtn}>
          <Text style={s.notifIcon}>🔔</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.avatarBtn}
          onPress={() => navigation.navigate('DriverProfile')}
          activeOpacity={0.8}
        >
          <Text style={s.avatarText}>YB</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
