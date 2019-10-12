import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';

export default function HomeScreen() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  let bs = React.createRef();

  function handleLongPress(coords) {
    const { coordinate } = coords.nativeEvent;
    setSelectedLocation(coordinate);
    bs.current.snapTo(0);
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  )

  const renderContent = () => (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Confirm Prayer Information</Text>
    </View>
  )

  return (
    <>
      <MapView
        style={{ flex: 1 }}
        showsUserLocation={true}
        onLongPress={handleLongPress}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>
      <BottomSheet
        ref={bs}
        snapPoints={[400, 250, 0]}
        renderContent={renderContent}
        renderHeader={renderHeader}
        initialSnap={2}
        onCloseEnd={() => setSelectedLocation(null)}
      />
    </>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  panel: {
    height: 600,
    padding: 20,
    backgroundColor: '#f7f5eee8',
  },
  header: {
    backgroundColor: '#f7f5eee8',
    shadowColor: '#000000',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
})
