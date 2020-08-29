import React, { useState, useEffect } from 'react';
import SnackBar from 'react-native-snackbar-component';
import colors from 'constants/Colors';
import { useTranslation } from 'react-i18next';

export const SnackbarContext = React.createContext({});

export function SnackbarProvider(props) {
  const { t } = useTranslation(['SIGN']);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (errorMessage.length) {
      setTimeout(() => {
        setErrorMessage('');
      }, errorMessage.length > 30 ? 5000 : 3000)
    }
  }, [errorMessage]);

  return (
    <SnackbarContext.Provider value={{ errorMessage, setErrorMessage }}>
      <SnackBar
        visible={!!errorMessage.length}
        textMessage={errorMessage}
        backgroundColor={colors.error}
        actionText={t('ERROR.3')}
        actionHandler={() => setErrorMessage('')}
        accentColor="#fff"
      />
      {props.children}
    </SnackbarContext.Provider>
  )
}