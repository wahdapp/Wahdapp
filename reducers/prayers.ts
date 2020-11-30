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
  | { type: 'CANCEL_PRAYER'; payload: string }
  | { type: 'JOIN_PRAYER'; payload: { prayerID: string; userID: string; user: User } }
  | { type: 'LEAVE_PRAYER'; payload: { prayerID: string; userID: string } }
  | { type: 'SET_MAP'; payload: Prayer[] };

function prayersReducer(state: State = INITIAL_STATE, action: Actions) {
  let feedIndex: number;
  let mapIndex: number;
  let newFeed: Prayer[];
  let newMap: Prayer[];

  switch (action.type) {
    case 'SET_FEED':
      return { ...state, feed: action.payload };
    case 'SET_MAP':
      return { ...state, map: action.payload };
    case 'CANCEL_PRAYER':
      return {
        feed: state.feed.filter((p) => p.id !== action.payload),
        map: state.map.filter((p) => p.id !== action.payload),
      };
    case 'ADD_TO_FEED':
      return { ...state, feed: [...state.feed, action.payload] };
    case 'JOIN_PRAYER':
      feedIndex = findIndex(state.feed, { id: action.payload.prayerID });
      mapIndex = findIndex(state.map, { id: action.payload.prayerID });

      newFeed = [...state.feed];
      newMap = [...state.map];

      if (feedIndex !== -1) {
        // append user to the current participant list (feed)
        newFeed.splice(feedIndex, 1, {
          ...newFeed[feedIndex],
          participants: [...newFeed[feedIndex].participants, action.payload.user],
        });
      }
      if (mapIndex !== -1) {
        // append user to the current participant list (map)
        newMap.splice(mapIndex, 1, {
          ...newFeed[mapIndex],
          participants: [...newMap[mapIndex].participants, action.payload.user],
        });
      }
      return {
        feed: newFeed,
        map: newMap,
      };
    case 'LEAVE_PRAYER':
      feedIndex = findIndex(state.feed, { id: action.payload.prayerID });
      mapIndex = findIndex(state.map, { id: action.payload.prayerID });

      newFeed = [...state.feed];
      newMap = [...state.map];

      if (feedIndex !== -1) {
        // remove user from the current participant list (feed)
        newFeed.splice(feedIndex, 1, {
          ...newFeed[feedIndex],
          participants: newFeed[feedIndex].participants.filter(
            (p) => p.id !== action.payload.userID
          ),
        });
      }
      if (mapIndex !== -1) {
        // remove user from the current participant list (map)
        newMap.splice(mapIndex, 1, {
          ...newFeed[mapIndex],
          participants: newFeed[mapIndex].participants.filter(
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
