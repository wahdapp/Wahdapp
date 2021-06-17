import { useEffect } from 'react';
import { setCurrentScreen } from 'expo-firebase-analytics';

function useLogScreenView(screen: string) {
  useEffect(() => {
    (async () => {
      try {
        await setCurrentScreen(screen);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
}

export default useLogScreenView;
