import { comparableTypes } from "./types";

interface Result {
  result: boolean;
  type?: string;
  value?: string;
  error?: any;
}

export default (
  michelson: string,
  initParameter: string,
  initStorage: string
): Result => {
  // if one of the arguments is empty
  if (!michelson || !initParameter || !initStorage) return { result: false };

  let validParam = false;
  let validStorage = false;
  let paramType = "";
  let storageType = "";

  // extracts parameter and storage structure from contract code
  const parameter = michelson.match(/parameter(.*);/);
  if (parameter) {
    paramType = parameter[1].trim();
    // verifies the type in the parameter input is correctly set
    if (
      initParameter.replace(/\s+/g, "").slice(0, paramType.length) === paramType
    ) {
      validParam = true;
    }
  }

  const storage = michelson.match(/storage(.*);/);
  if (storage) {
    storageType = storage[1].trim();
    // verifies the type in the storage input is correctly set
    if (
      initStorage.replace(/\s+/g, "").slice(0, storageType.length) ===
      storageType
    ) {
      validStorage = true;
    }
  }

  if (validParam && validStorage) {
    return { result: true };
  } else {
    let error = { param: "", storage: "" };
    if (!validParam) {
      error.param = `Expected "${paramType}", got "${initParameter.trim()}"`;
    }
    if (!validStorage) {
      error.storage = `Expected "${storageType}", got "${initStorage.trim()}"`;
    }
    return { result: false, error };
  }
};
