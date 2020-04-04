import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Image } from 'react-native';
import { Text } from './Text';
import { View, Card, CardItem, Left, Body, Right } from 'native-base';
import { FAJR, DHUHR, ASR, MAGHRIB, ISHA, JANAZAH, JUMUAH } from '../assets/images';
import moment from 'moment';
import PropTypes from 'prop-types';
import { calculateDistance, formatDistance } from '../helpers/geo';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

export default function PrayerCard({ navigate, ...props }) {
  const { t } = useTranslation('COMMON');
  const [distance, setDistance] = useState(null);
  const location = useSelector(state => state.locationState);
  const { prayer, scheduleTime, geolocation, participants, inviter, guests } = props;
  const lat = geolocation.latitude;
  const lon = geolocation.longitude;

  const PRAYERS = t('PRAYERS', { returnObjects: true });

  useEffect(() => {
    getDistance();
  }, [location]);

  async function getDistance() {
    setDistance(calculateDistance({ lat, lon }, { lat: location.latitude, lon: location.longitude }));
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
      <TouchableNativeFeedback onPress={handleCardPress}>
        <Card style={styles.card} pointerEvents="none">
          <CardItem cardBody={true} style={styles.imageWrapper}>
            <Image source={getBackgroundImg()} style={styles.image} />
          </CardItem>
          <CardItem bordered style={styles.descriptionWrapper}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Left>
                <Text style={styles.descriptionTitle}>{PRAYERS[prayer]}</Text>
              </Left>
              <Right>
                <Text style={styles.scheduleTitle}>{moment(scheduleTime).locale(i18n.language.toLocaleLowerCase()).format('hh:mm A')}</Text>
              </Right>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Left><Text style={styles.invited}>{t('PRAYER_CARD.INVITED', { name: inviter.fullName })}</Text></Left>
              <Right><Text style={styles.invited}>{moment(scheduleTime).locale(i18n.language.toLocaleLowerCase()).format('DD MMM')}</Text></Right>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
              <Left><Text>{t('PRAYER_CARD.PARTICIPATING', { num: 1 + participants.length + guests.male + guests.female })}</Text></Left>
              {distance && <Right><Text>{formatDistance(distance)}</Text></Right>}
            </View>
          </CardItem>
        </Card>
      </TouchableNativeFeedback>
    </View>
  )
}

PrayerCard.propTypes = {
  scheduleTime: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  prayer: PropTypes.string.isRequired,
  geohash: PropTypes.string.isRequired,
  inviter: PropTypes.any.isRequired,
  inviterID: PropTypes.string.isRequired,
  geolocation: PropTypes.any.isRequired
}

PrayerCard.defaultProps = {
  scheduleTime: 1585292895784,
  prayer: 'isha',
  lat: 0,
  lon: 0,
  id: 'abc',
  inviter: {},
  participants: []
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 20
  },
  card: {
    borderRadius: 8
  },
  imageWrapper: {
    height: 200,
    width: null,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  image: {
    resizeMode: 'cover',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  descriptionWrapper: {
    minHeight: 100,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start'
  },
  descriptionTitle: {
    textTransform: 'capitalize',
    fontSize: 24,
  },
  scheduleTitle: {
    textTransform: 'uppercase',
    fontSize: 24,
  },
  invited: {
    fontSize: 14,
    color: '#7C7C7C',
    textAlignVertical: 'bottom'
  }
})