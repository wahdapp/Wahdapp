import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { BoldText, Text, LoaderWithoutOverlay } from 'components';
import { PRAYER_TIME_BG } from 'assets/images';
import colors from 'constants/Colors';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';

export default function PrayerTimeScreen() {
  const { t } = useTranslation(['PRAYER_TIME', 'COMMON']);

  const [isFetching, setIsFetching] = useState(true);
  const [prayerTimes, setPrayerTimes] = useState({});
  const [nextPrayer, setNextPrayer] = useState('');
  const [startAfter, setStartAfter] = useState('');
  const [isNextDay, setIsNextDay] = useState(false);

  const PRAYERS = t('COMMON:PRAYERS', { returnObjects: true });

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  useEffect(() => {
    let interval;
    if (!isEmpty(prayerTimes)) {
      interval = setInterval(() => {
        const now = moment();
        // Get the exact time of the next prayer
        const nextPrayerTime = prayerTimes.timings[nextPrayer];
        const fetchDay = moment();
        if (isNextDay) {
          fetchDay.add(1, 'day');
        }
        const nextInMoment = moment(`${fetchDay.format('YYYY-MM-DD')} ${nextPrayerTime}`, 'YYYY-MM-DD HH:mm');

        // If prayer time switches
        if (nextInMoment.isBefore(now)) {
          setNextPrayer(findNextPrayer(prayerTimes.timings));
        }
        else {
          const duration = moment.duration(nextInMoment.diff(now));
          const hours = parseInt(duration.asHours());
          const minutes = parseInt(duration.asMinutes()) % 60;
          const seconds = parseInt(duration.asSeconds()) % 60 % 60;

          setStartAfter(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
        }

      }, 1000);
    }

    return () => clearInterval(interval);
  }, [prayerTimes]);

  async function fetchPrayerTimes() {
    try {
      const position = await Location.getCurrentPositionAsync({});
      const prayers = await getPrayerTimes(position.coords, 3);

      const next = findNextPrayer(prayers.timings);
      const now = moment();

      // If it's already after Isha BUT still before 00:00, get the prayer times for the next day
      if (next === 'Fajr' && moment(prayers.timings.Isha, 'HH:mm').isBefore(now) && now.isBefore(moment('23:59', 'HH:mm'))) {
        setIsNextDay(true);
        setNextPrayer('Fajr');

        const nextDayPrayers = await getPrayerTimes(position.coords, 3, true);
        setPrayerTimes(nextDayPrayers);
        setIsFetching(false);
      }
      else {
        setNextPrayer(findNextPrayer(prayers.timings));
        setPrayerTimes(prayers);

        setIsFetching(false);
      }
    }
    catch (e) {
      throw e;
    }
  }

  if (isFetching) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <LoaderWithoutOverlay size="large" />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingTop: 20 }}>
        <LinearGradient start={[1, 1]} end={[-1, -1]} colors={[colors.secondary, colors.primary]}>
          <View style={styles.container}>
            <ImageBackground style={{ width: '100%', height: 400, resizeMode: 'cover' }} source={PRAYER_TIME_BG}>
              <View style={styles.header}>
                <BoldText style={styles.titleStyle}>{t('HEADER')}</BoldText>
              </View>

              <View style={styles.currentPrayer}>
                <BoldText style={styles.currentPrayerText}>{PRAYERS[nextPrayer.toLowerCase()]}</BoldText>
                <BoldText style={styles.endTime}>{t('BEGINS_AFTER', { time: startAfter })}</BoldText>
              </View>

              <View style={styles.date}>
                <BoldText style={styles.dateText}>{prayerTimes.date.readable} / {prayerTimes.date.hijri.day} {prayerTimes.date.hijri.month.en} {prayerTimes.date.hijri.year}</BoldText>
              </View>
            </ImageBackground>

            <View style={styles.prayerTimesContainer}>
              <View style={styles.tableContainer}>

                <View style={styles.tableRow}>
                  <Text style={styles.prayerText}>{PRAYERS.fajr}</Text>
                  <Text style={styles.prayerText}>{prayerTimes.timings.Fajr}</Text>
                </View>

                <View style={styles.line} />

                <View style={styles.tableRow}>
                  <Text style={styles.prayerText}>{t('SUNRISE')}</Text>
                  <Text style={styles.prayerText}>{prayerTimes.timings.Sunrise}</Text>
                </View>

                <View style={styles.line} />

                <View style={styles.tableRow}>
                  <Text style={styles.prayerText}>{PRAYERS.dhuhr}</Text>
                  <Text style={styles.prayerText}>{prayerTimes.timings.Dhuhr}</Text>
                </View>

                <View style={styles.line} />

                <View style={styles.tableRow}>
                  <Text style={styles.prayerText}>{PRAYERS.asr}</Text>
                  <Text style={styles.prayerText}>{prayerTimes.timings.Asr}</Text>
                </View>

                <View style={styles.line} />

                <View style={styles.tableRow}>
                  <Text style={styles.prayerText}>{PRAYERS.maghrib}</Text>
                  <Text style={styles.prayerText}>{prayerTimes.timings.Maghrib}</Text>
                </View>

                <View style={styles.line} />

                <View style={styles.tableRow}>
                  <Text style={styles.prayerText}>{PRAYERS.isha}</Text>
                  <Text style={styles.prayerText}>{prayerTimes.timings.Isha}</Text>
                </View>
              </View>
            </View>

          </View>
        </LinearGradient>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  header: {
    paddingTop: 24,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titleStyle: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 25
  },
  currentPrayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  currentPrayerText: {
    color: '#fff',
    fontSize: 48,
    letterSpacing: 1.7
  },
  endTime: {
    color: '#fff',
    fontSize: 12,
    marginTop: 10
  },
  date: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dateText: {
    color: '#fff',
    fontSize: 12,
  },
  prayerTimesContainer: {
    paddingHorizontal: 20,
    top: -45
  },
  tableContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderRadius: 25
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  prayerText: {
    color: '#7a7a7a'
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#ddd'
  }
});

/**
 * 
 * @param {Object} position geolocation of the user
 * @param {Number} position.latitude
 * @param {Number} position.longitude
 * @param {Number} method Calculation method
 * @param {Boolean} isNextDay Whether the current time is after Isha or not. If the current time is already after Isha, then fetch the pray times for the next day.
 */
async function getPrayerTimes(position, method, isNextDay) {
  try {
    let now = moment();
    if (isNextDay) {
      now.add(1, 'day');
    }

    const { data } = await axios.get(`http://api.aladhan.com/v1/timings/${now.format('DD-MM-YYYY')}?method=${method}&latitude=${position.latitude}&longitude=${position.longitude}`);

    return data.data;
  }
  catch (e) {
    console.log({ e })
    throw e;
  }
}

function findNextPrayer(timings) {
  const now = moment();

  if (now.isBefore(moment(timings.Fajr, 'HH:mm'))) {
    return 'Fajr';
  }
  if (now.isBefore(moment(timings.Dhuhr, 'HH:mm'))) {
    return 'Dhuhr';
  }
  if (now.isBefore(moment(timings.Asr, 'HH:mm'))) {
    return 'Asr';
  }
  if (now.isBefore(moment(timings.Maghrib, 'HH:mm'))) {
    return 'Maghrib';
  }
  if (now.isBefore(moment(timings.Isha, 'HH:mm'))) {
    return 'Isha';
  }
  return 'Fajr';
}

function pad(num) {
  return ("00" + num).substr(-2, 2);
}