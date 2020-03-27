import React from 'react';
import { Text } from 'react-native';

export default (props) => {
  return (
    <Text {...props} style={[props.style, { fontFamily: 'Sen' }]} />
  );
}

export function BoldText(props) {
  return (
    <Text {...props} style={[props.style, { fontFamily: 'Sen-Bold' }]} />
  );
}