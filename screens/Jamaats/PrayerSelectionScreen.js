import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Ionicons } from '@expo/vector-icons';

export default function PrayerSelectionScreen({ navigation }) {
  const [prayer, setPrayer] = useState("Fajr");

  useEffect(() => {
    navigation.setParams({
      prayer
    })
  }, [prayer])

  return (
    <ScrollView style={styles.container}>
      {/**
       * Go ahead and delete ExpoLinksView and replace it with your content;
       * we just wanted to provide you with some helpful links.
       */}
      <ExpoLinksView />
    </ScrollView>
  );
}

PrayerSelectionScreen.navigationOptions = ({ navigation }) => {
  const { submit } = navigation.state.params;

  function handleSubmit() {
    const { prayer } = navigation.state.params;
    submit(prayer);
    navigation.goBack();
  }
  
  return {
    title: 'Choose prayer',
    headerRight: (
      <TouchableOpacity onPress={handleSubmit} style={{ marginRight: 20 }}>
        <Ionicons name={Platform.OS === 'ios' ? `ios-checkmark` : 'md-checkmark'} size={30} color="#000" />
      </TouchableOpacity>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
