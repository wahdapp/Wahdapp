import React from 'react';
import { Text as DefaultText, Animated } from 'react-native';

export function Text(props) {
  return (
    <DefaultText {...props} style={[props.style, { fontFamily: 'Sen' }]} />
  );
}

export function BoldText(props) {
  return (
    <DefaultText {...props} style={[props.style, { fontFamily: 'Sen-Bold' }]} />
  );
}

export function AnimatedText(props) {
  return (
    <Animated.Text {...props} style={[props.style, { fontFamily: 'Sen' }]} />
  );
}

export function AnimatedBoldText(props) {
  return (
    <Animated.Text {...props} style={[props.style, { fontFamily: 'Sen-Bold' }]} />
  );
}