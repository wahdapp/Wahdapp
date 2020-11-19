import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet, FlatList, TouchableOpacity, Platform, Image, View } from 'react-native';
import { PrayerCard, SkeletonCard, Text, BoldText } from '@/components';
import { Feather } from '@expo/vector-icons';
import isEmpty from 'lodash/isEmpty';
import { queryFeed } from '@/services/prayer';
import { NOT_FOUND } from '@/assets/images';
import { useTranslation } from 'react-i18next';
import colors from '@/constants/colors';
import { setNotificationRedirect } from '@/actions';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types';
import { useFilter, useLocation, useNotification } from '@/hooks/redux';

const PAGE_SIZE = 10;

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const { t } = useTranslation(['HOME']);
  const location = useLocation();
  const filter = useFilter();
  const dispatch = useDispatch();

  const [nearbyPrayers, setNearbyPrayers] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { redirect } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (redirect) {
      navigation.navigate(redirect);
      dispatch(setNotificationRedirect(''));
    }
  }, [redirect]);

  useEffect(() => {
    query();
  }, [filter, location]);

  async function query() {
    if (!isEmpty(location)) {
      setIsRefreshing(true);
      // fetch nearby prayers according to filter preference
      await fetchNearbyPrayers(true);

      setIsFetching(false);
      setIsRefreshing(false);
    }
  }

  async function fetchNearbyPrayers(refresh = false) {
    try {
      const list = await queryFeed({
        lng: location.longitude,
        lat: location.latitude,
        pageSize: PAGE_SIZE,
        pageNumber: refresh ? 1 : currentPage,
        sortType: filter.sortBy,
      });

      console.log({ list });

      // Stop fetching more
      if (list.length < PAGE_SIZE) {
        setHasMore(false);
      }
      // if scrolling to the end
      else if (!refresh) {
        setHasMore(true);
        setCurrentPage((prev) => prev + 1);
      }
      // if refreshing or modified filter preference
      else {
        setHasMore(true);
      }

      if (refresh) {
        setNearbyPrayers(list);
        setCurrentPage(1);
      } else {
        setNearbyPrayers((prev) => [...prev, ...list]);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BoldText style={styles.titleStyle}>{t('HEADER')}</BoldText>
        <TouchableOpacity style={{ marginRight: 25 }} onPress={() => navigation.navigate('Filter')}>
          <Feather name="sliders" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={{ ...styles.prayerListWrapper, height: nearbyPrayers.length ? null : '100%' }}>
        {isFetching ? (
          <View style={{ paddingVertical: 15, paddingHorizontal: 25 }}>
            <SkeletonCard />
          </View>
        ) : (
          <FlatList
            style={{ height: '100%' }}
            contentContainerStyle={{ paddingBottom: 60 }}
            data={nearbyPrayers}
            renderItem={({ item }) => (
              <PrayerCard {...item} navigate={navigation.navigate} query={query} />
            )}
            keyExtractor={(item) => item.id}
            onRefresh={() => {
              setIsRefreshing(true);
              fetchNearbyPrayers(true).then(() => setIsRefreshing(false));
            }}
            refreshing={isRefreshing}
            ListEmptyComponent={() => (
              <View style={{ padding: 15 }}>
                <View style={styles.imageContainer}>
                  <Image source={NOT_FOUND} style={styles.image} />
                  <Text style={styles.notFoundText}>{t('EMPTY')}</Text>
                </View>
              </View>
            )}
            onEndReached={() => (hasMore ? fetchNearbyPrayers : null)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 24,
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  header: {
    marginVertical: 10,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleStyle: {
    fontSize: 20,
    color: colors.primary,
    marginLeft: 25,
  },
  prayerListWrapper: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  imageContainer: {
    borderRadius: 25,
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 25,
    paddingHorizontal: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
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
  },
});
