import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { card, CORAL, SUCCESS, VEHICLE_ICONS } from '../../styles/livreurHomeStyles';

export default function OrderCard({ commande, applied, onApply }) {
  return (
    <View style={card.wrap}>
      {/* Header row */}
      <View style={card.header}>
        <View style={card.agenceRow}>
          <View style={card.vehicleIconWrap}>
            <Text style={card.vehicleIcon}>
              {VEHICLE_ICONS[commande.vehiculeType] || '📦'}
            </Text>
          </View>
          <View>
            <Text style={card.agenceName}>{commande.agence}</Text>
            <Text style={card.orderId}>#CMD-{commande.id.padStart(4, '0')}</Text>
          </View>
        </View>
        <View style={card.pricePill}>
          <Text style={card.price}>{commande.prix}</Text>
          <Text style={card.priceUnit}> MAD</Text>
        </View>
      </View>

      <View style={card.divider} />

      {/* Addresses */}
      <View style={card.addressSection}>
        <View style={card.addressRow}>
          <View style={[card.dot, { backgroundColor: CORAL }]} />
          <Text style={card.addressText} numberOfLines={1}>{commande.pickupAdresse}</Text>
        </View>
        <View style={card.addressLine} />
        <View style={card.addressRow}>
          <View style={[card.dot, { backgroundColor: SUCCESS }]} />
          <Text style={card.addressText} numberOfLines={1}>{commande.depotAdresse}</Text>
        </View>
      </View>

      {/* Meta badges */}
      <View style={card.metaRow}>
        <View style={card.metaBadge}>
          <Text style={card.metaText}>📍 {commande.distance} km</Text>
        </View>
        <View style={card.metaBadge}>
          <Text style={card.metaText}>⏱ {commande.tempsEstime}</Text>
        </View>
        <Text style={card.description} numberOfLines={1}>{commande.description}</Text>
      </View>

      {/* Postuler / Applied */}
      {applied ? (
        <View style={card.appliedBox}>
          <Text style={card.appliedText}>✅ Candidature envoyée — En attente de sélection...</Text>
        </View>
      ) : (
        <TouchableOpacity style={card.acceptBtn} onPress={onApply} activeOpacity={0.85}>
          <Text style={card.acceptBtnText}>Postuler →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
