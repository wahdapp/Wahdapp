import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Touchable from './Touchable';
import Colors from 'constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function RoundButton({
  children,
  style = {},
  width = '100%',
  height = 52,
  colors = [Colors.primary, Colors.secondary],
  textStyle = {},
  ...props
}) {
  return (
    <Touchable {...props}>
      <LinearGradient
        style={{ ...styles.button, width, height, borderRadius: height / 2, ...style }}
        colors={colors}
        start={[0, 1]}
        end={[1, 0]}
      >
        <Text style={{ ...styles.text, ...textStyle }}>{children}</Text>
      </LinearGradient>
    </Touchable>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    letterSpacing: 1.8,
    color: '#ffffff'
  }
})