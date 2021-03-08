import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { PrayerCard, SkeletonCard } from '@/components';
import { useTranslation } from 'react-i18next';
import { auth } from '@/firebase';
import { getInvitedList, getParticipatedList } from '@/services/prayer';
import { Prayer, RootStackParamList } from '@/types';
import { StackNavigationProp } from '@react-navigation/stack';
import useLogScreenView from '@/hooks/useLogScreenView';

const PAGE_SIZE = 5;

type InvitedScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Invited'>;

type Props = {
  navigation: InvitedScreenNavigationProp;
};

function HistoryListWrapper(type: 'invited' | 'participated') {
  return function InvitedScreen({ navigation }: Props) {
    useLogScreenView(type);
    const { t } = useTranslation(['PROFILE']);
    const [list, setList] = useState<Prayer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
      fetchList(true);
    }, []);

    async function fetchList(refresh = false) {
      try {
        let prayersList: Prayer[];
        if (type === 'invited') {
          prayersList = await getInvitedList(auth.currentUser.uid, refresh ? 0 : currentPage);
        } else {
          prayersList = await getParticipatedList(auth.currentUser.uid, refresh ? 0 : currentPage);
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
        console.log(e);
        setIsLoading(false);
        setHasMore(false);
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
});

export default HistoryListWrapper;
