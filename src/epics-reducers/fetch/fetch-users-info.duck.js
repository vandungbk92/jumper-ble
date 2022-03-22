import { createAction } from 'redux-actions';

import { getUserInfo } from '../services/userServices';

export const FETCH_USERS_INFO_REQUEST = 'FETCH_USERS_INFO_REQUEST';
export const FETCH_USERS_INFO_SUCCESS = 'FETCH_USERS_INFO_SUCCESS';
export const FETCH_USERS_INFO_FAILURE = 'FETCH_USERS_INFO_FAILURE';

export const fetchUsersInfoRequest = createAction(FETCH_USERS_INFO_REQUEST);
export const fetchUsersInfoSuccess = createAction(FETCH_USERS_INFO_SUCCESS);
export const fetchUsersInfoFailure = createAction(FETCH_USERS_INFO_FAILURE);

export const fetchUsersInfoEpic = (action, store) =>
  action.ofType(FETCH_USERS_INFO_REQUEST).mergeMap(async () => {
    try {
      const data = await getUserInfo();
      if (data) {
        return fetchUsersInfoSuccess(data);
      } else {
        return fetchUsersInfoFailure({});
      }
    } catch (error) {
      return fetchUsersInfoFailure({});
    }
  });

export function fetchUsersInfoReducer(userInfoRes = {}, action) {
  switch (action.type) {
    case FETCH_USERS_INFO_SUCCESS:
      return action.payload;
    case FETCH_USERS_INFO_FAILURE:
      return action.payload;
    default:
      return userInfoRes;
  }
}
