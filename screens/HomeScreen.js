import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';

export default function HomeScreen() {
  const [markers, setMarkers] = useState([]);
  function handleLongPress(coords) {
    const { coordinate } = coords.nativeEvent;
    setMarkers([coordinate]);
  }
  return (
    <MapView
      style={{ flex: 1 }}
      showsUserLocation={true}
      onLongPress={handleLongPress}
    >
      {markers.map((marker, i) => (
        <Marker coordinate={marker} key={i} />
      ))}
    </MapView>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};
