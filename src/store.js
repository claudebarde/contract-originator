import { writable } from "svelte/store";

const defaultState = {
  network: undefined,
  userAddress: undefined,
  encodedMichelson: undefined,
  storageStructure: undefined,
  editor: undefined,
  codeStart: 0,
  darkMode: false,
  liveCoding: true,
  michelsonFiles: [],
  activeFile: undefined,
  endOfExecution: undefined
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
    },
    updateEditor: editor => {
      update(currentStore => ({ ...currentStore, editor }));
    },
    updateCodeStart: start => {
      update(currentStore => ({ ...currentStore, codeStart: start }));
    },
    changeDarkMode: state => {
      update(currentStore => ({ ...currentStore, darkMode: state }));
    },
    updateLiveCoding: state => {
      update(currentStore => ({ ...currentStore, liveCoding: state }));
    },
    updateMichelsonFiles: files => {
      update(currentStore => ({ ...currentStore, michelsonFiles: files }));
    },
    changeActiveFile: fileName => {
      update(currentStore => ({
        ...currentStore,
        activeFile: fileName,
        michelsonFiles: currentStore.michelsonFiles.map(file => {
          if (file.name === fileName) {
            return { ...file, active: true };
          } else {
            return { ...file, active: false };
          }
        })
      }));
    },
    updateEndOfExecution: state => {
      update(currentStore => ({ ...currentStore, endOfExecution: state }));
    }
  };
};

export default store();
