import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, Platform, TouchableOpacity, ScrollView, Slider, AsyncStorage, FlatList } from 'react-native';
import { View, Left, CheckBox, Right } from 'native-base';
import { Text, BoldText, RoundButton } from 'components';
import { Ionicons } from '@expo/vector-icons';
import { prayerTypes } from 'constants/prayers';
import { setFilter } from 'actions';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'react-i18next';
import colors from 'constants/Colors';

export default function FilterScreen({ route, navigation }) {
  const filter = useSelector(state => state.filterState);
  const [selectedPrayers, setSelectedPrayers] = useState(prayerTypes);
  const [distance, setDistance] = useState(3);
  const [defaultDistance, setDefaultDistance] = useState(3);
  const [sameGender, setSameGender] = useState(false);
  const user = useSelector(state => state.userState);
  const [minNum, setMinNum] = useState(user.gender === 'M' ? 0 : 2);
  const [minimumParticipants, setMinimumParticipants] = useState(minNum);
  const [defaultMinimumParts, setDefaultMinimumParts] = useState(minNum);
  const { t } = useTranslation(['FILTER', 'COMMON']);
  const PRAYERS = t('COMMON:PRAYERS', { returnObjects: true });

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmpty(filter)) {
      setSelectedPrayers(filter.selectedPrayers);
      setDistance(filter.distance);
      setDefaultDistance(filter.distance);
      setMinimumParticipants(filter.minimumParticipants);
      setDefaultMinimumParts(filter.minimumParticipants);
      setSameGender(filter.sameGender);
    }
  }, [filter]);

  useEffect(() => {
    if (user.gender === 'F') {
      if (sameGender) {
        setMinNum(0);
      }
      else {
        setMinNum(2);
        setMinimumParticipants(2);
        setDefaultMinimumParts(2);
      }
    }
  }, [sameGender]);

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
    setMinimumParticipants(minNum);
    setDefaultMinimumParts(minNum);
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
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>

      <View style={{ padding: 20, height: '100%', width: '100%' }}>
        <View style={styles.detailSection}>
          <Left>
            <BoldText style={[styles.sectionHeader, { marginBottom: 5 }]}>{t('PRAYERS')}</BoldText>
            <FlatList
              style={{ width: '100%', paddingTop: 5 }}
              horizontal={true}
              data={prayerTypes}
              renderItem={({ item }) => (
                <RoundButton
                  onPress={() => handlePrayerClick(item)}
                  style={{
                    width: null,
                    minWidth: 80,
                    paddingHorizontal: 20,
                    height: 40,
                    marginBottom: 15,
                    marginRight: 10,
                    borderRadius: 20
                  }}
                  colors={selectedPrayers.includes(item) ? [colors.primary, colors.secondary] : ['#fff', '#fff']}
                  textStyle={{ textTransform: 'capitalize', color: selectedPrayers.includes(item) ? '#fff' : '#dedede' }}
                >
                  {PRAYERS[item]}
                </RoundButton>
              )}
              keyExtractor={item => item}
            />
          </Left>
        </View>

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>{t('DISTANCE')} {`(< ${distance} km)`}</BoldText>
            <Slider
              style={{ width: '100%', height: 40, marginTop: 15 }}
              minimumValue={1}
              value={defaultDistance}
              onValueChange={setDistance}
              step={1}
              maximumValue={30}
              minimumTrackTintColor="#000"
              maximumTrackTintColor="#fff"
            />
          </Left>
        </View>

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>{t('MIN_PARTICIPANTS')}{`(>= ${minimumParticipants} ${minimumParticipants > 1 ? t('PEOPLE') : t('PERSON')})`}</BoldText>
            <Slider
              style={{ width: '100%', height: 40, marginTop: 15 }}
              minimumValue={minNum}
              value={defaultMinimumParts}
              onValueChange={setMinimumParticipants}
              step={1}
              maximumValue={30}
              minimumTrackTintColor="#000"
              maximumTrackTintColor="#fff"
            />
          </Left>
        </View>

        {user.gender === 'F' && (
          <View style={styles.detailSection}>
            <Left>
              <BoldText style={styles.sectionHeader}>{t('SAME_GENDER')}</BoldText>
              <Text style={styles.sectionSubHeader}>{t('CHECKBOX_DESC')}</Text>
            </Left>
            <Right>
              <CheckBox checked={sameGender} onPress={() => setSameGender(prev => !prev)} color={colors.primary} />
            </Right>
          </View>
        )}

        <View style={{ marginTop: 20 }}>
          <RoundButton onPress={applyFilter} style={{ marginBottom: 15 }}>
            {t('BUTTON')}
          </RoundButton>
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
    borderRadius: 25,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 40,
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
    fontSize: 14,
    marginBottom: 10,
    color: '#7C7C7C'
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
  applyBtn: {
    height: 52,
    width: '100%',
    borderRadius: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: colors.primary
  }
})