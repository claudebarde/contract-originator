import { comparableTypes } from "./types";

interface defaultParamStorage {
  param: string;
  storage: string;
}

const buildResult = (type: string): string => {
  switch (type) {
    case "int":
    case "nat":
    case "mutez":
      return `${type} ${Math.round(Math.random() * 1000)}`;
    case "string":
      return `${type} "${+Date.now().toString()[12] > 5 ? "hello" : "world"}"`;
    case "bytes":
      return `${type} "0x05010000000b68656c6c6f20776f726c64"`;
    case "bool":
      return `${type} ${+Date.now().toString()[12] > 5 ? "true" : "false"}`;
    case "key_hash":
      return `${type} "edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn"`;
    case "timestamp":
      return `${type} ${Date.now().toString()}`;
    case "address":
      return `${type} "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"`;
  }
};

export default (code: string): defaultParamStorage | null => {
  const result: defaultParamStorage = { param: "", storage: "" };
  // isolates parameter values
  const paramMatch = code.match(/parameter\s+([a-z_]+)\s*;/);
  if (paramMatch) {
    const paramType = paramMatch[1];
    if (comparableTypes.includes(paramType)) {
      // creates default parameter
      result.param = buildResult(paramType);

      // isolates storage values
      const storageMatch = code.match(/storage\s+([a-z_]+)\s*;/);
      if (storageMatch) {
        const storageType = storageMatch[1];

        if (comparableTypes.includes(storageType)) {
          // creates default parameter
          result.storage = buildResult(storageType);

          return result;
        }
      }
    }
  }

  return null;
};
