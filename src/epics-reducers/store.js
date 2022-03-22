var storeInstance = null;

// Get store instance
export function getStoreInstance() {
  return storeInstance;
}

// Set store instance
export function setStoreInstance(store) {
  storeInstance = store;
  return storeInstance;
}
