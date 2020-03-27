import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { View, Text, Card, CardItem } from 'native-base';
import { FAJR, DHUHR, ASR, MAGHRIB, ISHA } from '../assets/images';
import moment from 'moment';

export default function PrayerCard(props) {
  const { prayer } = props;
  console.log(prayer)

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
  return (
    <View style={styles.cardWrapper}>
      <Card style={styles.card}>
        <CardItem cardBody={true} style={styles.imageWrapper}>
          <Image source={getBackgroundImg()} style={styles.image} />
        </CardItem>
        <CardItem bordered style={styles.descriptionWrapper}>
          <Text style={styles.descriptionTitle}>{prayer}</Text>
        </CardItem>
      </Card>
    </View>
  )
}

PrayerCard.defaultProps = {
  scheduleTime: 1585292895784,
  timestamp: 1585292895784,
  prayer: 'isha',
  join: 0,
  max: 0,
  lat: 0,
  lon: 0,
  id: 'abc'
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
    padding: 15,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  descriptionTitle: {
    textTransform: 'capitalize',
    fontSize: 24
  }
})