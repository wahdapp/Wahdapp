import React from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';

export default function Contact() {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'https://go.crisp.chat/chat/embed/?website_id=14a4d06e-1b79-4893-9c81-2ab040bb00a0' }}
        style={{ flex: 1 }}
      />
    </View>
  )
}