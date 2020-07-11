import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default function Touchable(props) {
  if (Platform.OS === 'android') {
    return <TouchableNativeFeedback {...props} />
  }
  return <TouchableWithoutFeedback {...props} />
}