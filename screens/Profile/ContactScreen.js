import React from 'react';
import Webview from 'react-native-webview';
import { LoaderWithoutOverlay } from '@/components';
import { View } from 'react-native';

export default function ContactScreen() {

  return (
    <View style={{ flex: 1 }}>
      <Webview
        startInLoadingState={true}
        renderLoading={() => (
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <LoaderWithoutOverlay size="large" />
          </View>
        )}
        source={{ uri: 'https://go.crisp.chat/chat/embed/?website_id=14a4d06e-1b79-4893-9c81-2ab040bb00a0' }}
      />
    </View>
  )
}