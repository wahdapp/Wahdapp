import React from 'react';
import Webview from 'react-native-webview';
import { LoaderWithoutOverlay } from 'components';
import { View } from 'react-native';

export default function QiblaScreen() {

  return (
    <View style={{ flex: 1 }}>
      <Webview
        startInLoadingState={true}
        renderLoading={() => (
          <View style={{ flex: 1 }}>
            <LoaderWithoutOverlay size="large" />
          </View>
        )}
        source={{ uri: 'https://g.co/qiblafinder' }}
      />
    </View>
  )
}