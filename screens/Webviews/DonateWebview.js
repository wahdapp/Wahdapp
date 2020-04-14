import React from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';

export default function Donate() {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'https://www.paypal.me/abdullahcheng'}}
        style={{ flex: 1 }}
      />
    </View>
  )
}