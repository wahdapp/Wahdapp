import React, { useState, useEffect, useContext, Dispatch, SetStateAction } from 'react';
import SnackBar from 'react-native-snackbar-component';
import { useTranslation } from 'react-i18next';
import colors from '@/constants/colors';

export const SnackbarContext = React.createContext(
  {} as [string, Dispatch<SetStateAction<string>>]
);

export const SnackbarProvider: React.FC = ({ children }) => {
  const { t } = useTranslation(['SIGN']);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (errorMessage.length) {
      setTimeout(
        () => {
          setErrorMessage('');
        },
        errorMessage.length > 30 ? 5000 : 3000
      );
    }
  }, [errorMessage]);

  return (
    <SnackbarContext.Provider value={[errorMessage, setErrorMessage]}>
      <SnackBar
        visible={!!errorMessage?.length}
        textMessage={errorMessage}
        backgroundColor={colors.error}
        actionText={t('ERROR.3')}
        actionHandler={() => setErrorMessage('')}
        accentColor="#fff"
      />
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
