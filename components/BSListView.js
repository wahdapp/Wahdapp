import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
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

const ListRow = ({ title, description, icon }) => (
  <TouchableOpacity style={styles.container}>
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

const BSListview = ({ itemList }) => (
  <View style={{ flex: 1 }}>
    <FlatList
      data={itemList}
      renderItem={({ item }) => <ListRow
        key={item.title}
        title={item.title}
        description={item.description}
        icon={item.icon}
      />}
    />

  </View>
);

export default BSListview;