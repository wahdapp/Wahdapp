export const SET_FILTER = 'SET_FILTER';
export const INITIALIZE_FILTER = 'INITIALIZE_FILTER';
export const SET_SORT_BY = 'SET_SORT_BY';

export function setFilter(payload) {
  return {
    type: SET_FILTER,
    payload,
  };
}

export function initializeFilter(gender) {
  return {
    type: INITIALIZE_FILTER,
    payload: gender,
  };
}

export function setSortBy(payload) {
  return {
    type: SET_SORT_BY,
    payload,
  };
}
