import React, { useState } from 'react';
import { Platform } from 'react-native';
import {
  Container,
  Header,
  ListItem,
  Text,
  Radio,
  Right,
  Left,
  Tab,
  Tabs,
  Body,
  Button,
  Title
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

const fardhs = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const specials = ["Jumuah", "Janaazah", "Taraweeh", "Nafila"]

export default function PrayerSelectionScreen({ navigation }) {
  const [fardhPrayer, setFardhPrayer] = useState("Fajr");
  const [specialPrayer, setSpecialPrayer] = useState("Jumuah");

  function confirm() {
    const { submit } = navigation.state.params;
    submit(fardhPrayer);
    navigation.goBack();
  }

  return (
    <Container>
      <Header>
        <Left>
          <Button onPress={() => navigation.goBack()} transparent>
            <Ionicons name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'} size={24} color="#fff" />
          </Button>
        </Left>
        <Body>
          <Title>Choose Prayer</Title>
        </Body>
        <Right>
          <Button onPress={confirm} transparent>
            <Ionicons name={Platform.OS === 'ios' ? `ios-checkmark` : 'md-checkmark'} size={24} color="#fff" />
          </Button>
        </Right>
      </Header>
      <Tabs>
        <Tab heading="Compulsory">
          {fardhs.map((fardh, i) => (
            <ListItem key={i} onPress={() => setFardhPrayer(fardh)} selected={fardhPrayer === fardh}>
              <Left>
                <Text>{fardh}</Text>
              </Left>
              <Right>
                <Radio onPress={() => setFardhPrayer(fardh)} selected={fardhPrayer === fardh} />
              </Right>
            </ListItem>
          ))}
        </Tab>
        <Tab heading="Special">
          {specials.map((special, i) => (
            <ListItem key={i} onPress={() => setSpecialPrayer(special)}>
              <Left>
                <Text>{special}</Text>
              </Left>
              <Right>
                <Radio onPress={() => setSpecialPrayer(special)} selected={specialPrayer === special} />
              </Right>
            </ListItem>
          ))}
        </Tab>
      </Tabs>
    </Container>
  );
}

PrayerSelectionScreen.navigationOptions = {
  header: null
}

// PrayerSelectionScreen.navigationOptions = ({ navigation }) => {
//   const { submit } = navigation.state.params;

//   function handleSubmit() {
//     const { prayer } = navigation.state.params;
//     submit(prayer);
//     navigation.goBack();
//   }

//   return {
//     title: 'Choose prayer',
//     headerRight: (
//       <TouchableOpacity onPress={handleSubmit} style={{ marginRight: 20 }}>
//         <Ionicons name={Platform.OS === 'ios' ? `ios-checkmark` : 'md-checkmark'} size={30} color="#000" />
//       </TouchableOpacity>
//     )
//   }
// };