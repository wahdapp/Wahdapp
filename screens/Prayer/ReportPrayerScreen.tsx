import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TextInput } from 'react-native';
import { useSnackbar } from '@/contexts/snackbar';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { RoundButton, Text, Loader } from '@/components';
import { reportPrayer } from '@/services/prayer';
import colors from '@/constants/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types';
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

type ReportPrayerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ReportPrayer'>;

type ReportPrayerScreenRouteProp = RouteProp<RootStackParamList, 'ReportPrayer'>;

type Props = {
  route: ReportPrayerScreenRouteProp;
  navigation: ReportPrayerScreenNavigationProp;
};

function ReportPrayerScreen({ route, navigation }: Props) {
  const { prayerID } = route.params;
  const { t } = useTranslation(['REPORT']);
  const [, setErrorMessage] = useSnackbar();

  const [category, setCategory] = useState(0);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { label: t('CATEGORY.0'), value: 0 },
    { label: t('CATEGORY.1'), value: 1 },
    { label: t('CATEGORY.2'), value: 2 },
    { label: t('CATEGORY.3'), value: 3 },
  ];

  async function submit() {
    try {
      setIsLoading(true);
      await reportPrayer(prayerID, category, description);

      setIsLoading(false);
      navigation.goBack();
    } catch (e) {
      setIsLoading(false);
      setErrorMessage(t('ERROR'));
    }
  }

  return (
    <View style={styles.centeredView}>
      {isLoading && <Loader />}
      <ScrollView
        contentContainerStyle={{
          width: '100%',
        }}
      >
        <Text style={styles.modalText}>{t('TITLE')}</Text>
        <Text style={styles.description}>{t('DESC')}</Text>

        <View style={styles.radioWrapper}>
          <RadioForm initial={0} animation={true}>
            {categories.map((obj, i) => (
              <RadioButton labelHorizontal={true} key={i}>
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
            ))}
          </RadioForm>
        </View>

        <TextInput
          multiline={true}
          numberOfLines={6}
          onChangeText={setDescription}
          value={description}
          style={styles.textArea}
          placeholderTextColor="#dedede"
          placeholder={t('PLACEHOLDER')}
        />
      </ScrollView>

      <View style={styles.buttonWrapper}>
        <RoundButton
          onPress={submit}
          touchableStyle={{ flexDirection: 'row', justifyContent: 'center' }}
        >
          {t('SUBMIT')}
        </RoundButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 25,
  },
  modalText: {
    paddingTop: 35,
    marginBottom: 10,
    textAlign: 'left',
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'left',
    color: '#7c7c7c',
    fontSize: 12,
  },
  radioWrapper: {
    marginTop: 25,
    paddingRight: 15,
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
    bottom: 25,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReportPrayerScreen;
