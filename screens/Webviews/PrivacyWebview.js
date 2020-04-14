import React from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';

export default function Privacy() {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'https://wahd.app/privacy' }}
        style={{ flex: 1 }}
      />
    </View>
  )
}