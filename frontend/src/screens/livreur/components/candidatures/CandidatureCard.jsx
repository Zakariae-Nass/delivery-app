import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { card, STATUS_CFG, VEHICLE_ICONS, CORAL, SUCCESS } from '../../styles/candidaturesStyles';

export default function CandidatureCard({ candidature, featured, onVoirDetails }) {
  const cfg       = STATUS_CFG[candidature.statut] || STATUS_CFG.en_attente;
  const isElimine = candidature.statut === 'elimine';
  const isSelect  = candidature.statut === 'selectionne';

  return (
    <View style={[
      card.wrap,
      isElimine && card.wrapEliminated,
      featured  && card.wrapFeatured,
    ]}>
      {/* Agency + status pill */}
      <View style={card.topRow}>
        <View style={card.agenceRow}>
          <View style={[card.vehicleIconWrap, featured && card.vehicleIconWrapFeatured]}>
            <Text style={card.vehicleIcon}>
              {VEHICLE_ICONS[candidature.vehiculeType] || '📦'}
            </Text>
          </View>
          <View>
            <Text style={card.agenceName}>{candidature.agence}</Text>
            <Text style={card.orderId}>#CMD-{candidature.id.padStart(4, '0')}</Text>
          </View>
        </View>
        <View style={[card.statusPill, { backgroundColor: cfg.bg }]}>
          <Text style={card.statusText}>{cfg.prefix} {cfg.label}</Text>
        </View>
      </View>

      {/* Price */}
      <View style={card.pricePill}>
        <Text style={card.price}>{candidature.prix}</Text>
        <Text style={card.priceUnit}> MAD</Text>
      </View>

      <View style={card.divider} />

      {/* Addresses */}
      <View style={card.addressSection}>
        <View style={card.addressRow}>
          <View style={[card.dot, { backgroundColor: CORAL }]} />
          <Text style={card.addressText} numberOfLines={1}>{candidature.pickupAdresse}</Text>
        </View>
        <View style={card.addressLine} />
        <View style={card.addressRow}>
          <View style={[card.dot, { backgroundColor: SUCCESS }]} />
          <Text style={card.addressText} numberOfLines={1}>{candidature.depotAdresse}</Text>
        </View>
      </View>

      {/* Meta badges */}
      <View style={card.metaRow}>
        <View style={card.metaBadge}>
          <Text style={card.metaText}>📍 {candidature.distance} km</Text>
        </View>
        <View style={card.metaBadge}>
          <Text style={card.metaText}>⏱ {candidature.tempsEstime}</Text>
        </View>
        <Text style={card.description} numberOfLines={1}>{candidature.description}</Text>
      </View>

      {/* CTA for selected */}
      {isSelect && (
        <TouchableOpacity style={card.detailsBtn} onPress={onVoirDetails} activeOpacity={0.85}>
          <Text style={card.detailsBtnText}>Voir les détails →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
