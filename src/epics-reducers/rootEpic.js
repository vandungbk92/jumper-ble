import { combineEpics } from 'redux-observable';

import { fetchLoginEpic, fetchLogoutEpic } from './fetch/fetch-login.duck';
import { fetchUsersInfoEpic } from './fetch/fetch-users-info.duck';

const rootEpic = combineEpics(
  fetchLoginEpic,
  fetchLogoutEpic,
  fetchUsersInfoEpic,
);

export default rootEpic;
