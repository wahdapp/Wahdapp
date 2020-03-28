import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Dimensions, Image, Platform, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { View, Left, Right, Button, List, ListItem } from 'native-base';
import MapView, { Marker } from 'react-native-maps';
import { Text, BoldText } from 'components';
import { MARKER, MAN_AVATAR, WOMAN_AVATAR } from 'assets/images';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { calculateDistance, formatDistance } from 'helpers/geo';

const ScreenHeight = Dimensions.get("window").height;
const ScreenWidth = Dimensions.get("window").width;

export default function PrayerDetailScreen({ route, navigation }) {
  const location = useSelector(state => state.locationState);
  const user = useSelector(state => state.userState);
  const [distance, setDistance] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const { lat, lon, prayer, scheduleTime, participants, inviter } = route.params;
  const [currentParticipants, setCurrentParticipants] = useState(participants);

  useEffect(() => {
    getDistance();
  }, [location]);

  async function getDistance() {
    setDistance(calculateDistance({ lat, lon }, { lat: location.lat, lon: location.lon }));
  }

  function handleJoin() {
    setIsJoined(prev => !prev);
    // setCurrentParticipants(prev => [...prev, user]);
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Ionicons name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'} size={24} />
        </TouchableOpacity>
        <Text style={styles.header}>{prayer} prayer</Text>
        <Ionicons size={24} />
      </View>
      <MapView
        initialRegion={{
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          latitude: lat,
          longitude: lon
        }}
        provider="google"
        style={{ width: '100%', height: ScreenHeight * 0.3 }}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        <Marker coordinate={{ latitude: lat, longitude: lon }}>
          <View>
            <Image source={MARKER} style={{ height: 30, width: 30 }} />
          </View>
        </Marker>
      </MapView>
      <ScrollView style={styles.sectionWrapper}>
        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>{moment(scheduleTime).format('MMM DD, hh:mm A')}</BoldText>
            <Text style={styles.sectionSubHeader}>{formatDistance(distance)}</Text>
          </Left>
          <Right>
            <Button rounded success
              bordered={!isJoined}
              style={{ width: 100, justifyContent: 'center' }}
              onPress={handleJoin}
            >
              <Text style={{ color: isJoined ? '#fff' : '#7C7C7C' }}>{isJoined ? 'JOINED' : 'JOIN'}</Text>
            </Button>
          </Right>
        </View>

        <View style={styles.line} />

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>Description</BoldText>
            <Text style={styles.sectionSubHeader}>{`
Assalamu Alaikum,\n
We are planning to have a jamaat to pray Salat al-Dhuhr at Al-Noor Mosque. We welcome both men and women to join our prayer.\n
Hope to see you soon Insha Allah!
          `}</Text>
          </Left>
        </View>

        <View style={styles.line} />

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>Organizer</BoldText>
            <View style={styles.userList}>
              <UserItem item={inviter} />
            </View>
          </Left>
        </View>

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>Participants ({currentParticipants.length})</BoldText>
            <FlatList
              style={{ width: "100%" }}
              horizontal={true}
              data={currentParticipants}
              renderItem={({ item }) => <UserItem item={item} />}
              keyExtractor={item => item.id}
            />
          </Left>
        </View>
      </ScrollView>
    </View>
  )
}

const UserItem = ({ item }) => (
  <View style={styles.userItem}>
    <View style={{ alignItems: 'center' }}>
      <Image source={item.gender === 'M' ? MAN_AVATAR : WOMAN_AVATAR} style={{ width: 50, height: 50 }} />
    </View>
    <View style={{ alignItems: 'center' }}>
      <Text style={styles.userName}>{item.name}</Text>
    </View>
  </View>
)

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20
  },
  detailSectionWrapper: {
    padding: 20,
  },
  header: {
    fontSize: 18,
    color: '#7C7C7C',
    textTransform: 'capitalize'
  },
  sectionWrapper: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%'
  },
  detailSection: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sectionHeader: {
    fontSize: 16,
    marginBottom: 10
  },
  sectionSubHeader: {
    fontSize: 16,
    color: '#7C7C7C',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#ddd'
  },
  userItem: {
    marginTop: 15,
    height: 75,
    width: 75
  },
  userName: {
    marginTop: 5,
    fontSize: 12,
    flexWrap: 'wrap',
    color: '#000'
  }
})