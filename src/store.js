import { writable } from "svelte/store";

const defaultState = {
  network: undefined,
  userAddress: undefined,
  encodedMichelson: undefined,
  storageStructure: undefined
};

const store = () => {
  const { subscribe, set, update } = writable(defaultState);

  return {
    subscribe,
    reset: () => {
      update(currentStore => ({
        ...defaultState
      }));
    },
    updateNetwork: network => {
      update(currentStore => ({ ...currentStore, network }));
    },
    updateUserAddress: address => {
      update(currentStore => ({ ...currentStore, userAddress: address }));
    },
    updateEncodedMichelson: code => {
      update(currentStore => ({ ...currentStore, encodedMichelson: code }));
    },
    updateStorageStructure: storage => {
      update(currentStore => ({ ...currentStore, storageStructure: storage }));
    }
  };
};

export default store();
