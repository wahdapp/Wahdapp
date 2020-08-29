import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, TouchableWithoutFeedback, Platform, Image, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Notifications } from 'expo';
import { Text, BoldText } from 'components';
import { Feather } from '@expo/vector-icons';
import { BALLOON, MAN_AVATAR, WOMAN_AVATAR } from 'assets/images';
import colors from 'constants/Colors';
import { formatAgo } from 'helpers/dateFormat';
import { useTranslation } from 'react-i18next';
import { setIsNewNotification } from 'actions';

export default function NotificationScreen({ navigation }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const notificationState = useSelector(state => state.notificationState);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      dispatch(setIsNewNotification(false));
      Notifications.setBadgeNumberAsync(0);
    });

    return () => {
      unsubscribe();
    }
  }, [navigation]);

  return (
    <LinearGradient style={styles.container} start={[1, 1]} end={[-1, -1]} colors={[colors.secondary, colors.primary]}>
      <View style={styles.header}>
        <BoldText style={styles.titleStyle}>Notifications</BoldText>
      </View>
      <View style={{ ...styles.notificationListWrapper, height: notifMock.length ? null : '100%' }}>
        <FlatList
          style={{ height: '100%' }}
          data={notificationState.notifications}
          renderItem={({ item }) => <Card {...item} key={item.id} />}
          keyExtractor={item => item.id}
          onRefresh={() => {
            setIsRefreshing(true);
          }}
          refreshing={isRefreshing}
          ListEmptyComponent={() => (
            <View style={styles.imageContainer}>
              <Image source={BALLOON} style={styles.image} />
              <Text style={styles.notFoundText}>You have no notification yet!</Text>
            </View>
          )}
        />
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
  imageContainer: {
    width: '100%',
    borderRadius: 25,
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 25,
    paddingHorizontal: 10
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
    height: 250,
  },
  notFoundText: {
    textAlign: 'center',
    color: '#7C7C7C',
    fontSize: 18,
  }
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
            <Feather name="arrow-right" size={24} color="#dd4f4f" />
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
    fontSize: 12,
    lineHeight: 17
  },
  timeContainer: {
    width: '25%',
    justifyContent: 'space-between'
  },
  time: {
    color: colors.primary,
    opacity: 0.5,
    fontSize: 10,
    textAlign: 'right',
    marginBottom: 10
  }
})