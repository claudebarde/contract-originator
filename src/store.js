import { writable } from "svelte/store";

const defaultState = {
  network: undefined,
  userAddress: undefined,
  Tezos: undefined,
  encodedMichelson: undefined
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
    }
  };
};

export default store();
