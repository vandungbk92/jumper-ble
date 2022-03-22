import React from 'react';
import { NavigationActions } from 'react-navigation';

let navigatorRef = React.createRef();

function setNavigatorRef(ref) {
  navigatorRef.current = ref;
}

function navigate(routeName, params) {
  navigatorRef.current?.dispatch(
    NavigationActions.navigate({ routeName, params })
  );
}

export default { setNavigatorRef, navigate };
