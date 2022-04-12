import { combineReducers } from 'redux';

import {requestLoginReducer, fetchLoginReducer, FETCH_LOGOUT_REQUEST} from './fetch/fetch-login.duck';
import { fetchUsersInfoReducer } from './fetch/fetch-users-info.duck';

import { fetchLoadingReducer } from './fetch/fetch-loading.duck';

/*const rootReducer = combineReducers({
  loginReq: requestLoginReducer,
  loginRes: fetchLoginReducer,
  userInfoRes: fetchUsersInfoReducer,
  isLoading: fetchLoadingReducer,
});*/

const appReducer = combineReducers({
  loginReq: requestLoginReducer,
  loginRes: fetchLoginReducer,
  userInfoRes: fetchUsersInfoReducer,
  isLoading: fetchLoadingReducer,
});

const rootReducer = (state, action) => {
  if (action.type === FETCH_LOGOUT_REQUEST) {
    state.loginReq = undefined;
    state.loginRes = undefined;
    state.userInfoRes = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
