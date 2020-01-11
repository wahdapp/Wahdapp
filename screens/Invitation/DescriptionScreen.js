import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform } from 'react-native';
import {
  Container,
  Header,
  Right,
  Left,
  Body,
  Form,
  Textarea,
  Button,
  Title,
  Content
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { setDescription } from '../../actions';

export default function DescriptionScreen({ navigation }) {
  const { description } = useSelector(state => state.invitationState);
  const dispatch = useDispatch();

  const [descriptionText, setDescriptionText] = useState(description);

  function confirm() {
    dispatch(setDescription(descriptionText));
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
          <Title>Description</Title>
        </Body>
        <Right>
          <Button onPress={confirm} transparent>
            <Ionicons name={Platform.OS === 'ios' ? `ios-checkmark` : 'md-checkmark'} size={24} color="#fff" />
          </Button>
        </Right>
      </Header>
      <Content padder>
        <Form>
          <Textarea rowSpan={5} bordered placeholder="Describe the necessary information..." value={descriptionText} onChangeText={setDescriptionText} />
        </Form>
      </Content>
    </Container>
  );
}

DescriptionScreen.navigationOptions = {
  header: null
}