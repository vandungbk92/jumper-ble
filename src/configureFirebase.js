import * as firebase from 'firebase';

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyD7QX-x9_mZh36XP1h91Hqn8wMs-xkDRXk',
  authDomain: 'aibolit-2ec88.firebaseapp.com',
  databaseURL: 'https://aibolit-2ec88.firebaseio.com',
  projectId: 'aibolit-2ec88',
  storageBucket: 'aibolit-2ec88.appspot.com',
  messagingSenderId: '948632369964',
  appId: '1:948632369964:web:39708226c994afdcba4a89',
};

export default function configureFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }
}
