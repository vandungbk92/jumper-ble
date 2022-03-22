import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAction } from 'redux-actions';

import { CONSTANTS } from '../../constants';

import { userLogin, unregisterDevice } from '../services/userServices';

export const FETCH_LOGIN_REQUEST = 'FETCH_LOGIN_REQUEST';
export const FETCH_LOGIN_SUCCESS = 'FETCH_LOGIN_SUCCESS';
export const FETCH_LOGIN_FAILURE = 'FETCH_LOGIN_FAILURE';

export const FETCH_LOGOUT_REQUEST = 'FETCH_LOGOUT_REQUEST';
export const FETCH_LOGOUT_SUCCESS = 'FETCH_LOGOUT_SUCCESS';

export const fetchLoginRequest = createAction(FETCH_LOGIN_REQUEST);
export const fetchLoginSuccess = createAction(FETCH_LOGIN_SUCCESS);
export const fetchLoginFailure = createAction(FETCH_LOGIN_FAILURE);

export const fetchLogoutRequest = createAction(FETCH_LOGOUT_REQUEST);
export const fetchLogoutSuccess = createAction(FETCH_LOGOUT_SUCCESS);

export const fetchLoginEpic = (action, store) =>
  action.ofType(FETCH_LOGIN_REQUEST).mergeMap(async () => {
    try {
      const data = await userLogin(store.getState().loginReq);
      if (data.token) {
        return fetchLoginSuccess({ token: data.token });
      } else {
        return fetchLoginFailure({ token: CONSTANTS.ERROR_AUTHEN });
      }
    } catch (error) {
      return fetchLoginFailure({ token: CONSTANTS.ERROR_AUTHEN });
    }
  });


export const fetchLogoutEpic = (action, store) =>
  action.ofType(FETCH_LOGOUT_REQUEST).mergeMap(async () => {
    try {
      return fetchLogoutSuccess({});
    } catch (error) {
      return fetchLogoutSuccess({});
    } finally {
      return fetchLogoutSuccess({});
    }
  });

export function requestLoginReducer(loginReq = {}, action) {
  switch (action.type) {
    case FETCH_LOGIN_REQUEST:
      return action.payload;
    default:
      return loginReq;
  }
}

export function fetchLoginReducer(loginRes = {}, action) {
  switch (action.type) {
    case FETCH_LOGIN_SUCCESS:
      AsyncStorage.setItem(CONSTANTS._CITIZEN_LOGIN_, JSON.stringify(action.payload));
      return action.payload;
    case FETCH_LOGIN_FAILURE:
      AsyncStorage.removeItem(CONSTANTS._CITIZEN_LOGIN_);
      return action.payload;
    case FETCH_LOGOUT_SUCCESS:
      AsyncStorage.removeItem(CONSTANTS._CITIZEN_LOGIN_);
      return action.payload;
    default:
      return loginRes;
  }
}
