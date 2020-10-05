import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TextInput
} from 'react-native';
import { SnackbarContext } from '@/contexts/snackbar';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { RoundButton, Text, Loader } from '@/components';
import { reportPrayer } from '@/services/prayer';
import colors from '@/constants/colors';

const categories = [
  { label: 'This is a spam', value: 0 },
  { label: 'The information given is not true', value: 1 },
  { label: 'This contains threatening messages', value: 2 },
  { label: 'Other', value: 3 },
];

function ReportPrayerScreen({ route, navigation }) {
  const { prayerID } = route.params;

  const { setErrorMessage } = useContext(SnackbarContext);

  const [category, setCategory] = useState(0);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function submit() {
    try {
      setIsLoading(true);
      await reportPrayer(prayerID, category, description);

      setIsLoading(false);
      navigation.goBack();
    }
    catch (e) {
      setIsLoading(false);
      setErrorMessage('Something went wrong! Try again later');
    }
  }

  return (
    <View style={styles.centeredView}>
      {isLoading && <Loader />}
      <ScrollView contentContainerStyle={{ position: 'relative' }}>
        <Text style={styles.modalText}>Report a problem</Text>
        <Text style={styles.description}>Help us understand the issue with this prayer.</Text>

        <View style={styles.radioWrapper}>
          <RadioForm
            initial={0}
            animation={true}
          >
            {
              categories.map((obj, i) => (
                <RadioButton labelHorizontal={true} key={i} >
                  <RadioButtonInput
                    obj={obj}
                    index={i}
                    isSelected={category === i}
                    onPress={setCategory}
                    borderWidth={1}
                    buttonInnerColor={colors.primary}
                    buttonOuterColor="#ccc"
                    buttonSize={12}
                    buttonOuterSize={20}
                    buttonWrapStyle={{ paddingTop: 2 }}
                  />
                  <RadioButtonLabel
                    obj={obj}
                    index={i}
                    labelHorizontal={true}
                    onPress={setCategory}
                    labelStyle={{ fontSize: 12, fontFamily: 'Sen', color: '#000', lineHeight: 16 }}
                  />
                </RadioButton>
              ))
            }
          </RadioForm>
        </View>

        <TextInput
          multiline={true}
          numberOfLines={6}
          onChangeText={setDescription}
          value={description}
          style={styles.textArea}
          placeholderTextColor="#dedede"
          placeholder="Any extra information you would like to add"
        />
      </ScrollView>

      <View style={styles.buttonWrapper}>
        <RoundButton onPress={submit} touchableStyle={{ flexDirection: 'row', justifyContent: 'center' }}>
          Submit
        </RoundButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fff',
    position: 'relative'
  },
  modalText: {
    paddingTop: 35,
    marginBottom: 10,
    textAlign: 'left',
    fontSize: 24,
    fontWeight: 'bold'
  },
  description: {
    textAlign: 'left',
    color: '#7c7c7c',
    fontSize: 12
  },
  radioWrapper: {
    marginTop: 25,
    paddingRight: 15
  },
  textArea: {
    marginTop: 25,
    borderBottomWidth: 1,
    borderColor: '#dedede',
    fontFamily: 'Sen',
    paddingVertical: 10,
    paddingLeft: 0,
    textAlignVertical: 'top',
    height: 150,
    justifyContent: 'flex-start',
    fontSize: 12,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 25,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25
  }
});

export default ReportPrayerScreen;