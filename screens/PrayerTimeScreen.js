import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BoldText, Text } from 'components';
import { PRAYER_TIME_BG } from 'assets/images';
import colors from 'constants/Colors';
import { useTranslation } from 'react-i18next';

export default function PrayerTimeScreen() {
  const { t } = useTranslation(['COMMON']);
  const PRAYERS = t('COMMON:PRAYERS', { returnObjects: true });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <LinearGradient start={[1, 1]} end={[-1, -1]} colors={[colors.secondary, colors.primary]}>
          <View style={styles.container}>
            <ImageBackground style={{ width: '100%', height: 400, resizeMode: 'cover' }} source={PRAYER_TIME_BG}>
              <View style={styles.header}>
                <BoldText style={styles.titleStyle}>Muslim World League</BoldText>
                <TouchableOpacity style={{ marginRight: 25, paddingTop: 7 }}>
                  <Ionicons name={Platform.OS === 'ios' ? 'ios-cog' : 'md-cog'} size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.currentPrayer}>
                <BoldText style={styles.currentPrayerText}>Fajr</BoldText>
                <BoldText style={styles.endTime}>Ends after 05:35</BoldText>
              </View>

              <View style={styles.date}>
                <BoldText style={styles.dateText}>24 Apr 2014 / 01-09-1439</BoldText>
              </View>
            </ImageBackground>

            <View style={styles.prayerTimesContainer}>
              <View style={styles.tableContainer}>

                <View style={styles.tableRow}>
                  <Text style={styles.prayerText}>{PRAYERS.fajr}</Text>
                  <Text style={styles.prayerText}>00:00</Text>
                </View>

                <View style={styles.line} />

                <View style={styles.tableRow}>
                  <Text style={styles.prayerText}>Sunrise</Text>
                  <Text style={styles.prayerText}>00:00</Text>
                </View>

                <View style={styles.line} />

                <View style={styles.tableRow}>
                  <Text style={styles.prayerText}>{PRAYERS.dhuhr}</Text>
                  <Text style={styles.prayerText}>00:00</Text>
                </View>

                <View style={styles.line} />

                <View style={styles.tableRow}>
                  <Text style={styles.prayerText}>{PRAYERS.asr}</Text>
                  <Text style={styles.prayerText}>00:00</Text>
                </View>

                <View style={styles.line} />

                <View style={styles.tableRow}>
                  <Text style={styles.prayerText}>{PRAYERS.maghrib}</Text>
                  <Text style={styles.prayerText}>00:00</Text>
                </View>

                <View style={styles.line} />

                <View style={styles.tableRow}>
                  <Text style={styles.prayerText}>{PRAYERS.isha}</Text>
                  <Text style={styles.prayerText}>00:00</Text>
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
})