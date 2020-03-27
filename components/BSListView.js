import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  title: {
    fontSize: 16,
    color: '#000',
  },
  icon_container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    backgroundColor: "#25b864",
    borderRadius: 90,
  },
  container_text: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
  },
  description: {
    fontSize: 11,
    fontStyle: 'italic',
  },
});
export function ListRow({ item, navigate }) {
  const { title, icon, description } = item;

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigate(item.nav)}>
      <View style={styles.icon_container}>
        <Ionicons name={icon} size={30} color="#ffffff" />
      </View>
      <View style={styles.container_text}>
        <Text style={styles.title}>
          {title}
        </Text>
        <Text style={styles.description}>
          {description}
        </Text>
      </View>

    </TouchableOpacity>
  );
}

const BSListview = ({ itemList, navigate }) => (
    <FlatList
      data={itemList}
      scrollEnabled={false}
      renderItem={({ item }) => <ListRow
        key={item.title}
        item={item}
        navigate={navigate}
      />}
    />
);

export default BSListview;