import { Prayer, User } from '@/types';
import findIndex from 'lodash/findIndex';

type State = {
  feed: Prayer[];
  map: Prayer[];
};

const INITIAL_STATE = {
  feed: [],
  map: [],
};

type Actions =
  | { type: 'SET_FEED'; payload: Prayer[] }
  | { type: 'ADD_TO_FEED'; payload: Prayer[] }
  | { type: 'JOIN_PRAYER'; payload: { prayerID: string; userID: string; user: User } }
  | { type: 'CANCEL_PRAYER'; payload: { prayerID: string; userID: string } }
  | { type: 'SET_MAP'; payload: Prayer[] };

function prayersReducer(state: State = INITIAL_STATE, action: Actions) {
  console.log({ action });
  let feedIndex: number;
  let mapIndex: number;
  let newFeed;
  let newMap;
  switch (action.type) {
    case 'SET_FEED':
      return { ...state, feed: action.payload };
    case 'SET_MAP':
      return { ...state, map: action.payload };
    case 'ADD_TO_FEED':
      return { ...state, feed: [...state.feed, action.payload] };
    case 'JOIN_PRAYER':
      feedIndex = findIndex(state.feed, { id: action.payload.prayerID });
      mapIndex = findIndex(state.map, { id: action.payload.prayerID });

      newFeed = [...state.feed];
      newMap = [...state.map];

      if (feedIndex !== -1) {
        newFeed.splice(feedIndex, 1, {
          ...state[feedIndex],
          participants: [newFeed[feedIndex].participants, action.payload.user],
        });
      }
      if (mapIndex !== -1) {
        newMap.splice(mapIndex, 1, {
          ...state[mapIndex],
          participants: [newMap[mapIndex].participants, action.payload.user],
        });
      }
      return {
        feed: newFeed,
        map: newMap,
      };
    case 'CANCEL_PRAYER':
      feedIndex = findIndex(state.feed, { id: action.payload.prayerID });
      mapIndex = findIndex(state.map, { id: action.payload.prayerID });

      newFeed = [...state.feed];
      newMap = [...state.map];

      if (feedIndex !== -1) {
        newFeed.splice(feedIndex, 1, {
          ...state[feedIndex],
          participants: state.feed[feedIndex].participants.filter(
            (p) => p.id !== action.payload.userID
          ),
        });
      }
      if (mapIndex !== -1) {
        newMap.splice(mapIndex, 1, {
          ...state[mapIndex],
          participants: state.map[mapIndex].participants.filter(
            (p) => p.id !== action.payload.userID
          ),
        });
      }
      return {
        feed: newFeed,
        map: newMap,
      };
    default:
      return state;
  }
}

export default prayersReducer;
