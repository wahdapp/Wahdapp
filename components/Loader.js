import React from 'react';
import { View } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import LottieView from 'lottie-react-native';
import { Text } from './Text';
import colors from 'constants/Colors';

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
  width: 70,
  height: 70
}

export function LoaderWithoutOverlay({ size = 'small', text = '' }) {
  let width, height;

  if (size === 'small') {
    width = height = 25;
  }
  else {
    width = height = 50;
  }

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <LottieView
        source={require('assets/ripples.json')}
        autoPlay
        loop
        style={{ width, height }}
        speed={2}
      />
      {text ? <Text style={{ marginTop: 20, color: colors.primary, fontSize: 12 }}>{text}</Text> : null}
    </View>
  )
}

export function Spinner({ size, type = 'default' }) {
  let spinnerFile = require('assets/spinner.json');
  if (type === 'white') {
    spinnerFile = require('assets/white_spinner.json');
  }
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
        source={spinnerFile}
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