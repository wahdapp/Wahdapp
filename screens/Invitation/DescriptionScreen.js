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
  Content,
  Text
} from 'native-base';
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
          <Button hasText onPress={() => navigation.goBack()} transparent>
            <Text>Back</Text>
          </Button>
        </Left>
        <Body>
          <Title>Description</Title>
        </Body>
        <Right>
          <Button hasText onPress={confirm} transparent>
            <Text>Next</Text>
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