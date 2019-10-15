import React, { useState } from 'react';
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
    fontSize: 12,
    fontStyle: 'italic',
  },
});
export function ListRow({ item, navigate }) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [icon, setIcon] = useState(item.icon);

  function handlePress() {
    navigate(item.nav, {
      submit: function(res) {
        setDescription(res);
      }
    })
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
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
  <View style={{ flex: 1 }}>
    <FlatList
      data={itemList}
      renderItem={({ item }) => <ListRow
        key={item.title}
        item={item}
        // title={item.title}
        // description={item.description}
        // icon={item.icon}
        navigate={navigate}
      />}
    />

  </View>
);

export default BSListview;