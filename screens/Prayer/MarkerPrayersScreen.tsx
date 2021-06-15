import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { PrayerCard, RoundButton } from '@/components';
import { useTranslation } from 'react-i18next';
import * as Animatable from 'react-native-animatable';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types';
import { RouteProp } from '@react-navigation/native';
import useLogScreenView, { logEvent } from '@/hooks/useLogScreenView';
import { useAuthStatus } from '@/hooks/auth';

type MarkerPrayersNavigationProp = StackNavigationProp<RootStackParamList, 'MarkerPrayers'>;

type MarkerPrayersScreenRouteProp = RouteProp<RootStackParamList, 'MarkerPrayers'>;

type Props = {
  route: MarkerPrayersScreenRouteProp;
  navigation: MarkerPrayersNavigationProp;
};

export default function MarkerPrayersScreen({ navigation, route }: Props) {
  useLogScreenView('marker_prayers');
  const { nearbyPrayers, handleConfirm } = route.params;
  const isAuth = useAuthStatus();
  const { t } = useTranslation(['INVITATION']);

  function handleInvite() {
    const { location } = nearbyPrayers[0];
    handleConfirm({ latitude: location.lat, longitude: location.lng });
    logEvent('confirm_location', { type: 'previous' });
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#eee' }}>
      <View style={styles.prayerListWrapper}>
        <FlatList
          style={{ height: '100%', paddingTop: 25 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          data={nearbyPrayers}
          renderItem={({ item }) => <PrayerCard {...item} navigate={navigation.navigate} />}
          keyExtractor={(item) => item.id}
        />
      </View>
      {isAuth && (
        <Animatable.View animation="pulse" iterationCount="infinite" style={styles.buttonWrapper}>
          <RoundButton
            onPress={handleInvite}
            style={{ width: '100%' }}
            touchableStyle={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}
          >
            {t('INVITE_HERE')}
          </RoundButton>
        </Animatable.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  prayerListWrapper: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 25,
    height: '100%',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 25,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 35,
  },
});
