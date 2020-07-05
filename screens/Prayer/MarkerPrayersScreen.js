import React from 'react';
import { StyleSheet, FlatList, Platform, View } from 'react-native';
import { PrayerCard, RoundButton } from 'components';
import { useTranslation } from 'react-i18next';

export default function MarkerPrayersScreen({ navigation, route }) {
  const { nearbyPrayers, handleConfirm } = route.params;
  const { t } = useTranslation(['INVITATION']);

  function handleInvite() {
    const { location } = nearbyPrayers[0];
    handleConfirm({ latitude: location.lat, longitude: location.lng });
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#eee' }}>
      <View style={styles.prayerListWrapper}>
        <FlatList
          style={{ height: '100%', paddingTop: 25 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          data={nearbyPrayers}
          renderItem={({ item }) => <PrayerCard {...item} navigate={navigation.navigate} />}
          keyExtractor={item => item.id}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <RoundButton onPress={handleInvite}>
          {t('INVITE_HERE')}
        </RoundButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  prayerListWrapper: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 25,
    height: '100%',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 25,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  }
})