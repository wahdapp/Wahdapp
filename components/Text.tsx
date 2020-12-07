import React from 'react';
import { Text as DefaultText, Animated, TextProps } from 'react-native';

export const Text: React.FC<TextProps> = (props) => {
  return <DefaultText {...props} style={[props.style, { fontFamily: 'Sen' }]} />;
};

export const BoldText: React.FC<TextProps> = (props) => {
  return <DefaultText {...props} style={[props.style, { fontFamily: 'SenBold' }]} />;
};

export const AnimatedText: React.FC<TextProps> = (props) => {
  return <Animated.Text {...props} style={[props.style, { fontFamily: 'Sen' }]} />;
};

export const AnimatedBoldText: React.FC<TextProps> = (props) => {
  return <Animated.Text {...props} style={[props.style, { fontFamily: 'SenBold' }]} />;
};
