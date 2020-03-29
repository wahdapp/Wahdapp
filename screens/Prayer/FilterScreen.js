import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, Platform, TouchableOpacity, ScrollView, Slider, AsyncStorage } from 'react-native';
import { View, Left, Button, CheckBox, Right } from 'native-base';
import { Text, BoldText } from 'components';
import { Ionicons } from '@expo/vector-icons';
import { prayerTypes } from 'constants/prayers';
import { setFilter } from 'actions';
import isEmpty from 'lodash/isEmpty';

export default function FilterScreen({ route, navigation }) {
  const filter = useSelector(state => state.filterState);
  const [selectedPrayers, setSelectedPrayers] = useState(prayerTypes);
  const [distance, setDistance] = useState(3);
  const [sameGender, setSameGender] = useState(false);
  const user = useSelector(state => state.userState);
  const [minimumParticipants, setMinimumParticipants] = useState(user.gender === 'M' ? 0 : 2);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmpty(filter)) {
      setSelectedPrayers(filter.selectedPrayers);
      setDistance(filter.distance);
      setMinimumParticipants(filter.minimumParticipants);
      setSameGender(filter.sameGender);
    }
  }, [filter]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={resetFilter} style={{ marginRight: 25 }}>
          <Ionicons name={Platform.OS === 'ios' ? 'ios-refresh' : 'md-refresh'} size={24} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  function resetFilter() {
    setSelectedPrayers(prayerTypes);
    setDistance(3);
    setMinimumParticipants(user.gender === 'M' ? 0 : 2);
    setSameGender(false)
  }

  async function applyFilter() {
    const prayersFilter = {
      selectedPrayers,
      distance,
      minimumParticipants,
      sameGender
    };
    await AsyncStorage.setItem('prayersFilter', JSON.stringify(prayersFilter));
    dispatch(setFilter(prayersFilter));

    navigation.goBack();
  }

  function handlePrayerClick(prayer) {
    if (selectedPrayers.includes(prayer)) {
      setSelectedPrayers(prev => prev.filter(p => p !== prayer));
    }
    else {
      setSelectedPrayers(prev => [...prev, prayer]);
    }
  }

  return (
    <ScrollView style={{ flex: 1 }}>

      <View style={{ padding: 20, height: '100%', width: '100%' }}>
        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>Prayers:</BoldText>
            <View style={styles.prayerList}>
              {prayerTypes.map((prayer, i) => (
                <Button block rounded success key={i}
                  bordered={!selectedPrayers.includes(prayer)}
                  onPress={() => handlePrayerClick(prayer)}
                  style={{ ...styles.prayerBtn, borderWidth: selectedPrayers.includes(prayer) ? 0 : 2, borderColor: selectedPrayers.includes(prayer) ? null : '#7C7C7C' }}
                >
                  <Text style={{ textTransform: 'capitalize', color: selectedPrayers.includes(prayer) ? '#fff' : '#7C7C7C' }}>{prayer}</Text>
                </Button>
              ))}
            </View>
          </Left>
        </View>

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>Distance: {`(< ${distance} km)`}</BoldText>
            <Slider
              style={{ width: '100%', height: 40, marginTop: 15 }}
              minimumValue={1}
              value={distance}
              step={1}
              maximumValue={50}
              minimumTrackTintColor="#000"
              maximumTrackTintColor="#fff"
              onSlidingComplete={setDistance}
            />
          </Left>
        </View>

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>Minimum Participants:{`\n(>= ${minimumParticipants} ${minimumParticipants > 1 ? 'people' : 'person'})`}</BoldText>
            <Slider
              style={{ width: '100%', height: 40, marginTop: 15 }}
              minimumValue={user.gender === 'M' ? 0 : 2}
              value={minimumParticipants}
              step={1}
              maximumValue={50}
              minimumTrackTintColor="#000"
              maximumTrackTintColor="#fff"
              onSlidingComplete={setMinimumParticipants}
            />
          </Left>
        </View>

        {user.gender === 'F' && (
          <View style={styles.detailSection}>
            <Left>
              <BoldText style={styles.sectionHeader}>Same gender:</BoldText>
              <Text style={styles.sectionSubHeader}>If checked, you will only see invitations organized by females.</Text>
            </Left>
            <Right>
              <CheckBox checked={sameGender} onPress={() => setSameGender(prev => !prev)} color="#589e61" />
            </Right>
          </View>
        )}

        <View style={styles.applySection}>
          <Button block rounded success style={styles.applyBtn} onPress={applyFilter}>
            <Text style={{ color: '#fff', fontSize: 18 }}>SAVE</Text>
          </Button>
        </View>
      </View>
    </ScrollView >
  )
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20
  },
  header: {
    fontSize: 18,
    color: '#7C7C7C',
    textTransform: 'capitalize'
  },
  prayerBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
    paddingHorizontal: 20,
    marginBottom: 15,
    marginRight: 10
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#ddd'
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
    fontSize: 12,
    color: '#7C7C7C',
  },
  prayerList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 15
  },
  applySection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
    paddingHorizontal: 10
  }
})