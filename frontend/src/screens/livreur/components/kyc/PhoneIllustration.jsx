import React from 'react';
import { View } from 'react-native';
import { ill, VIOLET, WHITE, VIOLET_LIGHT, VIOLET_MID } from '../../styles/kycStyles';

function CINCard() {
  return (
    <View style={ill.card}>
      <View style={ill.cardHeader}>
        <View style={ill.cardFlag} />
        <View style={ill.cardTitleLine} />
      </View>
      <View style={ill.cardBody}>
        <View style={ill.cardPhoto} />
        <View style={ill.cardLines}>
          <View style={ill.cardLine} />
          <View style={[ill.cardLine, { width: '70%' }]} />
          <View style={[ill.cardLine, { width: '55%' }]} />
        </View>
      </View>
      <View style={[ill.cardLine, { width: '80%', alignSelf: 'center', marginTop: 4 }]} />
    </View>
  );
}

function LicenceCard() {
  return (
    <View style={ill.card}>
      <View style={[ill.cardHeader, { backgroundColor: VIOLET }]}>
        <View style={[ill.cardFlag, { backgroundColor: WHITE, opacity: 0.4 }]} />
        <View style={[ill.cardTitleLine, { backgroundColor: WHITE, opacity: 0.6 }]} />
      </View>
      <View style={ill.cardBody}>
        <View style={[ill.cardPhoto, { borderRadius: 4 }]} />
        <View style={ill.cardLines}>
          <View style={ill.cardLine} />
          <View style={[ill.cardLine, { width: '60%' }]} />
          <View style={[ill.cardLine, { width: '45%' }]} />
        </View>
      </View>
      <View style={[ill.cardLine, { width: '75%', alignSelf: 'center', marginTop: 4 }]} />
    </View>
  );
}

export default function PhoneIllustration({ type }) {
  return (
    <View style={ill.scene}>
      <View style={ill.palm}>
        <View style={ill.fingers}>
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={[ill.finger, { marginLeft: i === 0 ? 0 : 6 }]} />
          ))}
        </View>

        <View style={ill.phone}>
          <View style={ill.notch} />
          <View style={ill.screen}>
            {type === 'cin' ? <CINCard /> : <LicenceCard />}
          </View>
          <View style={ill.homeBar} />
        </View>

        <View style={ill.thumb} />
      </View>
    </View>
  );
}
