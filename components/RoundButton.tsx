import React from 'react';
import { StyleSheet } from 'react-native';
import Touchable from './Touchable';
import { Text } from './Text';
import colors from '@/constants/colors';
import { View } from 'react-native';

export default function RoundButton({
  children,
  style = {},
  width = '100%',
  height = 52,
  backgroundColor = colors.primary,
  textStyle = {},
  touchableStyle = {},
  ...props
}) {
  return (
    <Touchable {...props} style={{ ...styles.touchableStyle, ...touchableStyle }}>
      <View
        style={{
          ...styles.button,
          width,
          height,
          borderRadius: height / 2,
          ...style,
          backgroundColor,
        }}
      >
        <Text style={{ ...styles.text, ...textStyle }}>{children}</Text>
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  touchableStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.secondary,
  },
  text: {
    fontSize: 14,
    letterSpacing: 1.8,
    color: '#ffffff',
  },
});
