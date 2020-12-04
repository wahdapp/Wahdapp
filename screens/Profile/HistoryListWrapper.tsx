import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Image } from 'react-native';
import { PrayerCard, SkeletonCard, Text } from '@/components';
import { NOT_FOUND } from '@/assets/images';
import { useTranslation } from 'react-i18next';
import { auth } from '@/firebase';
import { getInvitedList, getParticipatedList } from '@/services/prayer';
import { Prayer, RootStackParamList } from '@/types';
import { StackNavigationProp } from '@react-navigation/stack';

const PAGE_SIZE = 5;

type InvitedScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Invited'>;

type Props = {
  navigation: InvitedScreenNavigationProp;
};

function HistoryListWrapper(type: 'invited' | 'participated') {
  return function InvitedScreen({ navigation }: Props) {
    const { t } = useTranslation(['PROFILE']);
    const [list, setList] = useState<Prayer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
      fetchList();
    }, []);

    async function fetchList(refresh = false) {
      try {
        let prayersList: Prayer[];
        if (type === 'invited') {
          prayersList = await getInvitedList(auth.currentUser.uid, currentPage);
        } else {
          prayersList = await getParticipatedList(auth.currentUser.uid, currentPage);
        }

        // Stop fetching more
        if (prayersList.length < PAGE_SIZE) {
          setHasMore(false);
        }
        // if scrolling to the end
        else {
          setHasMore(true);
        }

        if (refresh) {
          setList(prayersList);
          setCurrentPage(1);
        } else {
          setList((prev) => [...prev, ...prayersList]);
          setCurrentPage((prev) => prev + 1);
        }
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#eee' }}>
        <View style={styles.prayerListWrapper}>
          {isLoading ? (
            <View style={{ paddingTop: 25, paddingHorizontal: 25 }}>
              <SkeletonCard />
            </View>
          ) : (
            <FlatList
              style={{ height: '100%', paddingTop: 25 }}
              data={list}
              renderItem={({ item }) => <PrayerCard {...item} navigate={navigation.navigate} />}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={() => (
                <View style={styles.imageContainer}>
                  <Image source={NOT_FOUND} style={styles.image} />
                  <Text style={styles.notFoundText}>{t('EMPTY')}</Text>
                </View>
              )}
              onRefresh={() => {
                setIsRefreshing(true);
                fetchList(true).then(() => setIsRefreshing(false));
              }}
              refreshing={isRefreshing}
              ListFooterComponent={() =>
                hasMore ? (
                  <View style={{ paddingVertical: 15, paddingHorizontal: 25 }}>
                    <SkeletonCard />
                  </View>
                ) : null
              }
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                if (hasMore) {
                  fetchList();
                }
              }}
            />
          )}
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  prayerListWrapper: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
    height: '100%',
  },
  imageContainer: {
    width: '100%',
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

export default HistoryListWrapper;
