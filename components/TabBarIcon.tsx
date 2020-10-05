import React from 'react';
import { Feather } from '@expo/vector-icons';

import colors from '../constants/colors';

type Props = {
  focused: boolean;
  name: string;
};

export default function TabBarIcon(props: Props) {
  return (
    <Feather
      name={props.name}
      size={24}
      style={{ marginBottom: -3 }}
      color={props.focused ? colors.primary : colors.tabIconDefault}
    />
  );
}
