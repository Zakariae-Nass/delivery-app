import React, { useState, useEffect } from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import DrawerMenu from '../../components/DrawerMenu';
import { s, WHITE, INITIAL_DRIVER, VIEW_FIELDS } from './styles/driverProfileStyles';
import ProfileHeader from './components/profile/ProfileHeader';
import AvatarSection from './components/profile/AvatarSection';
import ProfileInfoCard from './components/profile/ProfileInfoCard';
import KycConfirmModal from './components/profile/KycConfirmModal';
import EditProfileSheet from './components/profile/EditProfileSheet';

export default function DriverProfileScreen({ navigation, route }) {
  const [driver, setDriver]         = useState(INITIAL_DRIVER);
  const [editData, setEditData]     = useState({});
  const [sheetOpen, setSheetOpen]   = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [avatar, setAvatar]         = useState(null);
  const [kycStatus, setKycStatus]   = useState('not_verified');
  const [kycConfirm, setKycConfirm] = useState(false);

  useEffect(() => {
    if (route?.params?.kycStatus) {
      setKycStatus(route.params.kycStatus);
      navigation.setParams({ kycStatus: undefined });
    }
  }, [route?.params?.kycStatus]);

  const openSheet = () => {
    setEditData({
      firstName: driver.firstName,
      lastName:  driver.lastName,
      email:     driver.email,
      password:  '',
      phone:     driver.phone,
      location:  driver.location,
    });
    setSheetOpen(true);
  };

  const closeSheet = () => setSheetOpen(false);

  const handleConfirm = () => {
    setDriver(prev => ({
      ...prev,
      firstName: editData.firstName || prev.firstName,
      lastName:  editData.lastName  || prev.lastName,
      email:     editData.email     || prev.email,
      phone:     editData.phone     || prev.phone,
      location:  editData.location  || prev.location,
    }));
    closeSheet();
  };

  const handlePickImage = async () => {
    try {
      const ImagePicker = require('expo-image-picker');
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (!result.canceled && result.assets?.length) {
        setAvatar(result.assets[0].uri);
      }
    } catch {
      // expo-image-picker not yet installed — run: expo install expo-image-picker
    }
  };

  const fields = VIEW_FIELDS(driver);

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <ProfileHeader
          onMenuOpen={() => setDrawerOpen(true)}
          kycStatus={kycStatus}
          onKycPress={() => kycStatus === 'not_verified' && setKycConfirm(true)}
        />

        {/* ── Avatar ── */}
        <AvatarSection avatar={avatar} onPickImage={handlePickImage} />

        {/* ── Info Card ── */}
        <ProfileInfoCard fields={fields} onEdit={openSheet} />

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── KYC Confirmation Modal ── */}
      <KycConfirmModal
        visible={kycConfirm}
        onClose={() => setKycConfirm(false)}
        onContinue={() => {
          setKycConfirm(false);
          navigation.navigate('KycVerification');
        }}
      />

      {/* ── Drawer ── */}
      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navigation={navigation}
        activeScreen="DriverProfile"
        avatar={avatar}
        driverName={`${driver.firstName} ${driver.lastName}`}
        driverEmail={driver.email}
      />

      {/* ── Edit Bottom Sheet ── */}
      <EditProfileSheet
        visible={sheetOpen}
        editData={editData}
        onChangeField={(key, text) => setEditData(prev => ({ ...prev, [key]: text }))}
        onClose={closeSheet}
        onConfirm={handleConfirm}
      />
    </View>
  );
}
