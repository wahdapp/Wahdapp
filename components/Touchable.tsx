import React from 'react';
import {
  Platform,
  TouchableNativeFeedbackProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

const Touchable: React.FC<TouchableNativeFeedbackProps | TouchableOpacityProps> = (props) => {
  if (Platform.OS === 'android') {
    return <TouchableNativeFeedback {...props} />;
  }
  return <TouchableOpacity {...props} />;
};

export default Touchable;
