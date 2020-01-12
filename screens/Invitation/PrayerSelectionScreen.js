import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { setPrayer } from '../../actions';
//import { fardhs, specials, fardhsArabic } from '../../constants/prayers';

const fardhs = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha", "Jumuah"];
const others = ["Janaazah", "Taraweeh"];

const othersArabic = ["جنازة", "تراويح"]
const fardhsArabic = ["فجر", "ظهر", "عصر", "مغرب", "عشاء", "جمعة"];

export default function PrayerSelectionScreen({ navigation }) {
  const { prayer } = useSelector(state => state.invitationState);
  const dispatch = useDispatch();

  const [selectedPrayer, setSelectedPrayer] = useState(prayer ? prayer : "Fajr");

  function confirm() {
    dispatch(setPrayer(selectedPrayer));
    navigation.goBack();
  }

  return (
    <Container>
      <Header style={{ paddingTop: 0 }}>
        <Left>
          <Button style={{ padding: 0 }} hasText onPress={() => navigation.goBack()} transparent>
            <Text>Back</Text>
          </Button>
        </Left>
        <Body>
          <Title>Prayer</Title>
        </Body>
        <Right>
          <Button style={{ padding: 0 }} hasText onPress={confirm} transparent>
            <Text>Next</Text>
          </Button>
        </Right>
      </Header>
      <Tabs>
        <Tab heading="Compulsory">
          {fardhs.map((fardh, i) => (
            <ListItem key={i} onPress={() => setSelectedPrayer(fardh)}>
              <Left>
                <Text>{fardh} {fardhsArabic[i]}</Text>
              </Left>
              <Right>
                <Radio onPress={() => setSelectedPrayer(fardh)} selected={selectedPrayer === fardh} />
              </Right>
            </ListItem>
          ))}
        </Tab>
        <Tab heading="Others">
          {others.map((other, i) => (
            <ListItem key={i} onPress={() => setSelectedPrayer(other)}>
              <Left>
                <Text>{other} {othersArabic[i]}</Text>
              </Left>
              <Right>
                <Radio onPress={() => setSelectedPrayer(other)} selected={selectedPrayer === other} />
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