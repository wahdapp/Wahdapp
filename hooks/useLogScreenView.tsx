import { useEffect } from 'react';
import { setCurrentScreen, logEvent as log } from 'expo-firebase-analytics';
import { getTrackingPermissionsAsync } from 'expo-tracking-transparency';

export async function logEvent(
  name: string,
  properties?: {
    [key: string]: any;
  }
) {
  const { granted } = await getTrackingPermissionsAsync();

  if (granted) {
    log(name, properties);
  }
}

function useLogScreenView(screen: string) {
  useEffect(() => {
    (async () => {
      try {
        const { granted } = await getTrackingPermissionsAsync();
        if (granted) {
          await setCurrentScreen(screen);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
}

export default useLogScreenView;
