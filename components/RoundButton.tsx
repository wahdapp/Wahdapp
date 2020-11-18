import React from 'react';
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableNativeFeedbackProps,
  ViewStyle,
} from 'react-native';
import Touchable from './Touchable';
import { Text } from './Text';
import colors from '@/constants/colors';
import { View } from 'react-native';

type Props = TouchableNativeFeedbackProps & {
  style?: StyleProp<ViewStyle>;
  width?: React.ReactText;
  height?: number;
  backgroundColor?: ColorValue;
  textStyle?: StyleProp<TextStyle>;
  touchableStyle?: StyleProp<ViewStyle>;
};

const RoundButton: React.FC<Props> = ({
  children,
  style = {},
  width = '100%',
  height = 52,
  backgroundColor = colors.primary,
  textStyle = {},
  touchableStyle = {},
  ...props
}) => {
  return (
    <Touchable {...props} style={[styles.touchableStyle, touchableStyle]}>
      <View
        style={[
          {
            ...styles.button,
            width,
            height,
            borderRadius: height / 2,
            backgroundColor,
          },
          style,
        ]}
      >
        <Text style={[styles.text, textStyle]}>{children}</Text>
      </View>
    </Touchable>
  );
};

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

export default RoundButton;
