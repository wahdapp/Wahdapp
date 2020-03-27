import React from 'react';
import { Text as DefaultText } from 'react-native';

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