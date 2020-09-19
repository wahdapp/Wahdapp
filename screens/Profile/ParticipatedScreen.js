import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Image } from 'react-native';
import { PrayerCard, SkeletonCard, Text } from 'components';
import { NOT_FOUND } from 'assets/images';
import { useTranslation } from 'react-i18next';
import { auth } from 'firebaseDB';
import { getParticipatedList } from 'services/prayer';

export default function InvitedScreen({ navigation, route }) {
  const { t } = useTranslation(['PROFILE']);
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    const res = await getParticipatedList(auth.currentUser.uid);
    setList(res);
    setIsLoading(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#eee' }}>
      <View style={styles.prayerListWrapper}>
        {isLoading
          ? <View style={{ paddingTop: 25, paddingHorizontal: 25 }}><SkeletonCard /></View>
          :
          <FlatList
            style={{ height: '100%', paddingTop: 25 }}
            data={list}
            renderItem={({ item }) => <PrayerCard {...item} navigate={navigation.navigate} />}
            keyExtractor={item => item.id}
            ListEmptyComponent={() => (
              <View style={styles.imageContainer}>
                <Image source={NOT_FOUND} style={styles.image} />
                <Text style={styles.notFoundText}>{t('EMPTY')}</Text>
              </View>
            )}
          />
        }
      </View>
    </View >
  )
}

const styles = StyleSheet.create({
  prayerListWrapper: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
    height: '100%'
  },
  imageContainer: {
    width: '100%',
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
    height: 250
  },
  notFoundText: {
    textAlign: 'center',
    color: '#7C7C7C',
    fontSize: 18,
  },
})