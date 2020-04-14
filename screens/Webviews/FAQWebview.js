import React from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import i18n from 'i18next';

export default function FAQ() {
  let subpath = '';
  switch(i18n.language) {
    case 'zh_hant':
      subpath = '/tw';
      break;
    case 'zh_hans':
      subpath = '/cn';
      break;
    default: subpath = '';
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: `https://wahd.app${subpath}/faq` }}
        style={{ flex: 1 }}
      />
    </View>
  )
}