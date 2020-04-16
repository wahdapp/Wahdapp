import React from 'react';
import { View } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import LottieView from 'lottie-react-native';

export function Loader({ width, height }) {
  return (
    <AnimatedLoader
      visible={true}
      overlayColor="rgba(255,255,255,0.75)"
      source={require('assets/ripples.json')}
      animationStyle={{ width, height }}
      speed={2}
    />
  )
}

Loader.defaultProps = {
  width: 100,
  height: 100
}

export function Spinner({ size }) {
  let width, height;

  if (size === 'small') {
    width = height = 20;
  }
  else {
    width = height = 45;
  }

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <LottieView
        source={require('assets/spinner.json')}
        autoPlay
        loop
        style={{ width, height }}
      />
    </View>
  )
}

Spinner.defaultProps = {
  size: 'small'
}