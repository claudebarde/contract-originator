import { comparableTypes } from "./types";
import nouns from "./nouns.json";

interface defaultParamStorage {
  param: string;
  storage: string;
}

const buildResult = (type: string, showType: boolean): string => {
  switch (type) {
    case "int":
    case "nat":
    case "mutez":
      return `${showType ? type + " " : ""}${Math.round(Math.random() * 1000)}`;
    case "string":
      return `${showType ? type + " " : ""}"${
        nouns[Math.floor(Math.random() * nouns.length)]
      }"`;
    case "bytes":
      return `${
        showType ? type + " " : ""
      }"0x05010000000b68656c6c6f20776f726c64"`;
    case "bool":
      return `${showType ? type + " " : ""}${
        +Date.now().toString()[12] > 5 ? "true" : "false"
      }`;
    case "key_hash":
      return `${
        showType ? type + " " : ""
      }"edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn"`;
    case "timestamp":
      return `${showType ? type + " " : ""}${Date.now().toString()}`;
    case "address":
      return `${
        showType ? type + " " : ""
      }"tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"`;
  }
};

const handlePair = (str: string): string => {
  // isolates fields
  const pairMatch = str.match(/\(pair\s([a-z_]+)\s([a-z_]+)\)/);
  const left = pairMatch[1];
  const right = pairMatch[2];
  if (comparableTypes.includes(left) && comparableTypes.includes(right)) {
    return `(Pair ${buildResult(left, false)} ${buildResult(right, false)})`;
  } else {
    return "";
  }
};

const handleMap = (str: string): string => {
  // isolates fields
  const mapMatch = str.match(/\(map\s([a-z_]+)\s([a-z_]+)\)/);
  const left = mapMatch[1];
  const right = mapMatch[2];
  if (comparableTypes.includes(left) && comparableTypes.includes(right)) {
    // builds a map from 0 to 9 elements
    const nrOfEls = +Date.now().toString()[12];
    let elements = "";
    for (let i = 0; i < nrOfEls; i++) {
      elements += `Elt ${buildResult(left, false)} ${buildResult(
        right,
        false
      )}${i !== nrOfEls - 1 ? " ; " : ""}`;
    }
    return `{ ${elements} }`;
  } else {
    return "";
  }
};

export default (code: string): defaultParamStorage | null => {
  const result: defaultParamStorage = { param: "", storage: "" };
  // isolates parameter values
  const paramMatch = code.match(/parameter\s+([a-z_\s\(\)]+)\s*;/);
  if (paramMatch) {
    const paramType = paramMatch[1].trim();
    if (comparableTypes.includes(paramType)) {
      // creates default parameter
      result.param = buildResult(paramType, true);
    } else if (paramType.slice(1, 5) === "pair") {
      // pair parameter
      result.param = handlePair(paramType);
    } else if (paramType.slice(1, 4) === "map") {
      // map parameter
      result.param = handleMap(paramType);
    }
  }

  // isolates storage values
  const storageMatch = code.match(/storage\s+([a-z_\s\(\)]+)\s*;/);
  if (storageMatch) {
    const storageType = storageMatch[1].trim();

    if (comparableTypes.includes(storageType)) {
      // creates default parameter
      result.storage = buildResult(storageType, true);
    } else if (storageType.slice(1, 5) === "pair") {
      // pair storage
      result.storage = handlePair(storageType);
    } else if (storageType.slice(1, 4) === "map") {
      // map storage
      result.storage = handleMap(storageType);
    }
  }

  console.log(result);

  if (result.param && result.storage) {
    return result;
  } else {
    return null;
  }
};
