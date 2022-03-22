import { combineEpics } from 'redux-observable';

import { fetchLoginEpic, fetchLogoutEpic } from './fetch/fetch-login.duck';
import { fetchUsersInfoEpic } from './fetch/fetch-users-info.duck';
import { fetchThongtinchungEpic } from './fetch/fetch-thongtinchung.duck';

const rootEpic = combineEpics(
  fetchLoginEpic,
  fetchLogoutEpic,
  fetchUsersInfoEpic,
  fetchThongtinchungEpic,
);

export default rootEpic;
