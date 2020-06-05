import React from 'react';
import { StyleSheet, FlatList, TouchableWithoutFeedback, Platform, Image, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, BoldText } from 'components';
import { Ionicons } from '@expo/vector-icons';
import { BALLOON, MAN_AVATAR, WOMAN_AVATAR } from 'assets/images';
import colors from 'constants/Colors';
import { formatAgo } from 'helpers/dateFormat';
import { useTranslation } from 'react-i18next';

export default function NotificationScreen({ navigation }) {
  return (
    <LinearGradient style={styles.container} start={[1, 1]} end={[-1, -1]} colors={[colors.secondary, colors.primary]}>
      <View style={styles.header}>
        <BoldText style={styles.titleStyle}>Notifications</BoldText>
      </View>
      <View style={{ ...styles.notificationListWrapper, height: notifMock.length ? null : '100%' }}>
        {notifMock.map(not => (
          <Card {...not} key={not.id} />
        ))}
        {/* <FlatList
          style={{ height: '100%' }}
          data={notifMock}
          renderItem={({ item }) => <PrayerCard {...item} navigate={navigation.navigate} query={query} />}
          keyExtractor={item => item.id}
          onRefresh={() => {
            setIsRefreshing(true)
            fetchNearbyPrayers().then(() => setIsRefreshing(false));
          }}
          refreshing={isRefreshing}
          ListEmptyComponent={() => (
            <View style={styles.imageContainer}>
              <Image source={NOT_FOUND} style={styles.image} />
              <Text style={styles.notFoundText}>{t('EMPTY')}</Text>
            </View>
          )}
        /> */}
      </View>
    </LinearGradient >
  )
}

const notifMock = [
  {
    id: '4uEBf9Pesbq8dWmq1SGf',
    type: 'join',
    user: 'Ahmad Ali',
    prayer: 'asr',
    gender: 'M',
    timestamp: '2020-06-02T22:50:43+08:00',
  },
  {
    id: '72jyWMT46rRJn0DnNdNh',
    type: 'join',
    user: 'Maryam',
    prayer: 'maghrib',
    gender: 'F',
    timestamp: '2020-04-15T21:40:00+08:00',
  }
]

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 24,
    flex: 1,
  },
  header: {
    marginVertical: 10,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titleStyle: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 25
  },
  notificationListWrapper: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 10
  },
});

function Card({ id, type, user, prayer, gender, timestamp }) {
  const { t } = useTranslation(['NOTIFICATIONS', 'COMMON']);
  const PRAYERS = t('COMMON:PRAYERS', { returnObjects: true });

  let text = '';
  if (type === 'join') {
    text = t('TYPES.JOIN', { user, prayer: PRAYERS[prayer] });
  }

  return (
    <TouchableWithoutFeedback>
      <View style={cardStyle.wrapper}>
        <View style={cardStyle.avatarContainer}>
          <Image source={gender === 'M' ? MAN_AVATAR : WOMAN_AVATAR} style={{ width: 50, height: 50 }} />
        </View>
        <View style={cardStyle.textContainer}>
          <Text style={cardStyle.text}>{text}</Text>
        </View>
        <View style={cardStyle.timeContainer}>
          <Text style={cardStyle.time}>{formatAgo(t, timestamp)}</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Ionicons name={Platform.OS === 'ios' ? 'ios-arrow-dropright-circle' : 'md-arrow-dropright-circle'} size={24} color="#dd4f4f" />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const cardStyle = StyleSheet.create({
  wrapper: {
    width: '100%',
    minHeight: 80,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    marginBottom: 25
  },
  avatarContainer: {
    alignItems: 'center',
    width: '20%'
  },
  textContainer: {
    width: '55%',
    paddingLeft: 5,
    paddingRight: 20,
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 14,
    lineHeight: 17
  },
  timeContainer: {
    width: '25%',
    justifyContent: 'space-between'
  },
  time: {
    color: colors.primary,
    opacity: 0.5,
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 10
  }
})