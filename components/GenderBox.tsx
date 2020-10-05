import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Touchable, Text } from '@/components';
import { MAN_AVATAR, WOMAN_AVATAR } from '@/assets/images';
import colors from '@/constants/colors';

type Props = {
  isSelected: boolean;
  onPress: () => void;
  gender: string;
  label: string;
};

const GenderBox = ({ isSelected, onPress, gender, label }: Props) => {
  return (
    <Touchable onPress={onPress}>
      <View
        style={{
          ...styles.container,
          borderColor: colors.primary,
          borderWidth: isSelected ? 3 : 0,
        }}
      >
        <View style={styles.circle}>
          <Image
            source={gender === 'M' ? MAN_AVATAR : WOMAN_AVATAR}
            style={{ width: 50, height: 50 }}
          />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // elevation: 5,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: '#444',
  },
});

export default React.memo(GenderBox);
