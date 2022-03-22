import { createAction } from 'redux-actions';

import { getThongtinchung } from '../services/thongtinchungServices';

export const FETCH_THONGTINCHUNG_REQUEST = 'FETCH_THONGTINCHUNG_REQUEST';
export const FETCH_THONGTINCHUNG_SUCCESS = 'FETCH_THONGTINCHUNG_SUCCESS';
export const FETCH_THONGTINCHUNG_FAILURE = 'FETCH_THONGTINCHUNG_FAILURE';

export const fetchThongtinchungRequest = createAction(FETCH_THONGTINCHUNG_REQUEST);
export const fetchThongtinchungSuccess = createAction(FETCH_THONGTINCHUNG_SUCCESS);
export const fetchThongtinchungFailure = createAction(FETCH_THONGTINCHUNG_FAILURE);

export const fetchThongtinchungEpic = (action, store) =>
  action.ofType(FETCH_THONGTINCHUNG_REQUEST).mergeMap(async() => {
    try {
      const data = await getThongtinchung();
      if (data) {
        return fetchThongtinchungSuccess(data);
      } else {
        return fetchThongtinchungFailure({});
      }
    } catch (error) {
      return fetchThongtinchungFailure({});
    }
  });

export function fetchThongtinchungReducer(state = {}, action) {
  switch (action.type) {
    case FETCH_THONGTINCHUNG_SUCCESS:
      return action.payload;
    case FETCH_THONGTINCHUNG_FAILURE:
      return action.payload;
    default:
      return state;
  }
}
