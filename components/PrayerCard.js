import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Image, View, Animated } from 'react-native';
import { Text } from './Text';
import { FAJR, DHUHR, ASR, MAGHRIB, ISHA, JANAZAH, JUMUAH } from 'assets/images';
import dayjs from 'dayjs';
import { calculateDistance, formatDistance } from 'helpers/geo';
import { formatDay } from 'helpers/dateFormat';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import SkeletonContent from 'react-native-skeleton-content';
import { SCALE } from 'helpers/animation';

export default function PrayerCard({ navigate, ...props }) {
  const { t } = useTranslation('COMMON');
  const locationState = useSelector(state => state.locationState);

  const { guests_male, guests_female, inviter, participants, prayer, schedule_time, location } = props;
  const { lat, lng } = location;

  const [distance, setDistance] = useState(null);
  const [scaleInAnimated] = useState(new Animated.Value(0));

  const PRAYERS = t('PRAYERS', { returnObjects: true });

  useEffect(() => {
    getDistance();
  }, [location]);

  async function getDistance() {
    setDistance(calculateDistance({ lat, lon: lng }, { lat: locationState.latitude, lon: locationState.longitude }));
  }

  function getBackgroundImg() {
    switch (prayer) {
      case 'fajr': return FAJR;
      case 'dhuhr': return DHUHR;
      case 'asr': return ASR;
      case 'maghrib': return MAGHRIB;
      case 'isha': return ISHA;
      case 'janazah': return JANAZAH;
      case 'jumuah': return JUMUAH;
      default: return MAGHRIB;
    }
  }

  function handleCardPress() {
    navigate('PrayerDetail', props);
  }

  return (
    <View style={styles.cardWrapper}>
      <TouchableWithoutFeedback
        onPress={handleCardPress}
        onPressIn={() => { SCALE.pressInAnimation(scaleInAnimated); }}
        onPressOut={() => { SCALE.pressOutAnimation(scaleInAnimated); }}
      >
        <Animated.View style={{ ...styles.card, ...SCALE.getScaleTransformationStyle(scaleInAnimated) }} pointerEvents="none">
          <View style={styles.imageWrapper}>
            <Image source={getBackgroundImg()} style={styles.image} />
          </View>
          <View style={styles.descriptionWrapper}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <Text style={styles.descriptionTitle}>{PRAYERS[prayer]}</Text>
              <Text style={styles.scheduleTitle}>{dayjs(schedule_time).format('hh:mm A')}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <Text style={styles.invited}>{t('PRAYER_CARD.INVITED', { name: inviter.full_name })}</Text>
              <Text style={styles.invited}>{formatDay(t, dayjs(schedule_time))}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 10 }}>
              <Text style={{ fontSize: 12 }}>{t('PRAYER_CARD.PARTICIPATING', { num: 1 + participants.length + guests_male + guests_female })}</Text>
              {distance ? <Text style={{ fontSize: 12 }}>{formatDistance(distance, t)}</Text> : null}
            </View>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 20,
    width: '100%'
  },
  card: {
    padding: 25,
    borderRadius: 22,
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14
  },
  imageWrapper: {
    height: 200,
    width: null,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  image: {
    resizeMode: 'cover',
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  descriptionWrapper: {
    minHeight: 100,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: '#fff'
  },
  descriptionTitle: {
    textTransform: 'capitalize',
    fontSize: 22,
  },
  scheduleTitle: {
    textTransform: 'uppercase',
    fontSize: 22,
  },
  invited: {
    fontSize: 12,
    color: '#7C7C7C',
    textAlignVertical: 'bottom'
  }
});

export function SkeletonCard() {
  return (
    <View style={styles.cardWrapper}>
      <View style={[styles.card, { backgroundColor: '#fff', height: 350, padding: 0 }]} pointerEvents="none">
        <View style={{
          backgroundColor: '#E1E9EE',
          width: '100%',
          height: 200,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20
        }} />

        <SkeletonContent
          layout={[
            {
              width: 80,
              height: 30,
            },
            {
              width: 140,
              height: 30,
            },
          ]}
          containerStyle={style.first}
          isLoading={true}>
        </SkeletonContent>

        <SkeletonContent
          layout={[
            {
              width: 220,
              height: 20,
              marginBottom: 6
            },
            {
              width: 180,
              height: 20,
            },
          ]}
          containerStyle={{ paddingBottom: 20, paddingLeft: 20 }}
          isLoading={true}>
        </SkeletonContent>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  image: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  first: {
    width: '100%',
    padding: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  }
})