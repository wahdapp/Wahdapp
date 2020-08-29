import React from 'react';
import { Feather } from '@expo/vector-icons';

import Colors from '../constants/Colors';

export default function TabBarIcon(props) {
  return (
    <Feather
      name={props.name}
      size={24}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.primary : Colors.tabIconDefault}
    />
  );
}
