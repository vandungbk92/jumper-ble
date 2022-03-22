import {createAction} from 'redux-actions';

export const FETCH_LOADING = 'FETCH_LOADING';

export const fetchLoading = createAction(FETCH_LOADING);

export function fetchLoadingReducer(loading = false, action) {
  switch (action.type) {
    case FETCH_LOADING:
      return action.payload;
    default:
      return loading;
  }
}