import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { View, Card, CardItem, Left, Body, Right } from 'native-base';
import { FAJR, DHUHR, ASR, MAGHRIB, ISHA } from '../assets/images';
import moment from 'moment';
import PropTypes from 'prop-types';
import { calculateDistance, formatDistance } from '../helpers/geo';

export default function PrayerCard({ navigate, ...props }) {
  const [distance, setDistance] = useState(null);
  const location = useSelector(state => state.locationState);
  const { prayer, scheduleTime, lat, lon, participants } = props;

  useEffect(() => {
    getDistance();
  }, [location]);

  async function getDistance() {
    if (location.lat && location.lon) {
      setDistance(calculateDistance({ lat, lon }, { lat: location.lat, lon: location.lon }));
    }
  }

  function getBackgroundImg() {
    switch (prayer) {
      case 'fajr': return FAJR;
      case 'dhuhr': return DHUHR;
      case 'asr': return ASR;
      case 'maghrib': return MAGHRIB;
      case 'isha': return ISHA;
      default: return MAGHRIB;
    }
  }

  function handleCardPress() {
    navigate('PrayerDetail', props);
  }

  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity onPress={handleCardPress}>
        <Card style={styles.card} pointerEvents="none">
          <CardItem cardBody={true} style={styles.imageWrapper}>
            <Image source={getBackgroundImg()} style={styles.image} />
          </CardItem>
          <CardItem bordered style={styles.descriptionWrapper}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Left>
                <Text style={styles.descriptionTitle}>{prayer}</Text>
              </Left>
              <Right>
                <Text style={styles.scheduleTitle}>{moment(scheduleTime).format('hh:mm A')}</Text>
              </Right>
            </View>
            <View>
              <Text style={styles.invited}>invited by {props.inviter.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <Left><Text>{participants.length} participating</Text></Left>
              {distance && <Right><Text>{formatDistance(distance)}</Text></Right>}
            </View>
          </CardItem>
        </Card>
      </TouchableOpacity>
    </View>
  )
}

PrayerCard.propTypes = {
  scheduleTime: PropTypes.string.isRequired,
  prayer: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  inviter: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired
  })
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
    height: 100,
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