import { useSelector } from 'react-redux';
import { RootState } from '@/types';

export const useUserInfo = () => useSelector((state: RootState) => state.userState);
export const useLocation = () => useSelector((state: RootState) => state.locationState);
export const useFilter = () => useSelector((state: RootState) => state.filterState);
export const useNotification = () => useSelector((state: RootState) => state.notificationState);
