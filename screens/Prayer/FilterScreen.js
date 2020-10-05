import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, StyleSheet, TouchableOpacity, ScrollView, Slider, AsyncStorage, FlatList } from 'react-native';
import { CheckBox } from 'native-base';
import { Text, BoldText, RoundButton, Loader } from '@/components';
import { Feather } from '@expo/vector-icons';
import { prayerTypes } from '@/constants/prayers';
import { setSortBy } from '@/actions';
import { useTranslation } from 'react-i18next';
import { getFilterPreference, updateFilterPreference } from '@/services/user';
import colors from '@/constants/colors';

export default function FilterScreen({ route, navigation }) {
  const user = useSelector(state => state.userState);
  const filterState = useSelector(state => state.filterState);
  const dispatch = useDispatch();

  const [selectedPrayers, setSelectedPrayers] = useState(prayerTypes);
  const [sameGender, setSameGender] = useState(false);
  const [minNum, setMinNum] = useState(user.gender === 'M' ? 0 : 2);
  const [minimumParticipants, setMinimumParticipants] = useState(minNum);
  const [defaultMinimumParts, setDefaultMinimumParts] = useState(minNum);
  const [selectedSort, setSelectedSort] = useState(filterState.sortBy);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(['FILTER', 'COMMON']);

  const PRAYERS = t('COMMON:PRAYERS', { returnObjects: true });

  useEffect(() => {
    fetchFilterPreference();
  }, []);

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
        <TouchableOpacity onPress={resetFilter} style={{ marginRight: 15 }}>
          <Feather name="refresh-cw" size={24} color={colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  async function fetchFilterPreference() {
    try {
      const preference = await getFilterPreference();

      if (user.gender === 'F' && preference.same_gender) {
        setMinimumParticipants(preference.minimum_participants);
        setDefaultMinimumParts(preference.minimum_participants);
      }

      setSameGender(preference.same_gender);
      setSelectedPrayers(preference.selected_prayers);
    }
    catch (e) {
      console.log(e);
    }
  }

  function resetFilter() {
    setSelectedPrayers(prayerTypes);
    setMinimumParticipants(minNum);
    setDefaultMinimumParts(minNum);
    setSameGender(false);
    setSelectedSort('distance');
  }

  async function applyFilter() {
    setIsLoading(true);

    await updateFilterPreference({
      selected_prayers: selectedPrayers,
      minimum_participants: minimumParticipants,
      same_gender: sameGender
    });

    await AsyncStorage.setItem('prayersFilter', JSON.stringify({ sortBy: selectedSort }));
    dispatch(setSortBy(selectedSort));
    setIsLoading(false);

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
      {isLoading && <Loader />}
      <View style={{ paddingVertical: 20, height: '100%', width: '100%' }}>
        <View style={styles.detailSection}>
          <BoldText style={[styles.sectionHeader, { marginBottom: 5 }]}>{t('SORTBY')}</BoldText>
          <ScrollView
            style={{ width: '100%', paddingTop: 5, paddingLeft: 25 }}
            contentContainerStyle={{ paddingRight: 45 }}
            horizontal={true}
          >
            <RoundButton
              onPress={() => setSelectedSort('distance')}
              style={styles.btnStyle}
              backgroundColor={selectedSort === 'distance' ? colors.primary : '#fff'}
              textStyle={{ textTransform: 'capitalize', color: selectedSort === 'distance' ? '#fff' : '#dedede' }}
            >
              {t('DISTANCE')}
            </RoundButton>
            <RoundButton
              onPress={() => setSelectedSort('participants')}
              style={styles.btnStyle}
              backgroundColor={selectedSort === 'participants' ? colors.primary : '#fff'}
              textStyle={{ textTransform: 'capitalize', color: selectedSort === 'participants' ? '#fff' : '#dedede' }}
            >
              {t('PARTICIPANTS')}
            </RoundButton>
            <RoundButton
              onPress={() => setSelectedSort('time')}
              style={styles.btnStyle}
              backgroundColor={selectedSort === 'time' ? colors.primary : '#fff'}
              textStyle={{ textTransform: 'capitalize', color: selectedSort === 'time' ? '#fff' : '#dedede' }}
            >
              {t('TIME')}
            </RoundButton>
          </ScrollView>
        </View>
        <View style={styles.detailSection}>
          <BoldText style={[styles.sectionHeader, { marginBottom: 5 }]}>{t('PRAYERS')}</BoldText>
          <FlatList
            style={{ width: '100%', paddingTop: 5, paddingLeft: 25 }}
            contentContainerStyle={{ paddingRight: 45 }}
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
                backgroundColor={selectedPrayers.includes(item) ? colors.primary : '#fff'}
                textStyle={{ textTransform: 'capitalize', color: selectedPrayers.includes(item) ? '#fff' : '#dedede' }}
              >
                {PRAYERS[item]}
              </RoundButton>
            )}
            keyExtractor={item => item}
          />
        </View>

        {user.gender === 'F' && (
          <View style={styles.detailSection}>
            <View>
              <BoldText style={styles.sectionHeader}>{t('MIN_PARTICIPANTS')}{`(>= ${minimumParticipants} ${minimumParticipants > 1 ? t('PEOPLE') : t('PERSON')})`}</BoldText>
              <Slider
                style={{ width: '100%', height: 40, marginTop: 15, marginLeft: 25 }}
                minimumValue={minNum}
                value={defaultMinimumParts}
                onValueChange={setMinimumParticipants}
                step={1}
                maximumValue={30}
                minimumTrackTintColor="#000"
                maximumTrackTintColor="#fff"
              />
            </View>
          </View>
        )}

        {user.gender === 'F' && (
          <View style={[styles.detailSection, { flexDirection: 'row', justifyContent: 'space-between', paddingRight: 25 }]}>
            <View style={{ width: '60%' }}>
              <BoldText style={styles.sectionHeader}>{t('SAME_GENDER')}</BoldText>
              <Text style={styles.sectionSubHeader}>{t('CHECKBOX_DESC')}</Text>
            </View>
            <View>
              <CheckBox checked={sameGender} onPress={() => setSameGender(prev => !prev)} color={colors.primary} />
            </View>
          </View>
        )}

        <View style={{ marginTop: 20, paddingHorizontal: 25 }}>
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
  btnStyle: {
    width: null,
    minWidth: 80,
    paddingHorizontal: 20,
    height: 40,
    marginBottom: 15,
    marginRight: 10,
    borderRadius: 20
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#ddd'
  },
  detailSection: {
    paddingVertical: 15,
  },
  sectionHeader: {
    paddingLeft: 25,
    fontSize: 14,
    marginBottom: 10,
    color: '#7C7C7C'
  },
  sectionSubHeader: {
    fontSize: 12,
    color: '#7C7C7C',
    paddingLeft: 25
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