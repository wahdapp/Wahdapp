import React from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';

export default function About() {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'https://wahd.app/about' }}
        style={{ flex: 1 }}
      />
    </View>
  )
}