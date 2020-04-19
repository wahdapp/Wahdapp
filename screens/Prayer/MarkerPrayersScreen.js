import React from 'react';
import { StyleSheet, FlatList, Platform } from 'react-native';
import { View } from 'native-base';
import { PrayerCard, RoundButton } from 'components';
import colors from 'constants/Colors';
import { useTranslation } from 'react-i18next';

export default function MarkerPrayersScreen({ navigation, route }) {
  const { nearbyPrayers, handleConfirm } = route.params;
  const { t } = useTranslation(['INVITATION']);

  function handleInvite() {
    const { geolocation } = nearbyPrayers[0];
    handleConfirm({ latitude: geolocation.latitude, longitude: geolocation.longitude });
  }

  return (
    <View style={{ paddingTop: Platform.OS === 'ios' ? 20 : 24, flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.prayerListWrapper}>
        <RoundButton onPress={handleInvite} style={{ marginBottom: 15 }}>
          {t('INVITE_HERE')}
        </RoundButton>
        <FlatList
          style={{ height: '100%' }}
          data={nearbyPrayers}
          renderItem={({ item }) => <PrayerCard {...item} navigate={navigation.navigate} />}
          keyExtractor={item => item.id}
        />
      </View>
    </View >
  )
}

const styles = StyleSheet.create({
  prayerListWrapper: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 10,
    height: '100%'
  },
  button: {
    height: 52,
    width: '100%',
    borderRadius: 33,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: colors.primary

  },
  buttonText: {
    fontSize: 14,
    letterSpacing: 1.8,
    color: '#ffffff',
  }
})