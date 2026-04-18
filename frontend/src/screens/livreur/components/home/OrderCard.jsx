import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { card, CORAL, SUCCESS } from '../../styles/livreurHomeStyles';

const VEHICLE_ICONS = {
  moto: 'bicycle-outline',
  voiture: 'car-outline',
  camion: 'bus-outline',
};

export default function OrderCard({ commande, applied, applying, onApply }) {
  const iconName = VEHICLE_ICONS[commande.vehiculeType] || 'cube-outline';

  return (
    <View style={card.wrap}>
      <View style={card.header}>
        <View style={card.agenceRow}>
          <View style={card.vehicleIconWrap}>
            <Ionicons name={iconName} size={20} color={CORAL} />
          </View>
          <View>
            <Text style={card.agenceName}>{commande.agence?.username || 'Agence'}</Text>
            <Text style={card.orderId}>{commande.numero}</Text>
          </View>
        </View>
        <View style={[card.pricePill, commande.isUrgent && card.urgentPill]}>
          {commande.isUrgent && (
            <Text style={card.urgentLabel}>URGENT </Text>
          )}
          <Text style={card.price}>{commande.price}</Text>
          <Text style={card.priceUnit}> MAD</Text>
        </View>
      </View>

      <View style={card.divider} />

      <View style={card.addressSection}>
        <View style={card.addressRow}>
          <View style={[card.dot, { backgroundColor: CORAL }]} />
          <Text style={card.addressText} numberOfLines={1}>{commande.pickupAddress}</Text>
        </View>
        <View style={card.addressLine} />
        <View style={card.addressRow}>
          <View style={[card.dot, { backgroundColor: SUCCESS }]} />
          <Text style={card.addressText} numberOfLines={1}>{commande.deliveryAddress}</Text>
        </View>
      </View>

      <View style={card.metaRow}>
        <View style={card.metaBadge}>
          <Ionicons name="cube-outline" size={12} color="#888" />
          <Text style={card.metaText}> {commande.packageType}</Text>
        </View>
        <View style={card.metaBadge}>
          <Ionicons name="car-outline" size={12} color="#888" />
          <Text style={card.metaText}> {commande.vehiculeType}</Text>
        </View>
      </View>

      {applied ? (
        <View style={card.appliedBox}>
          <Ionicons name="checkmark-circle-outline" size={16} color={SUCCESS} />
          <Text style={card.appliedText}> Candidature envoyée</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[card.acceptBtn, applying && { opacity: 0.6 }]}
          onPress={onApply}
          disabled={applying}
          activeOpacity={0.85}
        >
          {applying
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={card.acceptBtnText}>Postuler</Text>
          }
        </TouchableOpacity>
      )}
    </View>
  );
}
